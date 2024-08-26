import path from 'path';
import fs from 'fs';
import {kristal_api} from '../src/docparser.mjs';
import getArticleMetadata from '../src/getArticleMeta.mjs';

import sanitizeHtml from 'sanitize-html';

import {remark} from 'remark';
import mdx from 'remark-mdx';
import strip from 'remark-mdx-to-plain-text';
import lunr from 'lunr';

const FILE_NAME = "wiki-index.json"

const BOOST = Object.freeze({
    ARTICLE: 10,
    API_TYPE: 5,
    API_FIELD: 1,

    TITLE: 10,
    TAGS: 2,
    DESCRIPTION: 1,
    //CONTENT: 1,
});

console.log("[wiki-index] Generating search index...");

const dirRelativeToPublicFolder = './data/articles'
const dir = path.resolve('./app/', dirRelativeToPublicFolder);
const paths = fs.readdirSync(dir, {recursive: true})

const articles = paths.map(rpath => {
    const slug = rpath.substring(0,rpath.indexOf("."));
    const metadata = getArticleMetadata(slug)
    var body = fs.readFileSync(dir + path.sep + rpath).toString()
    remark()
    .use(mdx)
    .use(strip)
    .process(
        body.split("\n")
        .map( (line) =>
            {
                line = line[0] == "#" ? line.replace(/(?<!# )\[[\w-]*\]/g, "") : line; //preliminary heading-link parse out, dont match ### [text](link), parsed later
                line = line.indexOf("import ") == 0 ? "" : line; //remark mdx doesnt catch this
                line = line.indexOf("export ") == 0 ? "" : line; //this neither :(
                return line;
            }
        ).join("\n"),
        function(err, file) {
            body = sanitizeHtml(String(file.value), {allowedTags: []});
            if (err){
                console.warn("Couldn't parse "+slug+", is it .mdx?");
                //throw err;
            }     
    });
    
    return {
        id: JSON.stringify({
            route: "/wiki/" + slug,
            title: metadata.title ?? "[NO TITLE]",
            description: metadata.description ?? "[NO DESCRIPTION]"
        }),

        title: metadata.title ?? "[NO TITLE]",
        description: metadata.description ?? "[NO DESCRIPTION]",
        content: body,
        tags: (metadata.tags ?? []).join(" "),
        boost: BOOST.ARTICLE
    }
});
//type and function of type lookup

const apiType = [];
const apiField = [];
kristal_api.forEach( (doc) => {
    //let text = "";
    if(doc.fields) {
        doc.fields.forEach( (field) => {
            let desc =  (field.desc ?? field.rawdesc) ?? "";
            const delim = field.extends.args?.[0]?.name=="self" ? ":" : "."
            apiField.push({
                id: JSON.stringify({
                    route: "/wiki/api/" + doc.name + "#" + field.name,
                    title: doc.name + delim + field.name,
                    description: "(API: " + field.type.replace("set", "").replace("doc.", "") + ")" + desc
                }),

                title: field.name,
                description: "(API: " + field.type.replace("set", "").replace("doc.", "") + ")" + desc,
                //content: doc.name + "." + field.name,
                tags: (["_class_"+doc.name, "API"]).join(" "),
                boost: BOOST.API_FIELD
            });
            //text = text + " | " + field.name + " " + desc
        });
    }
    apiType.push({
        id: JSON.stringify({
            route: "/wiki/api/" + doc.name,
            title: doc.name,
            description: "(API: " + doc.type.replace("set", "") + ")" + ((doc.desc ?? doc.rawdesc) ?? "")
        }),

        title: doc.name,
        description: "(API: " + doc.type.replace("set", "") + ")" + ((doc.desc ?? doc.rawdesc) ?? ""),
        //content: text,
        tags: (["API"]).join(" "),
        boost: BOOST.API_TYPE
    })
})

const corpus = articles.concat(apiType).concat(apiField);

var index = lunr(function() {
    this.ref("id");
    this.field("title", {boost: BOOST.TITLE});
    this.field("description", {boost: BOOST.DESCRIPTION});
    this.field("tags", {boost: BOOST.TAGS});
    //this.field("content", {boost: BOOST.CONTENT});

    this.k1(1.2)
    this.b(0.0)

    corpus.forEach(function (doc) {
        this.add(doc, {boost: doc.boost});
    }, this);
})
index.pipeline.remove(index.stemmer)

console.log(`[wiki-index] Generated index for ${corpus.length} documents.`);

fs.writeFileSync(path.join(process.cwd(),`/app/data/${FILE_NAME}`),
    JSON.stringify(index, null, 4)
);

console.log(`[wiki-index] Done! Wrote index to /app/data/${FILE_NAME}`);
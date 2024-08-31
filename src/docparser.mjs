import path from 'path';
import fs from 'fs';

const file = fs.readFileSync(path.join(process.cwd(),'/app/data/doc.json'), 'utf8');
const data = JSON.parse(file);


export const kristal_api = [];
export const kristal_api_index = new Map();
export const kristal_api_inheirtance_tree = []

// Build array of kristal api and a lookup map for array
data.forEach( (doc) => {
    if (doc.name.match(/[:\\.]/))
        return
    if (doc.type === 'type') {
        let index = kristal_api_index.get(doc.name)
        if (index){
            kristal_api[index] = doc;
        } else {
            kristal_api.push(doc);
            kristal_api_index.set(doc.name, kristal_api.length - 1); //name and index to indexed
        }
    
    //rejects global variables that are indexed (should be part of type's fields instead)
    } else if (doc.type === 'variable' && !kristal_api_index.get(doc.name) && !(doc.name.indexOf('.') > -1) ) {
        kristal_api.push(doc);
        kristal_api_index.set(doc.name, kristal_api.length - 1)
    }
})
//sort and populate methods/fields/undoc
kristal_api.forEach( (doc) => {
    
    doc.method = []
    doc.constructor = null

    doc.field = []
    doc.undocumented = []

    doc.hierarchy = null
    doc.description = doc.desc || doc.rawdesc || doc.defines[0].desc
    doc.isClass = doc.defines[0].type === "doc.class"

    doc.fields?.forEach( (field) => { switch (field.extends.type) {
        case "function":
            if (field.name === "init" && doc.isClass)
                doc.constructor = field;
            else
                doc.method.push(field);
            break
        case "doc.type":
            doc.field.push(field)
            break
        default:
            doc.undocumented.push(field)
        }   
    })
})
//sort alphabetically at build time
kristal_api.sort( (a, b) => {
    return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1
})

function findHierarchy(doc_index, __arr = []) {
    var i = kristal_api.findIndex((element) => kristal_api[doc_index]?.defines?.[0]?.extends?.[0]?.view == element.name)
    if(i >= 0)
        findHierarchy(i, __arr)
    __arr.push(doc_index)
    return __arr
}
kristal_api.forEach( (doc, i) => {
    //inheritance hierarchy    
    doc.hierarchy = findHierarchy(i).map( (hierarchy_index) => kristal_api[hierarchy_index] )
    doc.hierarchy.pop()
    doc.hierarchy.reverse()
    kristal_api_index.set(doc.name, i)
})
//build inheritance tree
kristal_api.forEach( (doc, doc_index) => {
    var super_node = kristal_api_inheirtance_tree
    findHierarchy(doc_index).forEach( (super_doc_index) => {
        var common_super = super_node.find( (node) => node.index == super_doc_index)
        if(! common_super) {
            common_super = {index: super_doc_index, children: []}
            super_node.push(common_super)
        }
        super_node = common_super.children
    })
})

export function sanitizeKristalLink(link) {
    // strip anything before /Kristal/ in the URL
    const index = link.indexOf('/Kristal/');
    return link.substring(index);
}

export function sanitizeGithubLink(link){
    return "https://github.com/KristalTeam/Kristal/" + sanitizeLink(link)
}

export function getDocumentation(name) {
    return kristal_api[kristal_api_index.get(name)]
}
import { notFound } from 'next/navigation';
import { kristal_api } from '/src/docparser.mjs';
import { redirect } from 'next/navigation';
import { getDocumentation, getDocumentationHeirachy} from '/src/docparser'
import styles from './page.module.css'

import Markdown from '/components/Markdown'
import Docbox from '/components/Docbox';
import { Fragment } from 'react';

import Link from 'next/link';

import sanitizeHtml from 'sanitize-html';

export function generateStaticParams() {
    return kristal_api.map( (doc) => ({doc: doc.name}) )
}
export const dynamicParams = false

export async function generateMetadata({ params }){
    const { doc } = await params
    return {
        title: String(doc) + " | " + "Kristal API",
        description: "Kristal API Reference"
    }
}

const hoverText = {
    '|': "either type",
    '?': "optional value",
    '(': "group start",
    ')': "group end"
}

const outgoingLinks = {
    nil: "https://www.lua.org/pil/2.1.html",
    boolean: "https://www.lua.org/pil/2.2.html",
    number: "https://www.lua.org/pil/2.3.html",
    integer: "https://www.lua.org/pil/2.3.html",
    string: "https://www.lua.org/pil/2.4.html",
    table: "https://www.lua.org/pil/2.5.html",
    function: "https://www.lua.org/pil/5.html",
    userdata: "https://www.lua.org/pil/2.7.html",
    thread: "https://www.lua.org/pil/2.7.html",

    any: "https://www.lua.org/pil/2.html"
}

function tryGetLoveWiki(str){
    var loveRef = str.split("love.")[1]
    if(loveRef) {
        return "https://love2d.org/wiki/" + loveRef
    }
}

const GITHUB_SOURCE = 'https://github.com/KristalTeam/Kristal/blob/main'
function getGithubLink(type) {
    var start = type.defines[0].extends?.start?.[0] || type.defines[0].extends?.[0]?.start[0] || type.defines[0].start[0]
    var finish = type.defines[0].extends?.finish?.[0] || type.defines[0].extends?.[0]?.finish[0] || type.defines[0].finish[0]
    return GITHUB_SOURCE + type.defines[0].file + '#' +
        ('L' + (start + 1)) +
        ('L' + (finish + 1))
}
// https://github.com/KristalTeam/Kristal/blob/main/src/lib/https.lua#L7-L14
function getGithubFieldSection(field) {
    return GITHUB_SOURCE + field.file + '#' +
        ('L' + (field.extends.start[0] + 1)) +
        ('L' + (field.extends.finish[0] + 1))
}

//parses text for documentation keywords and assigns appropriate refrence links / hover info
function parseTypes(view){
    //split by ? and |
    var strs = view.split(/(\?|\||\(|\))/)
    //remove trailing nullstring if it exists (? at end probably) 
    if(strs[strs.length - 1] == "") {
        strs.pop()
    }
    //remove <T> from string. not quite sure why this happens to some and not others
    strs = strs.map( (str) => str.split(/:|>/)[1] || str )
    return strs.map( (str, i) => 
        (hoverText[str])
        ? <span key = {i} className = {styles.syntaxTypeMod} title = {hoverText[str]}>{str}</span>
        //check outgoing links v 
        : <Link key = {i} className = {styles.syntaxType} href = { outgoingLinks[str] ||tryGetLoveWiki(str) ||("/wiki/api/" + str) }><span>{str}</span></Link>
    )
}

const DescriptionMarkdown = ({className, markdown}) => 
    <div className = {className}>
        <Markdown markdown = {markdown}/>
    </div>

const OptionalConstructor = ({doc}) => doc.constructor ? <>
    <details id = "Constructor" open>
        <summary className = {styles.detailHeader}>
            <h2 className = {styles.syntaxObject}>Constructor</h2>
        </summary>
        <hr/>
        <div id = "init">
            <h3>
                <a className = {styles.syntaxObject} href = "#init">
                    <span>{doc.name}</span>
                </a>
                <span className = {styles.syntax}>(</span>
                { doc.constructor.extends.args.map((arg, i) => 
                <span key = {i} className = {styles.syntax}>
                    <span className = {styles.syntaxSymbol}>{arg.name}</span>
                    <span>: </span>
                    {parseTypes(arg.view)}
                    { i < doc.constructor.extends.args.length-1 ? <span>, </span> : null}
                </span>
                )}
                <span className = {styles.syntax}>)</span>
            </h3>
            
            <Link href={getGithubFieldSection(doc.constructor)}>See Github</Link>

            <DescriptionMarkdown className = {styles.docDescription} 
                markdown = {doc.constructor.rawdesc || doc.constructor.desc}
            />

            <p>Arguments:</p>
            <table>
                <tbody>
                { doc.constructor.extends.args.map( (arg, i) =>
                <tr key = {i}>
                    <td>
                        <span className = {styles.syntaxSymbol}>{arg.name}</span>
                        <span className = {styles.syntax}>: </span>
                        {parseTypes(arg.view)}
                    </td>
                    <td>
                    <DescriptionMarkdown className = {styles.docDescription} 
                        markdown = {arg.rawdesc || arg.desc}
                    />
                    </td>
                </tr>
                )}
                </tbody>
            </table>
        </div>

        <br/>

    </details>

    <hr/>
</> : null

const OptionalMethods = ({doc}) => doc.method.length > 0 ? <>
    <details id="Methods" open>
        <summary className = {styles.detailHeader}>
            <h2 className = {styles.syntaxMethod}>Methods</h2>
        </summary>

        {doc.method.map( (method, i) => <Fragment key = {i}>
        <hr/>

        <div id = {method.name}>

            <h3>
                <a href={"#"+method.name}>
                    <span className = {styles.syntaxObject}>{doc.name}</span>
                    <span className = {styles.syntax}>{method.extends.args[0] && method.extends.args[0].name==="self" ? ":" : "." }</span>
                    <span className = {styles.syntaxMethod}>{method.name}</span>
                </a>
                <span className = {styles.syntax}>(</span>
                { method.extends.args.map( (arg, arg_i) => (arg_i == 0 && arg.name == "self") ? null :
                <span key = {arg.name+arg_i} className = {styles.syntax}>
                    <span className = {styles.syntaxSymbol}>{arg.name}</span>
                    <span>: </span>
                    {parseTypes(arg.view)}
                    {arg_i < method.extends.args.length-1 ? <span>, </span> : null}
                </span>
                )}
                <span className = {styles.syntax}>)</span>
            </h3>

            <Link href={getGithubFieldSection(method)}>See Github</Link>
            
            <DescriptionMarkdown className = {styles.docDescription} 
                markdown = {method.rawdesc || method.desc}
            />

            { method.extends.args?.length > 0 &&
              !(method.extends.args[0].name === "self" && method.extends.args.length == 1) ?
            <>
            <p>Arguments:</p>
            <table>
                <tbody>
                { method.extends.args.map( (arg, arg_i) =>  (arg_i == 0 && arg.name == "self") ? null :
                    <tr key = {method.name + arg.name}>
                        <td>
                            <span className = {styles.syntaxSymbol}>{arg.name}</span>
                            <span className = {styles.syntax}>: </span>
                            {parseTypes(arg.view)}
                        </td>
                        <td>
                            <DescriptionMarkdown className = {styles.docDescription} 
                                markdown = {arg.rawdesc || arg.desc}
                            />
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            </> : null}

            {method.extends.returns?.length > 0 ?
            <>
            <p>Returns: </p>
            <table>
                <tbody>
                { method.extends.returns.map( (ret, ret_i) => 
                    <tr key = {ret_i}>
                        <td>
                            <span className = {styles.syntaxSymbol}>{ret.name || ret_i + 1}</span>
                            <span className = {styles.syntax}>: </span>
                            {parseTypes(ret.view)}
                        </td>
                        <td>
                            <DescriptionMarkdown className = {styles.docDescription} 
                                markdown = {ret.rawdesc || ret.desc}
                            />
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            </> : null }

        </div>
        </Fragment>)}
    </details>
    <hr/>
</> : null

const OptionalFields = ({doc, field_list, class_style, label}) => field_list.length > 0 ? <>
    <details id = {label} open>
        <summary className = {styles.detailHeader}>
            <h2 className = {class_style}> {label} </h2>
        </summary>

        { field_list.map( (field, i) => <Fragment key = {i}>
        <hr/>

        <div id={field.name}>
            <h3>
                <a href={"#"+field.name}>
                    <span className = {styles.syntaxObject}>{doc.name}</span>
                    <span className = {styles.syntax}>.</span>
                    <span className = {class_style}>{field.name}</span>
                </a>
                <span className = {styles.docDescription}>: </span>
                {parseTypes(field.extends.view)}
            </h3>
            
            <Link href={getGithubFieldSection(field)}>See Github</Link>

            <div className = {styles.docDescription}>
                <DescriptionMarkdown className = {styles.docDescription} 
                    markdown = {field.rawdesc || field.desc}
                />
            </div>
        </div>
        </Fragment>)}
    </details>
    <hr/>
</> : null

const OptionalValue = ({docDefine}) => {
    if (!docDefine)
        return null
    if (typeof(docDefine.value) != 'object') 
        return <div>
            <p>Default: </p><span>{docDefine.value}</span>
        </div>
    return <table>
        <thead key = "table_header">
            <tr>
                <th>Key</th>
                <th>Value</th>
                <th>Notes</th>
            </tr>
        </thead>
        { docDefine.value.map( (value, index) =>
        <tbody key = {index}>
            <tr>
                <td>{value.key}</td>
                <td>{value.value}</td>
                <td>{value.desc || ""}</td>
            </tr>
        </tbody>
        )}
    </table>
}

export default async function Page({ params }) {
    const { doc } = await params
    const slug = decodeURIComponent(doc)
    const documentation = getDocumentation(slug)
    //-Name
    //--?Inheritance Hierarchy
    //---Description
    //-?Constructor
    //---init
    //-?Methods
    //---[methods]
    //-?Fields
    //---[fields]
    //-?Undocumented
    //---[undocumented]
    return <Docbox className = {styles.wikiNoShadow}>
        <h1 id = {documentation.name}>
            <a href = {"#"+documentation.name}> {documentation.name} </a> 
        </h1>
        <h4>
        {documentation.hierarchy.map( (cls, index) => 
            <span key = {cls.name} style={{color: "gray"}}>
            {index === 0 ? "┗> " : " > "}
            <Link href={"/wiki/api/" + cls.name}>{cls.name}</Link>
            </span>
        )}
        </h4>
        <Link href={getGithubLink(documentation)}>See Github</Link>
        <Markdown markdown = {documentation.description}></Markdown>
        <br/>
        <OptionalConstructor doc = {documentation}/>
        <OptionalMethods doc = {documentation}/>
        <OptionalFields doc = {documentation} field_list = {documentation.field} class_style = {styles.syntaxField} label = "Fields"/>
        <OptionalFields doc = {documentation} field_list = {documentation.undocumented} class_style = {styles.syntaxUndocumented} label = "Undocumented"/>
        <OptionalValue docDefine = {documentation.defines[0]}/>
    </Docbox>
}
 
import { notFound } from 'next/navigation';
import { kristal_api } from 'src/docparser.mjs';
import { redirect } from 'next/navigation';
import { getDocumentation, getDocumentationHeirachy} from 'src/docparser'
import styles from './page.module.css'

import Markdown from 'components/Markdown'
import Docbox from 'components/Docbox';
import { Fragment } from 'react';

import Link from 'next/link';

export function generateStaticParams() {
    return kristal_api.map( (doc) => ({doc: doc.name}) )
}
export const dynamicParams = false

export function generateMetadata({ params }){
    return {
        title: String(params.doc) + " | " + "Kristal API",
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
                    {i < method.extends.args.length-1 ? <span>, </span> : null}
                </span>
                )}
                <span className = {styles.syntax}>)</span>
            </h3>

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

export default function Page({ params }) {
    const slug = decodeURIComponent(params.doc)
    const doc = getDocumentation(slug)
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
        <h1 id = {doc.name}>
            <a href = {"#"+doc.name}> {doc.name} </a> 
        </h1>
        <h4>
        {doc.hierarchy.map( (cls, index) => 
            <span key = {cls.name} style={{color: "gray"}}>
            {index === 0 ? "┗> " : " > "}
            <Link href={"/wiki/api/" + cls.name}>{cls.name}</Link>
            </span>
        )}
        </h4>
        <p>{doc.description}</p>

        <br/>
        <OptionalConstructor doc = {doc}/>
        <OptionalMethods doc = {doc}/>
        <OptionalFields doc = {doc} field_list = {doc.field} class_style = {styles.syntaxField} label = "Fields"/>
        <OptionalFields doc = {doc} field_list = {doc.undocumented} class_style = {styles.syntaxUndocumented} label = "Undocumented"/>
    </Docbox>
}
 
import {getDocumentation} from '/src/docparser'
import { kristal_api } from '/src/docparser.mjs';
import styles from '/components/Sidebar.module.css'
import docstyles from '/app/wiki/api/[doc]/page.module.css'

export async function generateStaticParams() {
    return kristal_api.map( (doc) => ({doc: doc.name}) )
}
export const dynamicParams = false

const ListFieldAnchors = ({fields, class_style}) => fields.map( (field, i) =>
    <h5 key = {i}>
        <a href={`#${field.name}`} className={class_style}>
            {field.name}
        </a>
    </h5>
);

const OptionalConstructor = ({doc}) => doc.constructor ?
    <>
    <h4>
        <a href={`#init`} className={`${docstyles.syntaxObject}`}>
            Constructor
        </a> 
    </h4>
    <br/>
    </>
    : null

const OptionalMethods = ({doc}) => doc.method.length > 0 ?
    <>
    <h3>
        <a href={`#Methods`} className={docstyles.syntaxMethod}>
            Methods
        </a>
    </h3>
    <hr/>
    <ListFieldAnchors fields={doc.method} class_style={docstyles.syntaxMethod}/>
    <br/>
    </>
    : null

const OptionalFields = ({doc}) => doc.field.length > 0 ?
    <>
    <h3>
        <a href={`#Fields`} className={docstyles.syntaxField}>
            Fields
        </a>
    </h3>
    <hr/>
    <ListFieldAnchors fields={doc.field} class_style={docstyles.syntaxField}/>
    <br/>
    </>
    : null

const OptionalUndocumented = ({doc}) => doc.undocumented.length > 0 ?
    <>
    <h3>
        <a href={`#Fields`} className={docstyles.syntaxUndocumented}>
            Undocumented
        </a>
    </h3>
    <hr/>
    <ListFieldAnchors fields={doc.undocumented} class_style={docstyles.syntaxUndocumented}/>
    <br/>
    </>
    : null

export default async function Page({params}) {
    const { doc } = await params
    const path = decodeURIComponent(doc)
    const ref = path.split(/[:\\.]/)
    const slug = ref[0]

    const documentation = getDocumentation(slug)

    return <div className = {styles.anchor}>
        <h2>
            <a href={`#${documentation.name}`}> {documentation.name} </a>
        </h2>
        <hr/>

        <OptionalConstructor doc={documentation}/>
        <OptionalMethods doc={documentation}/>
        <OptionalFields doc={documentation}/>
        <OptionalUndocumented doc={documentation}/>
    </div>
}
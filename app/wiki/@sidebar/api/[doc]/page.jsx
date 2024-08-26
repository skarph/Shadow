import {getDocumentation} from 'src/docparser'
import styles from 'components/Sidebar.module.css'
import docstyles from 'app/wiki/api/[doc]/page.module.css'

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

export default function Page({params}) {
    const path = decodeURIComponent(params.doc)
    const ref = path.split(/[:\\.]/)
    const slug = ref[0]

    const doc = getDocumentation(slug)

    return <div className = {styles.anchor}>
        <h2>
            <a href={`#${doc.name}`}> {doc.name} </a>
        </h2>
        <hr/>

        <OptionalConstructor doc={doc}/>
        <OptionalMethods doc={doc}/>
        <OptionalFields doc={doc}/>
        <OptionalUndocumented doc={doc}/>
    </div>
}
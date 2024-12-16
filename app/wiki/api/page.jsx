import { kristal_api_inheirtance_tree, kristal_api} from '/src/docparser';
import Docbox from '/components/Docbox';
import styles from './page.module.css';
import Link from 'next/link';
import SwapVisibilityButton from '/components/SwapVisibilityButton'
import { Fragment } from 'react';

export const metadata = {
    title: 'API Reference',
    description: 'Kristal\'s API reference',
}

const ListAlphabetical = () => {
    const container = []
    //kristal_api is already alphabetical. no need to sort
    kristal_api.forEach( (doc, doc_index) => {
        let letter = doc.name[0].toUpperCase().charCodeAt(0)
        if(! container[letter]){
            container[letter] = []
        }
        container[letter].push(doc_index)
    })

    return container.map( (section, char) => {
        const letter = String.fromCharCode(char).toUpperCase()
        return <Fragment key = {letter}>
                <details id = {letter} open>
                    <summary><h1>{letter}</h1></summary>
                    <hr/>
                    { section.map( (doc_index) => {
                        const doc = kristal_api[doc_index]
                        return <div key={doc.name}>
                            <Link href = {`/wiki/api/${doc.name}`} className = {styles[doc.type]}> {doc.name} </Link>
                        </div>
                    })}
                </details>
        </Fragment>   
    })
}

const ListTreeRoot = () => 
    <ul className={styles.tree}>
        {kristal_api_inheirtance_tree.map( (node) =>
            <ListTreeItem node = {node} key = {kristal_api[node.index].name} />    
        )}
    </ul>

//https://stackoverflow.com/questions/53773088/create-nested-jsx-list-items-from-multi-level-nested-array-of-objects-reactjs
const ListTreeItem = ({ node }) => {
    let componet_children = null;
    if (node.children && node.children.length > 0) {
        componet_children = (
        <ul>
          {node.children.map(child_node => (
            <ListTreeItem node = {child_node} key = {kristal_api[child_node.index].name}/>
          ))}
        </ul>
      );
    }
    const doc = kristal_api[node.index]
    return (
        <li>
        {
        componet_children ?
            <details open>
                <summary><Link href={`/wiki/api/${doc.name}`} className={styles[doc.type]}> {doc.name} </Link></summary>
                <ul>
                    {componet_children}
                </ul>
            </details>
        :
            <Link href = {`/wiki/api/${doc.name}`} className = {styles[doc.type]}> {doc.name} </Link>
        }
        </li>
    )
}

export default function Page() {
    return (<>
        <h1 className = {styles.headerCenter}>API Reference</h1>
        <SwapVisibilityButton elementA = "tree" elementB = "alphabetical"/>
        <Docbox id = "tree" className = {styles.wikiNoShadow} style={{display: "none"}}>
            <ListTreeRoot/>
        </Docbox>
        <Docbox id = "alphabetical" className = {styles.wikiNoShadow}>
            <ListAlphabetical/>
        </Docbox>
    </>)
}
import { TYPES, sanitizeLink } from '/src/docparser.js';
import styles from './page.module.css';
import Link from 'next/link';

export default async function Api() {

    // read the json file from data/doc.json
    // and parse it into a javascript object

    // then, use the object to generate the page

    const types = TYPES

    return (
        <div>{types.map(async (type) => {
            return <div key={type.name}>
                <Link href={`/wiki/api/${type.name}`} className={styles.type}><h2>{type.name}</h2></Link>
                <hr/>
                <p>{type.desc}</p>
            </div>
        })}</div>
    )
}

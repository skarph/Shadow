import { TYPES, sanitizeLink } from '/src/docparser.js';
import styles from './page.module.css';
import Link from 'next/link';

export const metadata = {
    title: 'API Reference',
    description: 'Kristal\'s API reference',
}

export default async function Api() {

    // read the json file from data/doc.json
    // and parse it into a javascript object

    // then, use the object to generate the page

    const types = TYPES

    return (
        <div>{types.map((type) => {
            return <div key={type.name}>
                <h2><Link href={`/wiki/api/${type.name}`} className={styles.type}>{type.name}</Link></h2>
                <hr/>
                <p>{type.desc}</p>
            </div>
        })}</div>
    )
}

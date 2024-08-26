import Link from 'next/link';
import { createElement } from 'react';
import styles from './ArticleMeta.module.css';
import prettyTag from 'src/prettyTag.mjs';
import styles_sidebar from './Sidebar.module.css';

export function ArticleHeader({ children, className, metadata, ...props}) {
    let title = metadata.title
    let description = metadata.description
    let authors = metadata.authors
    let date = metadata.date
    let kristal_version = metadata.kristal_version
    let style_symbol

    //version numbers obey lexiographic ordering
    if(kristal_version > process.env.NEXT_PUBLIC_KRISTAL_VERSION) {
        style_symbol = styles.beta
        kristal_version = kristal_version + " (BETA)"
    }else if(kristal_version < process.env.NEXT_PUBLIC_KRISTAL_VERSION) {
        style_symbol = styles.old
        kristal_version = kristal_version + " (OLD)"
    } else {
        style_symbol = styles.stable
    }

    if(authors){
        authors = <span className = {styles.authors}>
            <p>{`Author${authors.length > 1 ? "s" : ""}: `}</p>
            <ul>
                {authors.map( (author, i) => <li key = {author.name}>
                    {
                        author.url ? 
                        <Link href={author.url ?? ""}>{author.name}</Link>
                        :
                        author.name
                    }
                </li>
                )}
            </ul>
        </span>
    }

    let content = <>
        <div className={styles.top}>
            <span className={style_symbol} title={`This article is accurate for Kristal v${kristal_version}`}>{kristal_version}</span>
            {authors}
            <span title={`Last updated ${date}`}>{date}</span>
            
        </div>
        <h1 href={`#${title}`}><Link href={`#${title}`} className={styles.title}>{title}</Link></h1>
        <p className={styles.description}>{description}</p>
    </>

    if (className) {
        return <div className={`${className} ${styles.header}`} {...props}>{content}{children}</div>;
    }
    return <div className={styles.header} {...props}>{content}{children}</div>;
}

//className = {`${styles.anchor} ${styles[`anchor${anchor.level}`]}`}
export const ArticleAnchors = ({metadata}) => 
    <div className={styles_sidebar.anchor}> {
    metadata.anchors.map( (anchor, i) =>
        <>
        {createElement(`h${Math.min(anchor.level+1,5)}`, {key: i},
            <a href={`#${anchor.href}`} key = {i}>
                {prettyTag(anchor.href)}            
            </a>
        )}
        {anchor.level <= 2 ? <hr/> : null}
        </>
    )} </div>
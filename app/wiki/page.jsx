import Box from '/components/Box'
import styles from './page.module.css'
import Link from 'next/link'
import {searchQuery} from '/src/wikisearch.js'
import SearchResultsPaginate from '/components/SearchResultsPaginate'
import Image from 'next/image'
import prettyTag from '/src/prettyTag.mjs'

import meta_list from '/app/data/meta-list.json'
import title_logo_shadow from '/public/title_logo_shadow.png'

function TableArticleLinks({columns}) {
    const tag_article = [] // [ {tag: string, articles=[]}, ... ]

    meta_list.forEach( (metadata) => {
        let tag = metadata.tags[0]
        let pair = tag_article.find( (p) => p.tag === tag )
        if(!pair){
            pair = {tag, articles: []}
            tag_article.push(pair)
        }
        pair.articles.push(
            metadata
        )
    })

    tag_article.sort( (a,b) => a.tag > b.tag ? 1 : -1)
    tag_article.forEach( (pair) => pair.articles.sort( (a,b) => a.title > b.title ? 1 : -1 ) )
    
    return <ul className = {styles.container}>
        {tag_article.map( (pair) =>
        <li key = {pair.tag} className = {styles.col}>
            <h2>{prettyTag(pair.tag)}</h2>
            <hr/>
            {pair.articles.map( metadata => 
                <div key = {metadata.slug} className = {styles.article}>
                    <Link href = {`/wiki/${metadata.slug}`}><h3>{metadata.title}</h3></Link>
                    <p>{metadata.description}</p>
                </div>
            )}

        </li>
        )}
    </ul>
}

export default async function Page({
    params,
    searchParams,
}) {
    const { search } = await searchParams 
    return(<>
    <Image src={title_logo_shadow} alt="title logo" className={styles.logo} />
    
    {
        search ?
        <Box>
            <h2>{"Search Reults for: \""+search+"\""}</h2>
            <SearchResultsPaginate itemsPerPage = {10} items = {searchQuery(search)}/>
        </Box>
        :<></>
    }
    <Box>
        Kristal is an *awesome* DELTARUNE fangame engine, written in Lua, using LÖVE.
    </Box>
    <Box>
        <h2>Featured Articles</h2>
        <br/>
        <TableArticleLinks columns = {3}/>
    </Box>
    <Box>
        <h2> Getting Started </h2>
        <hr/>

        The first thing you should do is go ahead and download the engine. Read the <Link href="/wiki/downloading">download guide</Link> for more information.
    </Box>

    <Box>
        <h2>Contributing to the Wiki</h2>
        <hr/>

        If you want to contribute to the wiki, you can do so by forking the repository and making a pull request. You can find the repository <Link href="https://github.com/KristalTeam/Shadow">here</Link>.
    </Box>

    </>)
}

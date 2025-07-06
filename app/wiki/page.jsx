import Box from 'components/Box'
import styles from './page.module.css'
import Link from 'next/link'
import { searchQuery } from 'src/wikisearch.js'
import SearchResultsPaginate from 'components/SearchResultsPaginate'
import NewTab from "components/NewTab"

export default function Page({
    params,
    searchParams,
}) {

    return (<>
    <picture className={styles.logo}>
        <img src="title_logo_shadow.png" alt="title logo" />
    </picture>
    
    {
        searchParams.search ?
        <Box>
            <h2>{"Search Reults for: \""+searchParams.search+"\""}</h2>
            <SearchResultsPaginate itemsPerPage = {10} items = {searchQuery(searchParams.search)}/>
        </Box>
        : <>
            <Box>
                <p>
                    Kristal is an *awesome* <b>DELTARUNE</b> fangame engine, written in <b>Lua</b>, using <NewTab href="https://love2d.org/">LÖVE</NewTab>.
                </p>
            </Box>

            <Box>
                <h2>Getting Started</h2>
                <hr/>
                <p>
                    No matter whether you&apos;re making a mod, or playing one, the first step is <b>downloading the engine.</b> Read the <Link href="/wiki/downloading">download guide</Link> for more information!
                </p>
            </Box>

    <Box>
        <h2>Contributing to the Wiki</h2>
        <hr/>

        <p>
            If you want to contribute to the wiki, you can do so by forking the repository and making a pull request. You can find the repository <Link href="https://github.com/KristalTeam/Shadow">here</Link>.
        </p>
    </Box>
    </>
    }

    </>)
}

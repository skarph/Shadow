import getArticleMetadata from 'src/getArticleMeta'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import styles from './page.module.css'

import fs from 'fs'
import path from 'path'

import {useMDXComponents} from 'mdx-components.js'
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export function generateMetadata({ params }){
    try{
        return getArticleMetadata(params.article)
    }catch (e){
        console.error(e)
    }
    return notFound()
}

export default function Article({ params }) {
    const article_path = path.resolve(`app/data/articles/${params.article}.mdx`)
    
    const mdx = fs.readFileSync(article_path)
    
    //IMPORTANT NOTE: `MDXRemote` does
    //`exec()`! make sure to sanitize any input before rendering it...
    
    return <div>
        <MDXRemote 
            source = {mdx}
            components = {useMDXComponents()}
            options = {{
                scope: {styles},
                mdxOptions: {
                    remarkPlugins: [
                        remarkGfm
                    ],
                    rehypePlugins: [
                        rehypeHighlight
                    ],
                }
            }}
        />
    </div>

}
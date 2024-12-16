import getArticleMetadata from '/src/getArticleMeta'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import styles from './page.module.css'

import fs from 'fs'
import path from 'path'

import {evaluateSync} from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import {useMDXComponents} from '/mdx-components.js'
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export async function generateMetadata({ params }){
    const { article } = await params
    try{
        return getArticleMetadata(article)
    }catch (e){
        console.error(e)
    }
    return notFound()
}

export async function generateStaticParams(){
    return fs.readdirSync(path.resolve('app/data/articles'), {encoding: "utf8"}, (err, files) => {
    
    }).map((path) => {
        return {article: path.replace(".mdx","")}
    })
}

export default async function Article({ params }) {
    const { article } = await params
    const article_path = path.resolve(`app/data/articles/${article}.mdx`)
    
    const mdx = fs.readFileSync(article_path)
    const {default: MDXComponent} = evaluateSync( mdx, {
        //processor
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight],
        //compile
        format: 'mdx',

        //runtime
        useMDXComponents: useMDXComponents,
        ...runtime
    })

    return <MDXComponent/>
}
"use client";

import { usePathname } from 'next/navigation';
import getArticleMetadata from '/src/getArticleMeta.mjs';
import {ArticleHeader, ArticleAnchors} from '/components/ArticleMeta';

export function ThisArticleHeader() {
    try {
        const metadata = getArticleMetadata(usePathname().split("/").pop())
        return <ArticleHeader metadata = {metadata}/>
    } catch (e) {
        throw e
    }
}

export function ThisArticleAnchors() {
    try {
        const metadata = getArticleMetadata(usePathname().split("/").pop())
        return <ArticleAnchors metadata = {metadata}/>
    } catch (e) {
        throw e
    }
}
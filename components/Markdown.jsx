import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeReact from 'rehype-react'

import * as prod from 'react/jsx-runtime'


const production = {Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs}
const pipeline = unified()
.use(remarkParse)
.use(remarkGfm)
.use(remarkRehype, { allowDangerousHtml: true })
.use(rehypeRaw)
.use(rehypeSanitize, {
    ...defaultSchema,
    attributes: {
        ...defaultSchema.attributes,
        "*": [...(defaultSchema.attributes["*"] || []), "style"],
    },
})
.use(rehypeHighlight)
.use(rehypeReact, production)

export default function Markdown({markdown}) {
    const output = pipeline.processSync(markdown)
    return output.result;
}
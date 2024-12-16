import remarkGfm from 'remark-gfm';
import createMDX from '@next/mdx';
import rehypeHighlight from 'rehype-highlight';

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
    options: {
        remarkPlugins: [
            remarkGfm
        ],
        rehypePlugins: [
            rehypeHighlight
        ],
    },
});

export default withMDX(nextConfig)

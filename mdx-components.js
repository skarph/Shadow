import MarkdownLink from "components/MarkdownLink"
import Header from "components/Header"

import ArticleTree from "components/ArticleTree"
import ArticleCenterGroup from "components/ArticleCenterGroup"

export function useMDXComponents(components) {
    return {
        a: (props) => (
            <MarkdownLink {...props} />
        ),
        h1: (props) => (
            <Header level={1} {...props} />
        ),
        h2: (props) => (
            <Header level={2} {...props} />
        ),
        h3: (props) => (
            <Header level={3} {...props} />
        ),
        h4: (props) => (
            <Header level={4} {...props} />
        ),
        h5: (props) => (
            <Header level={5} {...props} />
        ),
        h6: (props) => (
            <Header level={6} {...props} />
        ),

        Tree: (props) => (
            <ArticleTree {...props}/>
        ),

        CenterGroup: props => (
            <ArticleCenterGroup {...props}/>
        ),
        ...components,
    }
}
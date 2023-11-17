import MarkdownLink from "./components/MarkdownLink"

export function useMDXComponents(components) {
    return {
        a: (props) => (
            <MarkdownLink {...props} />
        ),
        ...components,
    }
}
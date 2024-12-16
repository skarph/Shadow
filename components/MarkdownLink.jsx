import Link from 'next/link';

export default function MarkdownLink({ children, href }) {
    if (href.startsWith("#")) {
        return <a href={href}>{children}</a>;
    } else if (href.startsWith("/") || href === "") {
        return <Link href={href}>{children}</Link>;
    } else {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        );
    }
}
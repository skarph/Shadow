import Box from 'components/Box'
import {ThisArticleHeader} from 'components/ArticleContext'

export default function RootLayout({children}) {
    return (
        <main>
            <Box>
                <ThisArticleHeader/>
                {children}
            </Box>
        </main>
    )
}

import styles from './page.module.css'
import Box from "components/Box"
import NewTab from "components/NewTab"

export default function Home() {
    return (
        <>
            <img src="title_logo_shadow.png" alt="title logo" className={styles.logo}/>
            <section className={styles.section}>
                <Box>
                    <h2 className={styles.header}>What is this?</h2>
                    Kristal is a powerful <NewTab href="https://deltarune.com/">DELTARUNE</NewTab> fangame and battle engine, made with <NewTab href="">LÖVE</NewTab>.
                </Box>

                <Box>
                    <h2 className={styles.header}>Can I help?</h2>
                    Yes! Feel free to look through the source code of Kristal and contribute if you wish.
                </Box>
            </section>
        </>
    )
}

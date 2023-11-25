import styles from './page.module.css'
import Box from "components/Box"
import NewTab from "components/NewTab"
import Link from "next/link"

export default function Home() {

    const mods = [
        {
            title: "Godhome",
            description: "Take your place amongst the Gods. 40+ boss fights, challenge modes, and a unique ending. Contains major spoilers for Hollow Knight.",
            image: "/screenshots/godhome.png",
            page: "https://gamebanana.com/mods/376524",
            author: "Vitellary"
        },
        {
            title: "Deltamon",
            description: "Kris and Susie get swept into the world of Pokemon and head out on an adventure to become the strongest Pokemon trainer. However, things are not quite as they seem, and they soon find themselves up against an imposing force...",
            image: "/screenshots/deltamon.png",
            page: null,
            author: "SylviBlossom"
        },
        {
            title: "The Cyber Servers",
            description: "While on their way to Queen's Mansion, the Fun Gang have to take a detour, riding a teacup into the sky... Not having to worry about Queen for a while, the Fun Gang ends up meeting new friends, new foes and get in quite a lot of trouble...",
            image: "/screenshots/cyber-servers.png",
            page: null,
            author: "NyakoFox"
        }
    ]


    return (
        <>
            <img src="title_logo_shadow.png" alt="title logo" className={styles.logo}/>
            <section className={styles.section}>
                <Box>
                    <h2 className={styles.header}>What is this?</h2>
                    Kristal is a powerful <NewTab href="https://deltarune.com/">DELTARUNE</NewTab> fangame and battle engine, made with <NewTab href="">LÖVE</NewTab>. It allows you to make <b>custom DELTARUNE worlds, battles, and more!</b>
                </Box>

                <Box>
                    <h2 className={styles.header}>Can I help?</h2>
                    <b>Yes!</b> Feel free to look through the <NewTab href="https://github.com/KristalTeam/Kristal">source code</NewTab> of Kristal and contribute if you wish.
                </Box>

                <Box>
                    <h2 className={styles.header}>How do I use it?</h2>
                    Check out the <Link href="/wiki/">wiki</Link> for more information on how to use Kristal.
                </Box>

                <Box>
                    <h2 className={styles.header}>Show some screenshots!</h2>
                    <br/>
                    <div className={styles.screenshots}>
                    {
                        mods.map((mod, index) => {
                            const img = <img className={styles.screenshot} src={mod.image}/>;
                            const info = <div className={styles.screenshot_info}>
                                <NewTab href={mod.page} className={styles.screenshot_title}>{mod.title}</NewTab>
                                <span className={styles.screenshot_author}>By {mod.author}</span>
                                <p className={styles.screenshot_description}>{mod.description}</p>
                                </div>;
                            return (index % 2 == 0) ? [img, info] : [info, img];

                        })
                    }
                    </div>
                </Box>
            </section>
        </>
    )
}

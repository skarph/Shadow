import styles from './page.module.css'
import Box from "components/Box"
import NewTab from "components/NewTab"
import Link from "next/link"
import Image from 'next/image'

import title_logo_shadow from 'public/title_logo_shadow.png'

export default function Home() {

    const mods = [
        {
            title: "Kris and Susie's Wacky Dark World Adventures",
            description: "Explore a bunch of fun and exciting dark worlds with new and old friends!",
            image: "/screenshots/kris_and_susies_wacky_dark_world_adventures.png",
            page: "https://gamejolt.com/games/deltarune-kris-and-susies-wacky-dark-world/852417",
            author: "TrashcatYT",
            author_link: "https://gamejolt.com/@TrashcatYT"
        },
        {
            title: "Godhome",
            description: "Take your place amongst the Gods. 40+ boss fights, challenge modes, and a unique ending. Contains major spoilers for Hollow Knight.",
            image: "/screenshots/godhome.png",
            page: "https://gamebanana.com/mods/376524",
            author: "Vitellary",
            author_link: null
        },
        {
            title: "Deoxynn",
            description: "Alexa Greene, a victim of something terrible, starts her adventure through the world of Europa. Will she make new friends and keep sane, or will she succumb to her insanity? The choice is yours.",
            image: "/screenshots/deoxynn.png",
            page: "https://gamebanana.com/mods/434334",
            author: "AcousticJamm",
            author_link: "https://www.guilded.gg/i/240D4G02"
        },
        {
            title: "Deltarune: Missing Light",
            description: "Traverse through different worlds and realities, and save the multiverse from being consumed by darkness and anomalies!",
            image: "/screenshots/deltarune_missing_light.png",
            page: "https://gamejolt.com/games/missinglight/799416",
            author: "DiamondBor",
            author_link: "https://www.youtube.com/channel/UCs76CI1gJeWx77sSTCCbICA"
        },
        {
            title: "Frozen Heart",
            description: "The end of the Snowgrave Route seen from another place. While Kris gets torn to pieces by a bootleg Mettaton NEO, Susie have to face Noelle, lost in the trance of the Thorn Ring, before she freezes her to death! And who knows, maybe the situation can get even worse than that?",
            image: "/screenshots/frozen_heart.png",
            page: "https://gamejolt.com/games/frozen-heart/659908",
            author: "Simbel",
            author_link: "https://www.youtube.com/@Simbel"
        },
        {
            title: "Deltamon",
            description: "Explore the vast reigon that Kris calls home as you aid them in becoming champion! Your rivals Susie Noelle and Berdly join alongside you to see and catch over 200+ pokemon from Kanto to Paldea!",
            image: "/screenshots/deltamon_neo.png",
            page: null,
            author: "Riverstar",
            author_link: "https://twitter.com/NoahLuc60171586"
        }
    ]


    return (
        <>
            <Image src={title_logo_shadow} alt="title logo" className={styles.logo}/>
            <section className={styles.section}>
                <Box>
                    <h2 className={styles.header}>What is this?</h2>
                    Kristal is a powerful <NewTab href="https://deltarune.com/">DELTARUNE</NewTab> fangame and battle engine, made with <NewTab href="">LÖVE</NewTab>. It allows you to make <b>custom DELTARUNE worlds, battles, and more!</b>
                </Box>

                <Box>
                    <h2 className={styles.header}>How do I use it?</h2>
                    Check out the <Link href="/wiki/">wiki</Link> for more information on how to use Kristal.
                </Box>

                <Box>
                    <h2 className={styles.header}>Can I help?</h2>
                    <b>Yes!</b> Feel free to look through the <NewTab href="https://github.com/KristalTeam/Kristal">source code of Kristal</NewTab> and contribute if you wish.
                </Box>

                <Box>
                    <h2 className={styles.header}>Show some screenshots!</h2>
                    <br/>
                    <div className={styles.screenshots}>
                    {
                        mods.map((mod, index) => {
                            const img = <Image className={styles.screenshot} src={mod.image} alt={mod.title} width={640} height={480} unoptimized = {true}/>;
                        const info = <div className={styles.screenshot_info}>
                                <NewTab href={mod.page} className={styles.screenshot_title}>{mod.title}</NewTab>
                                <span className={styles.screenshot_author}>By <NewTab href={mod.author_link}>{mod.author}</NewTab></span>
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

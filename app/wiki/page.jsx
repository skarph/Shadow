import styles from './page.module.css'

export default function Wiki() {
    return (
        <>
            <img src="title_logo_shadow.png" alt="title logo" className={styles.logo}/>
            <p>Kristal is an awesome DELTARUNE fangame engine, written in Lua, using LOVE.</p>
            <br/>
            <h2>Getting Started</h2>
            <hr/>
            <p>The first thing you should do is go ahead and download the engine.</p>
        </>
    )
}

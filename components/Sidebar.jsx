import Link from "next/link";
import styles from "./Sidebar.module.css";

export default function Sidebar(props) {
    return <div className={styles.sidebar}>
        <h2>Kristal Wiki</h2>
        <hr/>
        <h3><Link href="/wiki/">Getting Started</Link></h3>
        <hr/>
        <p>These pages get you ready to use the engine.</p>
        <ul>
            <li><Link href="/wiki/downloading">Downloading Kristal</Link></li>
            <li><Link href="/wiki/playing-mods">Installing and Playing Mods</Link></li>
        </ul>
        <br/>
        <h3><Link href="/wiki/mod-creation">Mod Creation</Link></h3>
        <hr/>
        <p>These pages teach you about mod development.</p>
        <ul>
            <li><Link href="/wiki/basics">Understanding the Basics</Link></li>
            <li><Link href="/wiki/creating-a-mod">Creating a Mod</Link></li>
            <li><Link href="/wiki/using-libraries">Using Libraries</Link></li>
            <li><Link href="/wiki/designing-a-map">Designing a Map</Link></li>
            <li><Link href="/wiki/cutscenes">Cutscenes</Link></li>
            <li><Link href="/wiki/creating-an-item">Creating an Item</Link></li>
            <li><Link href="/wiki/creating-a-spell">Creating a Spell</Link></li>
            <li><Link href="/wiki/actors">Actors</Link></li>
            <li><Link href="/wiki/party-members">Party Members</Link></li>
            <li><Link href="/wiki/ui">The UI System</Link></li>
        </ul>
        <br/>
        <h3><Link href="/wiki/api">API Reference</Link></h3>
        <hr/>
        <p>An auto-generated API reference for Kristal.</p>
    </div>
}
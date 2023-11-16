import styles from './Navbar.module.css';
import Link from 'next/link';
import NewTab from 'components/NewTab';

export default function Navbar() {
    return <div className={styles.navbar}>
        <div className={styles.navbar_inner}>
            <Link href="/" className={styles.item}>Home</Link>
            <Link href="/wiki" className={styles.item}>Wiki</Link>
            <NewTab href="https://github.com/KristalTeam/Kristal/" className={styles.item}>Source</NewTab>
            <NewTab href="https://github.com/KristalTeam/Kristal/releases" className={styles.item}>Downloads</NewTab>
        </div>
    </div>
}
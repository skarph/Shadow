import Link from 'next/link';
import styles from './layout.module.css'
import Box from 'components/Box';

export const metadata = {
  title: 'Kristal Wiki',
  description: 'Documentation for the powerful DELTARUNE fangame engine, Kristal.'
}

export default function RootLayout({children}) {
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h3>Guide Pages</h3>
          <hr/>
          <ul>
            <li><Link href="/wiki/downloading">Downloading Kristal</Link></li>
            <li><Link href="/wiki/playing">Installing and Playing Mods</Link></li>
            <li><Link href="/wiki/documentation-instructions">Documentation Instructions</Link></li>
            <li><Link href="/wiki/creating-a-project">Creating a Project</Link></li>
            <li><Link href="/wiki/ui">The UI System</Link></li>
          </ul>
          <br/>
          <h3><Link href="/wiki/ui">API Reference</Link></h3>
      </div>
      <main className={styles.main}>
          {children}
      </main>
    </div>
  )
}

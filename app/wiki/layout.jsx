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
            <h3>Testing</h3>
            <hr/>
            <ul>
            <li>test</li>
            <li>test 2</li>
            <li>test 3</li>
            </ul>
        </div>
        <main className={styles.main}>
            {children}
        </main>
    </div>
  )
}

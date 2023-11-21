import styles from './layout.module.css'
import Sidebar from 'components/Sidebar';

export const metadata = {
  title: 'Kristal Wiki',
  description: 'Documentation for the powerful DELTARUNE fangame engine, Kristal.'
}

export default function RootLayout({children}) {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.main}>
          {children}
      </main>
    </div>
  )
}

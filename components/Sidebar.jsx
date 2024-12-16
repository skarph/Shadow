import styles from './Sidebar.module.css';
import Searchbar from '/components/Searchbar'

export default function Sidebar({children}) {
    return <div className={styles.sidebar}>
        <h2>Kristal Wiki</h2>
        <Searchbar placeholder = "Search Wiki" submit = "Go"/>
        <hr/>
        {children}
    </div>
}
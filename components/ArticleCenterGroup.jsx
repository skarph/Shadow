import styles from './ArticleCenterGroup.module.css';

export default function ArticleTree({ children }) {
    return <div className={styles.centergroup}>{children}</div>;
}

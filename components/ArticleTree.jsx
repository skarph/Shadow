import styles from './ArticleTree.module.css';

export default function ArticleTree({ children }) {
    return <div className={styles.tree}>{children}</div>;
}

import styles from './Box.module.css';

export default function Box({ children, className }) {
    if (className) {
        return <div className={`${styles.box} ${className}`} >{children}</div>;
    }
    return <div className={styles.box}>{children}</div>;
}

import styles from './Docbox.module.css';

export default function Docbox({ children, className, ...props}) {
    if (className) {
        return <div className={`${styles.box} ${className}`} {...props}>{children}</div>;
    }
    return <div className={styles.box} {...props}>{children}</div>;
}

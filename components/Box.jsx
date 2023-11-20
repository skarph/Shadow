import styles from './Box.module.css';

export default function Box({ children, className, ...props}) {
    if (className) {
        return <div className={`${styles.box} ${className}`} {...props}>{children}</div>;
    }
    return <div className={styles.box} {...props}>{children}</div>;
}

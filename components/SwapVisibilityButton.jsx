"use client" 
import styles from './SwapVisibilityButton.module.css';
export default function SwapVisibilityButton({ children, className, componentA, componentB, ...props}, ) {
    
    return <label className={`${styles.switch} ${className}`} {...props} >
        <input type="checkbox" onClick={
        (e) => {
            let a = document.getElementById(componentA)
            let b = document.getElementById(componentB)
            a.style.display = a.style.display == "none" ? "block" : "none"
            b.style.display = b.style.display == "none" ? "block" : "none"
        }
    } />
        <span className={`${styles.slider}`} ></span>
    </label>;
}
/*
<div class={styles.toggle} onClick={(e) => setDisplayed(!displayed)}>click to toggle</div>

.toggle {
    cursor: pointer;
    user-select: none;
}
*/
"use client" 
import styles from './SwapVisibilityButton.module.css';
import { useState, useEffect } from 'react';

function updateDisplay(displayB, elementA, elementB) {
    let a = document.getElementById(elementA)
    let b = document.getElementById(elementB)
    a.style.display = displayB ? "block" : "none"
    b.style.display = !displayB ? "block" : "none"
}

export default function SwapVisibilityButton({ children, className, elementA, elementB, ...props}, ) {
    const [displayB, setDisplayB] = useState('')
    
    //on client side hydration
    useEffect( () => {
        setDisplayB(
            window.localStorage.getItem("stateSwapVisibilityButton") === "true"
        )
    }, [])

    //onChange clientside
    useEffect( () => {
        if( typeof(displayB) === "boolean" ) {
            updateDisplay(displayB, elementA, elementB)
            window.localStorage.setItem("stateSwapVisibilityButton", displayB)
        }
    }, [displayB])

    return <label className={`${styles.switch} ${className}`} {...props} >
        <input type = "checkbox" checked = {displayB} onChange = {(e) => {
            setDisplayB(e.target.checked)
        }}/>

        <span className={`${styles.slider}`} ></span>
    </label>;
}
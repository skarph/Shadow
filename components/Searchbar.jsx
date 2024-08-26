"use client"
//from https://www.emgoto.com/react-search-bar/
import styles from "./Searchbar.module.css";

export default function Searchbar(props) {
    const placeholder = props.placeholder || "Search"
    const submit = props.submit || "Submit"

    return (
    <form action="/" method="get">
        <label htmlFor="header-search">
            <span className={styles.visuallyhidden}>{placeholder}</span> 
        </label>
        <input
            id="header-search"
            placeholder={placeholder}    
            type="text"
            name="search"
        />
        <button 
            type="submit"
            formAction = "/wiki"
        >
            {submit}
        </button>
    </form>
    )
}
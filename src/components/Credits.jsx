import React from 'react'
import styles from './Credits.module.css'

function Credits() {
    return (
        <section className={styles.creditContainer}>
            <a
                id="cred"
                href="https://www.flaticon.com/free-icons/location"
                title="location icons"
            >
                Location icons created by Smashicons - Flaticon
            </a>
            <a
                id="cred"
                href="https://www.flaticon.com/free-icons/boat"
                title="boat icons"
            >
                Boat icons created by Freepik - Flaticon
            </a>
            <a
                href="https://www.flaticon.com/free-icons/swimming"
                title="swimming icons"
            >
                Swimming icons created by Freepik - Flaticon
            </a>
            <a
                id="cred"
                href="https://www.flaticon.com/free-icons/restaurant"
                title="restaurant icons"
            >
                Restaurant icons created by Freepik - Flaticon
            </a>
        </section>
    )
}

export default Credits

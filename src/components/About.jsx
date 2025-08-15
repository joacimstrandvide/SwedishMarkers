import styles from './About.module.css'

function About() {
    return (
        <section className={styles.aboutContainer}>
            <h2>Om UpptäckSverige</h2>
            <p>
                På denna sida kan du enkelt hitta intressanta och unika platser
                runtom i Sverige
            </p>
            <h3>
                Skapad av{' '}
                <a
                    href="https://www.strandvide.se"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Joacim Strandvide
                </a>
            </h3>
        </section>
    )
}

export default About

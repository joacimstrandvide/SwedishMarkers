import styles from './Help.module.css'

function Help() {
    return (
        <section className={styles.helpContainer}>
            <h2>Hjälp</h2>
            <p>
                Du kan filtrera platserna på kartan genom att öppna menyn och
                välja en kategori.
            </p>
            <p>
                Du kan också söka efter specifika teman, som till exempel
                "restaurant", för att visa relevanta resultat inom det område
                som visas på kartan. Information hämtas från overpass med openstreetmap.
            </p>
            <p>Sök fältet kan även gömmas</p>
        </section>
    )
}

export default Help

// Popup fönster
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
// Komponenter
import About from './About'
import Credits from './Credits'
import styles from './Navbar.module.css'

function Navbar({ selectedCategory, onCategoryChange }) {
    return (
        <>
            {/* Navigationen */}
            <input
                type="checkbox"
                id="menu-toggle"
                className={styles['menu-toggle']}
            />
            <label htmlFor="menu-toggle" className={styles['menu-button']}>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
            </label>
            <nav className={styles.navbar}>
                {/* Titel */}
                <h1>
                    Swedish<strong>Markers</strong>
                </h1>
                {/* Filtrering */}
                <div className={styles.filter}>
                    <label htmlFor="category">Filter:</label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                    >
                        <option value="all">Alla</option>
                        <option value="/img/boat.webp">Båt</option>
                        <option value="/img/food.webp">Mat</option>
                        <option value="/img/swim.webp">Simning</option>
                        <option value="/img/historic.webp">Historiskt</option>
                        <option value="/img/nature.webp">Natur</option>
                    </select>
                </div>
                <Popup
                    trigger={<button className={styles.open}>Info</button>}
                    modal
                    nested
                >
                    {(close) => (
                        <div className="modal">
                            <button className="close" onClick={close}>
                                &times;
                            </button>
                            <div className="content">
                                <About />
                            </div>
                        </div>
                    )}
                </Popup>
                <Popup
                    trigger={<button className={styles.open}>Ikoner</button>}
                    modal
                    nested
                >
                    {(close) => (
                        <div className="modal">
                            <button className="close" onClick={close}>
                                &times;
                            </button>
                            <div className="content">
                                <Credits />
                            </div>
                        </div>
                    )}
                </Popup>
            </nav>
        </>
    )
}

export default Navbar

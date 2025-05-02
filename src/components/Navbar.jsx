import React from 'react'
// Popup fönster
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
// Komponenter
import About from './About'
import Credits from './Credits'

function Navbar() {
    return (
        <>
            {/* Navigationen */}
            <input type="checkbox" id="menu-toggle" className="menu-toggle" />
            <label htmlFor="menu-toggle" className="menu-button">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </label>
            <nav className="navbar">
                {/* Titel */}
                <h1>
                    Swedish<strong>Markers</strong>
                </h1>
                <Popup
                    trigger={<button className="open">Info</button>}
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
                    trigger={<button className="open">Ikoner</button>}
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

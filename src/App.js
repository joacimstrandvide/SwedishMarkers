import React from 'react'
import './App.css'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
import FooterPart from './components/FooterPart'
import MapPart from './components/MapPart'
import AboutPart from './components/AboutPart'

function App() {
    return (
        <>
            <header>
                <h1>
                    Swedish<strong>Markers</strong>
                </h1>
                <Popup
                    trigger={<button id="open">Läs Mer</button>}
                    modal
                    nested
                >
                    {(close) => (
                        <div className="modal">
                            <div className="content">
                                <AboutPart />
                            </div>
                            <div>
                                <button id="close" onClick={() => close()}>
                                    Stäng
                                </button>
                            </div>
                        </div>
                    )}
                </Popup>
            </header>
            <MapPart />
            <FooterPart />
        </>
    )
}

export default App

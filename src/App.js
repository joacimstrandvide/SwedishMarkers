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
                    trigger={<button className="open">Om Oss</button>}
                    modal
                    nested
                >
                    {(close) => (
                        <div className="modal">
                            <button className="close" onClick={close}>
                                &times;
                            </button>
                            <div className="content">
                                <AboutPart />
                            </div>
                            <div className="actions">
                                <button
                                    className="close-button"
                                    onClick={() => {
                                        close()
                                    }}
                                >
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

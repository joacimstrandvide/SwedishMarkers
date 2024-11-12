import React from 'react'
import './App.css'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
import Footer from './components/Footer'
import Map from './components/Map'
import About from './components/About'

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
                                <About />
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
            <Map />
            <Footer />
        </>
    )
}

export default App

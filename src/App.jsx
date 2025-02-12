import React from 'react'
import './App.css'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
import Map from './components/Map'
import About from './components/About'
import Credits from './components/Credits'
import NewMarker from './components/NewMarker'

function App() {
    return (
        <>
            <header>
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
                    trigger={<button className="open">Credits</button>}
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
                <Popup
                    trigger={<button className="open">Ny plats</button>}
                    modal
                    nested
                >
                    {(close) => (
                        <div className="modal">
                            <button className="close" onClick={close}>
                                &times;
                            </button>
                            <div className="content">
                                <NewMarker />
                            </div>
                        </div>
                    )}
                </Popup>
            </header>
            <Map />
        </>
    )
}

export default App

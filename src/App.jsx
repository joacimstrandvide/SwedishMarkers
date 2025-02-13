import React from 'react'
import './App.css'
import styled from 'styled-components'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
import Map from './components/Map'
import About from './components/About'
import Credits from './components/Credits'
import NewMarker from './components/NewMarker'

function App() {
    return (
        <>
            <HeaderMain>
                <h1>
                    Swedish<strong>Markers</strong>
                </h1>
                <ContainerMenu>
                    <input
                        type="checkbox"
                        id="menu-toggle"
                        className="menu-toggle"
                    />
                    <label htmlFor="menu-toggle" className="menu-button">
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                    </label>
                    <nav className="navbar">
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
                    </nav>
                </ContainerMenu>
            </HeaderMain>
            <Map />
        </>
    )
}

export default App

const HeaderMain = styled.header`
    background-color: #000;
    margin: 0;
    padding: 0.2rem;
    color: white;
    text-align: center;
    h1 {
        color: #006aa7;
        font-family: 'Nunito', sans-serif;
    }

    strong {
        color: #fecc02;
        font-family: 'Nunito', sans-serif;
    }
`
const ContainerMenu = styled.container`

`

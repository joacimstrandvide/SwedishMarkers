import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import FooterPart from './components/FooterPart'
import Home from './pages/Home.js'
import About from './pages/About.js'
import Error from './pages/Error.js'

function App() {
    return (
        <>
            <div className="container-menu">
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
                    <ul>
                        <li>
                            <Link to={'/SwedishMarkers'}>Hem</Link>
                        </li>
                        <li>
                            <Link to={'/SwedishMarkers/about'}>Om</Link>
                        </li>
                        <h4>Joacim Strandvide 2023</h4>
                    </ul>
                </nav>
            </div>
            <header>
                <h1>
                    Swedish<strong>Markers</strong>
                </h1>
            </header>
            <Routes>
                <Route path="/SwedishMarkers" element={<Home />} />
                <Route path="/SwedishMarkers/about" element={<About />} />
                {/* Error handling */}
                <Route path="*" element={<Error />} />
            </Routes>
            <FooterPart />
        </>
    )
}

export default App

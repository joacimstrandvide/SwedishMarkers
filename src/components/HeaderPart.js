import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from '../pages/Home.js'
import About from '../pages/About.js'
import Error from '../pages/Error.js'

function HeaderPart() {
    return (
        <>
            <div class="container-menu">
                <input type="checkbox" id="menu-toggle" class="menu-toggle" />
                <label htmlFor="menu-toggle" class="menu-button">
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                </label>
                <nav class="navbar">
                    <ul>
                        <li>
                            <Link to={'/'}>Hem</Link>
                        </li>
                        <li>
                            <Link to={'/about'}>Om</Link>
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
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                {/* Error handling */}
                <Route path="*" element={<Error />} />
            </Routes>
        </>
    )
}

export default HeaderPart

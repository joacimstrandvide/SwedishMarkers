import React, { useState, useEffect } from 'react'
// Databasen
import { supabase } from './helper/supabaseClient'
import './App.css'
import styled from 'styled-components'
// Popup fönster
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
// Komponenter
import Map from './components/Map'
import About from './components/About'
import Credits from './components/Credits'
import NewMarker from './components/NewMarker'
import Register from './components/Register'
import Login from './components/Login'
// AuthContext
import { useAuth } from './context/AuthContext'

function App() {
    const { isLoggedIn, logout } = useAuth()
    const [userEmail, setUserEmail] = useState('')

    /* Hämta namnet för användaren */
    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user }
            } = await supabase.auth.getUser()
            if (user) {
                setUserEmail(user.email)
            }
        }
        getUser()
    }, [])

    return (
        <>
            <HeaderMain>
                {/* Titel */}
                <h1>
                    Swedish<strong>Markers</strong>
                </h1>
                {/* Navigationen */}
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
                    {/* Kolla om användaren är inloggad */}
                    {!isLoggedIn ? (
                        <>
                            <AuthActions>
                                <Popup
                                    trigger={
                                        <button className="open">
                                            Registrera
                                        </button>
                                    }
                                    modal
                                    nested
                                >
                                    {(close) => (
                                        <div className="modal">
                                            <button
                                                className="close"
                                                onClick={close}
                                            >
                                                &times;
                                            </button>
                                            <div className="content">
                                                <Register />
                                            </div>
                                        </div>
                                    )}
                                </Popup>
                                <Popup
                                    trigger={
                                        <button className="open">
                                            Logga in
                                        </button>
                                    }
                                    modal
                                    nested
                                >
                                    {(close) => (
                                        <div className="modal">
                                            <button
                                                className="close"
                                                onClick={close}
                                            >
                                                &times;
                                            </button>
                                            <div className="content">
                                                <Login />
                                            </div>
                                        </div>
                                    )}
                                </Popup>
                            </AuthActions>
                        </>
                    ) : (
                        /* För inloggade användare */
                        <>
                            <Popup
                                trigger={
                                    <button className="open">Ny plats</button>
                                }
                                modal
                                nested
                            >
                                {(close) => (
                                    <div className="modal">
                                        <button
                                            className="close"
                                            onClick={close}
                                        >
                                            &times;
                                        </button>
                                        <div className="content">
                                            <NewMarker />
                                        </div>
                                    </div>
                                )}
                            </Popup>
                            <UserInformation>
                                <h4>{userEmail}</h4>
                                <LogoutButton onClick={logout}>
                                    Logga ut
                                </LogoutButton>
                            </UserInformation>
                        </>
                    )}
                </nav>
            </HeaderMain>
            <Map />
        </>
    )
}

export default App

// Styling
const HeaderMain = styled.header`
    background-color: #000;
    margin: 0;
    padding: 0.2rem;
    color: white;
    text-align: center;
    h1 {
        color: #006aa7;
        font-family: 'Oswald', sans-serif;
        font-size: 2rem;
    }

    strong {
        color: #fecc02;
        font-family: 'Oswald', sans-serif;
    }
    @media (max-width: 640px) {
        h1 {
            font-size: 2.3rem;
        }
    }
`

const UserInformation = styled.section`
    display: flex;
    margin: 1rem;
    flex-wrap: wrap;
    h4 {
        font-family: 'Oswald', sans-serif;
        font-weight: 600;
        font-size: 1rem;
    }
`

const LogoutButton = styled.button`
    width: clamp(10rem, 50%, 20rem);
    padding: 0.4rem;
    border-radius: 0.5rem;
    color: #fff;
    background-color: #006aa7;
    border: none;
    font-family: 'Oswald', sans-serif;
    font-weight: 600;
    font-size: 1.1rem;
    cursor: pointer;
`
const AuthActions = styled.section`
    border: 2px solid #006aa7;
    border-radius: 1rem;
    width: 10rem;
    margin: 1rem;
`

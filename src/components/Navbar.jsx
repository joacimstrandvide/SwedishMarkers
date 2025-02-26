import React, { useState, useEffect } from 'react'
// Databasen
import { supabase } from '../helper/supabaseClient'
// Popup fönster
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
import styled from 'styled-components'
// Komponenter
import About from './About'
import Credits from './Credits'
import NewMarker from './NewMarker'
import Register from './Register'
import Login from './Login'
// AuthContext
import { useAuth } from '../context/AuthContext'

function Navbar() {
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
                {/* Kolla om användaren är inloggad */}
                {!isLoggedIn ? (
                    <>
                        <AuthActions>
                            <Popup
                                trigger={
                                    <button className="open">Registrera</button>
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
                                    <button className="open">Logga in</button>
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
                        <UserInformation>
                            <h4>{userEmail}</h4>
                            <LogoutButton onClick={logout}>
                                Logga ut
                            </LogoutButton>
                        </UserInformation>
                    </>
                )}
            </nav>
        </>
    )
}

export default Navbar

// Styling
const UserInformation = styled.section`
    display: flex;
    margin: 1rem;
    flex-wrap: wrap;
    h4 {
        font-family: 'Oswald', sans-serif;
        font-weight: 500;
        font-size: 1rem;
        color: #000;
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

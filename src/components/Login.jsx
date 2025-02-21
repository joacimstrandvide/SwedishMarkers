import React, { useState } from 'react'
import styled from 'styled-components'
import Alert from '@mui/material/Alert'
import { supabase } from '../helper/supabaseClient'
import { useAuth } from '../context/AuthContext'

function Login() {
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [alert, setAlert] = useState({ type: '', message: '' })

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if (error) {
            setAlert({ type: 'error', message: 'Fel email eller lösenord!' })
            console.log(error)
            setEmail('')
            setPassword('')
            return
        }

        if (data) {
            login()
        }
    }

    return (
        <>
            <LoginMain>
                {alert.message && (
                    <Alert severity={alert.type}>{alert.message}</Alert>
                )}
                <h3>Logga in</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        placeholder="Email"
                        required
                    />
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        placeholder="Lösenord"
                        required
                    />
                    <button type="submit">Logga in</button>
                </form>
            </LoginMain>
        </>
    )
}

export default Login

const LoginMain = styled.section`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    flex-direction: column;

    h3 {
        font-family: 'Oswald', sans-serif;
        font-weight: 500;
        font-size: 1.4rem;
    }

    form input {
        width: 90%;
        margin: 0.5rem;
        height: 3rem;
        padding: 0.3rem;
        border-radius: 9px;
        outline: none;
        border: 1px solid #e5e5e500;
        transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
    }

    form input:focus {
        border: 1px solid transparent;
        box-shadow: 0px 0px 0px 2px #242424;
        background-color: transparent;
    }

    form button {
        width: clamp(4rem, 25vw, 7rem);
        padding: 0.4rem;
        border-radius: 0.5rem;
        color: #fff;
        background-color: #006aa7;
        border: none;
        font-family: 'Oswald', sans-serif;
        font-weight: 600;
        font-size: 1.1rem;
        cursor: pointer;
    }
`

import React, { useState } from 'react'
import styled from 'styled-components'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { supabase } from '../helper/supabaseClient'
import { useAuth } from '../context/AuthContext'

function Register() {
    const { login } = useAuth()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [alert, setAlert] = useState({ type: '', message: '' })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setAlert({ type: '', message: '' })

        const trimmedEmail = email.trim()
        const trimmedName = name.trim()
        const trimmedPassword = password.trim()

        if (!trimmedName || !trimmedEmail || !trimmedPassword) {
            setAlert({ type: 'error', message: 'Alla fält måste fyllas i!' })
            setLoading(false)
            return
        }

        try {
            // Kolla om emailen redan finns
            const { data: existingUsers, error: userCheckError } =
                await supabase
                    .from('auth.users')
                    .select('email')
                    .eq('email', trimmedEmail)

            if (userCheckError) throw userCheckError
            if (existingUsers.length > 0) {
                setAlert({
                    type: 'error',
                    message: 'E-postadressen används redan!'
                })
                setLoading(false)
                return
            }

            const { data, error } = await supabase.auth.signUp({
                email: trimmedEmail,
                password: trimmedPassword,
                options: {
                    data: { first_name: trimmedName }
                }
            })

            if (error) throw error

            setAlert({ type: 'success', message: 'Nytt Konto Skapat!' })
            login()
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.message || 'Ett fel inträffade!'
            })
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <RegisterMain>
                {alert.message && (
                    <Alert severity={alert.type}>{alert.message}</Alert>
                )}
                <h3>Skapa nytt konto</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        type="text"
                        placeholder="Namn"
                        required
                    />
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
                    <button type="submit" disabled={loading}>
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Skapa Konto'
                        )}
                    </button>
                </form>
            </RegisterMain>
        </>
    )
}

export default Register

const RegisterMain = styled.section`
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
        width: auto;
        margin: 0.5rem;
        height: 40px;
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
        display: flex;
        align-items: center;
        justify-content: center;
    }

    form button:disabled {
        background-color: gray;
        cursor: not-allowed;
    }
`

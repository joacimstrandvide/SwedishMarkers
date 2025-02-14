import React, { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../helper/supabaseClient'

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getSession = async () => {
            const {
                data: { session }
            } = await supabase.auth.getSession()

            setIsLoggedIn(!!session)
            setLoading(false)
        }

        getSession()
    }, [])

    const login = () => setIsLoggedIn(true)
    const logout = () => setIsLoggedIn(false)

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext }

import React, { useState } from 'react'
import Alert from '@mui/material/Alert'
import { supabase } from '../helper/supabaseClient'
import DOMPurify from 'dompurify'

function NewMarker() {
    const [name, setName] = useState('')
    const [lat, setLat] = useState('')
    const [lng, setLng] = useState('')
    const [popupcontent, setPopupContent] = useState('')
    const [icon, setIcon] = useState('')
    const [alert, setAlert] = useState({ type: '', message: '' })

    const validateText = (text) => /^[a-zA-ZåäöÅÄÖ\s0-9.,'!?-]+$/.test(text)
    const validateNumber = (num) => /^-?\d+(\.\d+)?$/.test(num)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const { data, error: userError } = await supabase.auth.getUser()

        if (userError || !data?.user) {
            setAlert({
                type: 'error',
                message: 'Du måste vara inloggad för att lägga till en plats!'
            })
            return
        }

        const userId = data.user.id

        if (!name || !lat || !lng) {
            setAlert({ type: 'error', message: 'Fyll i alla fält som behövs!' })
            return
        }

        if (
            !validateText(name) ||
            (popupcontent && !validateText(popupcontent))
        ) {
            setAlert({
                type: 'error',
                message:
                    'Endast bokstäver, siffror och vanliga tecken är tillåtna i textfält!'
            })
            return
        }

        if (!validateNumber(lat) || !validateNumber(lng)) {
            setAlert({
                type: 'error',
                message: 'Latitud och longitud måste vara nummer!'
            })
            return
        }

        const sanitizedPopupContent = DOMPurify.sanitize(popupcontent.trim())

        const { error } = await supabase.from('markers').insert([
            {
                name: name.trim(),
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                popupcontent: sanitizedPopupContent,
                icon: icon,
                user_id: userId
            }
        ])

        if (error) {
            setAlert({
                type: 'error',
                message: 'Ett fel inträffade vid tillägg av ny plats.'
            })
            console.error('Fel vid ny plats:', error)
        } else {
            setAlert({ type: 'success', message: 'Ny plats tillagd!' })
        }
    }

    return (
        <div className="new-marker-container">
            <h3>Lägg till en ny plats</h3>
            {alert.message && (
                <Alert severity={alert.type}>{alert.message}</Alert>
            )}
            <form onSubmit={handleSubmit} className="add-marker-form">
                <label>Namn</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label>Latitud</label>
                <input
                    type="number"
                    step="any"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    required
                />

                <label>Longitud</label>
                <input
                    type="number"
                    step="any"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    required
                />

                <label>Beskrivning (frivillig)</label>
                <textarea
                    value={popupcontent}
                    onChange={(e) => setPopupContent(e.target.value)}
                />

                <label>Icon (frivillig)</label>
                <select value={icon} onChange={(e) => setIcon(e.target.value)}>
                    <option value="">Standard</option>
                    <option value="/img/boat.webp">Båt</option>
                    <option value="/img/food.webp">Mat</option>
                    <option value="/img/swim.webp">Simning</option>
                </select>

                <button type="submit">Lägg till</button>
            </form>
        </div>
    )
}

export default NewMarker

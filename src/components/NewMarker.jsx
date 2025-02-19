import React, { useState } from 'react'
import Alert from '@mui/material/Alert'
import { supabase } from '../helper/supabaseClient'
import DOMPurify from 'dompurify'

function NewMarker() {
    const [form, setForm] = useState({
        name: '',
        lat: '',
        lng: '',
        popupcontent: '',
        icon: '',
        score: ''
    })
    const [alert, setAlert] = useState({ type: '', message: '' })

    const validateText = (text) => /^[a-zA-ZåäöÅÄÖ\s0-9.,'!?-]+$/.test(text)
    const validateNumber = (num) => /^-?\d+(\.\d+)?$/.test(num)
    const validateLatLng = (num) => /^-?\d{1,2}\.\d+$/.test(num)
    const validateScore = (score) => /^[1-5]$/.test(score)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }))
    }

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

        if (!form.name || !form.lat || !form.lng) {
            setAlert({ type: 'error', message: 'Fyll i alla fält som behövs!' })
            return
        }

        if (
            !validateText(form.name) ||
            (form.popupcontent && !validateText(form.popupcontent))
        ) {
            setAlert({
                type: 'error',
                message:
                    'Endast bokstäver, siffror och vanliga tecken är tillåtna i textfält!'
            })
            return
        }

        if (
            !validateNumber(form.lat) ||
            !validateNumber(form.lng) ||
            !validateLatLng(form.lat) ||
            !validateLatLng(form.lng)
        ) {
            setAlert({
                type: 'error',
                message: 'Latitud och longitud måste vara giltiga nummer!'
            })
            return
        }

        if (!validateScore(form.score)) {
            setAlert({
                type: 'error',
                message: 'Betyg måste vara ett heltal mellan 1 och 5!'
            })
            return
        }

        const sanitizedPopupContent = DOMPurify.sanitize(
            form.popupcontent.trim()
        )

        const { error } = await supabase.from('markers').insert([
            {
                name: form.name.trim(),
                lat: parseFloat(form.lat),
                lng: parseFloat(form.lng),
                popupcontent: sanitizedPopupContent,
                icon: form.icon,
                score: parseInt(form.score, 10),
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
            setForm({
                name: '',
                lat: '',
                lng: '',
                popupcontent: '',
                icon: '',
                score: ''
            })
        }
    }

    return (
        <div className="new-marker-container">
            <h3>Lägg till en ny plats</h3>
            {alert.message && (
                <Alert severity={alert.type}>{alert.message}</Alert>
            )}
            <form onSubmit={handleSubmit} className="add-marker-form">
                <label>Namn*</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <label>Latitud*</label>
                <input
                    type="number"
                    step="any"
                    name="lat"
                    value={form.lat}
                    onChange={handleChange}
                    required
                />

                <label>Longitud*</label>
                <input
                    type="number"
                    step="any"
                    name="lng"
                    value={form.lng}
                    onChange={handleChange}
                    required
                />

                <label>Beskrivning</label>
                <textarea
                    name="popupcontent"
                    value={form.popupcontent}
                    onChange={handleChange}
                />

                <label>Icon</label>
                <select name="icon" value={form.icon} onChange={handleChange}>
                    <option value="">Standard</option>
                    <option value="/img/boat.webp">Båt</option>
                    <option value="/img/food.webp">Mat</option>
                    <option value="/img/swim.webp">Simning</option>
                </select>

                <label>Poäng (1-5)</label>
                <input
                    type="number"
                    name="score"
                    value={form.score}
                    onChange={handleChange}
                    min="1"
                    max="5"
                />

                <button type="submit">Lägg till</button>
            </form>
        </div>
    )
}

export default NewMarker

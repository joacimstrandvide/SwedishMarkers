import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

function NewMarker() {
    const [name, setName] = useState('')
    const [lat, setLat] = useState('')
    const [lng, setLng] = useState('')
    const [popupcontent, setPopupContent] = useState('')
    const [icon, setIcon] = useState('')

    const validateText = (text) => /^[a-zA-ZåäöÅÄÖ\s0-9.,!?-]+$/.test(text)
    const validateNumber = (num) => /^-?\d+(\.\d+)?$/.test(num)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!name || !lat || !lng) {
            alert('Fyll i alla fält som behövs!')
            return
        }

        if (
            !validateText(name) ||
            (popupcontent && !validateText(popupcontent))
        ) {
            alert(
                'Endast bokstäver, siffror och vanliga tecken är tillåtna i textfält!'
            )
            return
        }

        if (!validateNumber(lat) || !validateNumber(lng)) {
            alert('Latitud och longitud måste vara nummer!')
            return
        }

        const { error } = await supabase.from('markers').insert([
            {
                name: name.trim(),
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                popupcontent: popupcontent.trim(),
                icon: icon
            }
        ])

        if (error) {
            console.error('Fel vid ny plats:', error)
        } else {
            alert('Ny plats tillagd!')
            window.location.reload()
        }
    }

    return (
        <div className="new-marker-container">
            <h3>Lägg till en ny plats</h3>
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

                <label>longitud</label>
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

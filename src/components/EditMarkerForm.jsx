import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

function EditMarkerForm({ marker, onSave, onCancel }) {
    const [name, setName] = useState(marker.name || '')
    const [icon, setIcon] = useState(marker.icon || '')
    const [popupContent, setPopupContent] = useState(marker.popupcontent || '')

    useEffect(() => {
        setName(marker.name || '')
        setIcon(marker.icon || '')
        setPopupContent(marker.popupcontent || '')
    }, [marker])

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave({ ...marker, name, icon, popupcontent: popupContent })
    }

    return (
        <FormContainer onSubmit={handleSubmit}>
            <label>
                Titel:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>
            <label>
                Ikon:
                <select value={icon} onChange={(e) => setIcon(e.target.value)}>
                    <option value="">Standard</option>
                    <option value="/img/boat.webp">Båt</option>
                    <option value="/img/food.webp">Mat</option>
                    <option value="/img/swim.webp">Simning</option>
                </select>
            </label>
            <label>
                Beskrivning:
                <textarea
                    value={popupContent}
                    onChange={(e) => setPopupContent(e.target.value)}
                />
            </label>
            <ButtonContainer>
                <SaveButton type="submit">Spara</SaveButton>
                <CancelButton type="button" onClick={onCancel}>
                    Avbryt
                </CancelButton>
            </ButtonContainer>
        </FormContainer>
    )
}

export default EditMarkerForm

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    label {
        font-family: 'Oswald', sans-serif;
        font-weight: 600;
    }
    input,
    textarea,
    select {
        width: 100%;
        padding: 0.5rem;
        border-radius: 0.5rem;
        border: 1px solid #ccc;
        font-family: 'Oswald', sans-serif;
    }
`

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
`

const SaveButton = styled.button`
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    color: #fff;
    background-color: #006aa7;
    border: none;
    font-family: 'Oswald', sans-serif;
    font-weight: 600;
    cursor: pointer;
    transition: 0.4s;
    &:hover {
        box-shadow: 1px 1px 2px 0px rgba(22, 22, 22, 0.75);
    }
`

const CancelButton = styled.button`
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    color: #fff;
    background-color: #bc0606;
    border: none;
    font-family: 'Oswald', sans-serif;
    font-weight: 600;
    cursor: pointer;
    transition: 0.4s;
    &:hover {
        box-shadow: 1px 1px 2px 0px rgba(22, 22, 22, 0.75);
    }
`

import React, { useState, useEffect, useRef } from 'react'
// Databasen
import { supabase } from '../helper/supabaseClient'
import styled from 'styled-components'
// Leaflet
import 'leaflet/dist/leaflet.css'
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    LayersControl,
    useMapEvents
} from 'react-leaflet'
import { Icon, divIcon } from 'leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
// AuthContext
import { useAuth } from '../context/AuthContext'
// Redigera plats formulär
import EditMarkerForm from './EditMarkerForm'

function MapPart() {
    const [data, setData] = useState([])
    const { isLoggedIn } = useAuth()
    const [editingMarker, setEditingMarker] = useState(null)
    const [clickedPosition, setClickedPosition] = useState(null)

    useEffect(() => {
        const fetchMarkers = async () => {
            const { data, error } = await supabase.from('markers').select('*')
            if (error) console.error('Fel vid databas hämtning:', error)
            else setData(data)
        }
        fetchMarkers()
    }, [])

    const createClusterIcon = (cluster) => {
        return new divIcon({
            html: `<div className="cirlce">${cluster.getChildCount()}</div>`,
            iconSize: [33, 33],
            className: 'custom-cluster-icon'
        })
    }

    const handleRemove = async (id) => {
        const { error } = await supabase.from('markers').delete().eq('id', id)
        if (error) {
            console.error('Fel vid borttagning:', error)
        } else {
            setData(data.filter((marker) => marker.id !== id))
        }
    }

    const markerRefs = useRef({})

    const handleEdit = (marker) => {
        if (markerRefs.current[marker.id]) {
            markerRefs.current[marker.id].closePopup()
        }
        setTimeout(() => {
            setEditingMarker(marker)
            setTimeout(() => {
                if (markerRefs.current[marker.id]) {
                    markerRefs.current[marker.id].openPopup()
                }
            }, 100)
        }, 10)
    }

    const handleSave = async (updatedMarker) => {
        const { error } = await supabase
            .from('markers')
            .update({
                name: updatedMarker.name,
                icon: updatedMarker.icon,
                popupcontent: updatedMarker.popupcontent
            })
            .eq('id', updatedMarker.id)
        if (error) {
            console.error('Fel vid redigering:', error)
        } else {
            setData(
                data.map((marker) =>
                    marker.id === updatedMarker.id ? updatedMarker : marker
                )
            )
            setEditingMarker(null)
        }
    }

    const MapClickHandler = () => {
        useMapEvents({
            click: (e) => {
                setClickedPosition({ lat: e.latlng.lat, lng: e.latlng.lng })
            },
            contextmenu: (e) => {
                const newPosition = { lat: e.latlng.lat, lng: e.latlng.lng }
                setClickedPosition(newPosition)
            }
        })

        return null
    }

    return (
        <>
            <MapContainer
                center={[59.40360214513208, 18.32974331322703]}
                zoom={11}
            >
                <MapClickHandler />
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="OpenStreetMap">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Esri World Imagery">
                        <TileLayer
                            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                    </LayersControl.BaseLayer>
                    <MarkerClusterGroup
                        chunkedLoading
                        iconCreateFunction={createClusterIcon}
                    >
                        {data.map((marker) => {
                            const markerIcon = new Icon({
                                iconUrl: marker.icon
                                    ? `${process.env.PUBLIC_URL}${marker.icon}`
                                    : `${process.env.PUBLIC_URL}/img/location.webp`,
                                iconSize: [30, 30]
                            })
                            return (
                                <Marker
                                    key={marker.id}
                                    position={[marker.lat, marker.lng]}
                                    icon={markerIcon}
                                    ref={(ref) =>
                                        (markerRefs.current[marker.id] = ref)
                                    }
                                >
                                    <Popup>
                                        {editingMarker &&
                                        editingMarker.id === marker.id ? (
                                            <EditMarkerForm
                                                marker={marker}
                                                onSave={handleSave}
                                                onCancel={() =>
                                                    setEditingMarker(null)
                                                }
                                            />
                                        ) : (
                                            <>
                                                <h3>{marker.name}</h3>
                                                <p>{marker.popupcontent}</p>
                                                {isLoggedIn && (
                                                    <>
                                                        <RemoveButton
                                                            onClick={() =>
                                                                handleRemove(
                                                                    marker.id
                                                                )
                                                            }
                                                        >
                                                            Ta bort
                                                        </RemoveButton>
                                                        <EditButton
                                                            onClick={() =>
                                                                handleEdit(
                                                                    marker
                                                                )
                                                            }
                                                        >
                                                            Redigera
                                                        </EditButton>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </Popup>
                                </Marker>
                            )
                        })}
                    </MarkerClusterGroup>
                </LayersControl>
            </MapContainer>
            {clickedPosition && (
                <>
                    {console.log('Position selected:', clickedPosition)}
                    <PositionInfo>
                        <p>Latitude: {clickedPosition.lat}</p>
                        <p>Longitude: {clickedPosition.lng}</p>
                        <button onClick={() => setClickedPosition(null)}>
                            Stäng
                        </button>
                    </PositionInfo>
                </>
            )}
        </>
    )
}

export default MapPart

// Styling
const RemoveButton = styled.button`
    width: clamp(3rem, 20vw, 6rem);
    margin-right: 1rem;
    padding: 0.2rem;
    border-radius: 0.5rem;
    color: #fff;
    background-color: #bc0606;
    border: none;
    font-family: 'Oswald', sans-serif;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: 0.4s;
    &:hover {
        box-shadow: 1px 1px 2px 0px rgba(22, 22, 22, 0.75);
    }
`
const EditButton = styled.button`
    width: clamp(3rem, 20vw, 6rem);
    padding: 0.2rem;
    border-radius: 0.5rem;
    color: #fff;
    background-color: #006aa7;
    border: none;
    font-family: 'Oswald', sans-serif;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: 0.4s;
    &:hover {
        box-shadow: 1px 1px 2px 0px rgba(22, 22, 22, 0.75);
    }
`
const PositionInfo = styled.div`
    position: fixed;
    top: 20%;
    left: 10%;
    background: #fff;
    padding: 0.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 999;
    font-family: 'Oswald', sans-serif;

    button {
        padding: 0.4rem;
        border-radius: 0.3rem;
        color: #fff;
        background-color: #006aa7;
        border: none;
        font-weight: 500;
        font-size: 1rem;
        cursor: pointer;
    }
`

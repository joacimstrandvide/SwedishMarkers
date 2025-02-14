import React, { useState, useEffect } from 'react'
import { supabase } from '../helper/supabaseClient'
import styled from 'styled-components'
import 'leaflet/dist/leaflet.css'
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    LayersControl
} from 'react-leaflet'
import { Icon, divIcon } from 'leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { useAuth } from '../context/AuthContext'

function MapPart() {
    const [data, setData] = useState([])
    const { isLoggedIn } = useAuth()

    // Hämta alla platser från postgres databasen
    useEffect(() => {
        const fetchMarkers = async () => {
            const { data, error } = await supabase.from('markers').select('*')
            if (error) console.error('Fel vid databas hämtning:', error)
            else setData(data)
        }
        fetchMarkers()
    }, [])

    // Kluster ikoner för när flera objekt är nära varandra
    const createClusterIcon = (cluster) => {
        return new divIcon({
            html: `<div className="cirlce">${cluster.getChildCount()}</div>`,
            iconSize: [33, 33],
            className: 'custom-cluster-icon'
        })
    }

    return (
        <>
            <MapContainer
                center={[59.40360214513208, 18.32974331322703]}
                zoom={13}
            >
                <LayersControl position="topright">
                    {/* Olika kartor */}
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
                            // Default eller custom ikon
                            const markerIcon = new Icon({
                                iconUrl: marker.icon
                                    ? `${process.env.PUBLIC_URL}${marker.icon}`
                                    : `${process.env.PUBLIC_URL}/img/location.webp`,
                                iconSize: [30, 30]
                            })

                            return (
                                // Varje individuel plats
                                <Marker
                                    key={marker.id}
                                    position={[marker.lat, marker.lng]}
                                    icon={markerIcon}
                                >
                                    <Popup>
                                        <h3>{marker.name}</h3>
                                        <p>{marker.popupcontent}</p>
                                        {isLoggedIn && (
                                            <>
                                                <RemoveButton>
                                                    Ta bort
                                                </RemoveButton>
                                                <EditButton>
                                                    Redigera
                                                </EditButton>
                                            </>
                                        )}
                                    </Popup>
                                </Marker>
                            )
                        })}
                    </MarkerClusterGroup>
                </LayersControl>
            </MapContainer>
        </>
    )
}

export default MapPart

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
    transition: .4s;
    &:hover {
        box-shadow: 4px 4px 4px 0px rgba(22, 22, 22, 0.75);
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
    transition: .4s;
    &:hover {
        box-shadow: 4px 4px 4px 0px rgba(22, 22, 22, 0.75);
    }
`

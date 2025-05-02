import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Rating from '@mui/material/Rating'
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

function MapPart() {
    const [data, setData] = useState([])
    const [clickedPosition, setClickedPosition] = useState(null)

    // Fetch from JSON hosted on GitHub
    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                const response = await fetch(
                    'https://raw.githubusercontent.com/joacimstrandvide/SwedishMarkers-data/main/locations.json'
                )
                const markers = await response.json()
                setData(markers)
            } catch (err) {
                console.error('Failed to fetch marker data:', err)
            }
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

    const markerRefs = useRef({})

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
                                        <h3>{marker.name}</h3>
                                        <p>{marker.popupcontent}</p>
                                        {marker.score && (
                                            <Rating
                                                name="size-medium"
                                                defaultValue={marker.score}
                                                precision={0.5}
                                                readOnly
                                            />
                                        )}
                                    </Popup>
                                </Marker>
                            )
                        })}
                    </MarkerClusterGroup>
                </LayersControl>
            </MapContainer>
            {clickedPosition && (
                <PositionInfo>
                    <p>
                        {clickedPosition.lat} {clickedPosition.lng}
                    </p>
                    <button onClick={() => setClickedPosition(null)}>
                        Stäng
                    </button>
                </PositionInfo>
            )}
        </>
    )
}

export default MapPart

// Styling remains unchanged
const PositionInfo = styled.div`
    position: fixed;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
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

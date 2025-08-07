import React, { useState, useEffect, useRef } from 'react'
// CSS
import styles from './Map.module.css'
import Rating from '@mui/material/Rating'
// Leaflet
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
// Sök komponenten
import OSMFetch from './OSMFetch'

// Fixa default ikon när användaren söker
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
})

function MapPart({ selectedCategory }) {
    const [data, setData] = useState([])

    // Hämta plats data
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

    // Skapa kluster ikon
    const createClusterIcon = (cluster) => {
        return new divIcon({
            html: `<div className="circle">${cluster.getChildCount()}</div>`,
            iconSize: [33, 33],
            className: 'custom-cluster-icon'
        })
    }

    const markerRefs = useRef({})

    const filteredData =
        selectedCategory === 'all'
            ? data
            : data.filter((marker) => marker.icon === selectedCategory)

    return (
        <>
            <MapContainer center={[59.4036, 18.3297]} zoom={11}>
                <OSMFetch />
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

                    <LayersControl.BaseLayer name="CartoDB Positron">
                        <TileLayer
                            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="OpenTopoMap">
                        <TileLayer
                            attribution='Map data: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
                            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.Overlay name="OpenSeaMap Nautical">
                        <TileLayer
                            attribution='Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
                            url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
                        />
                    </LayersControl.Overlay>

                    <MarkerClusterGroup
                        chunkedLoading
                        iconCreateFunction={createClusterIcon}
                    >
                        {filteredData.map((marker) => {
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
                                        <div className={styles.popupContent}>
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
                                        </div>
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

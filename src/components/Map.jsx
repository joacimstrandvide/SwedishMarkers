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
    LayersControl,
    useMapEvents
} from 'react-leaflet'
import { Icon, divIcon } from 'leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'

const OsmInfo = ({ data }) => {
    if (!data || data.length === 0) return <p>Ingen OSM data hittades.</p>
    // Visa OSM data
    return (
        <div className={styles.osmInfo}>
            <h4>OpenStreetMap Info:</h4>
            <div className={styles.osmScroll}>
                {data.map((element) => (
                    <div key={element.id} className={styles.osmItem}>
                        {element.tags &&
                            Object.entries(element.tags).map(([key, value]) => (
                                <div key={key}>
                                    <strong>{key.replace(/_/g, ' ')}:</strong>{' '}
                                    {value}
                                </div>
                            ))}
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    )
}

function MapPart({ selectedCategory }) {
    const [data, setData] = useState([])
    const [osmData, setOsmData] = useState(null) // OSM data
    const [loadingOsm, setLoadingOsm] = useState(false)

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

    const MapClickHandler = () => {
        useMapEvents({
            click: () => {
                setOsmData(null)
            },
            contextmenu: (e) => {
                const lat = e.latlng.lat.toFixed(6)
                const lng = e.latlng.lng.toFixed(6)

                setOsmData(null)
                // Skapa en ny issue för att lägga till en ny plats
                const issueBody = encodeURIComponent(
                    `**Namn:**\n\n\n**Beskrivning:**\n\n\n**Latitude (lat):**\n${lat}\n\n**Longitude (lng):**\n${lng}\n\n**Ikon:**\n\n**Poäng:**\n`
                )
                const issueUrl = `https://github.com/joacimstrandvide/SwedishMarkers-data/issues/new?template=ny-plats-.md&body=${issueBody}`

                window.open(issueUrl, '_blank')
            }
        })

        return null
    }

    // Hämta OSM data
    const fetchOsmDetails = async (lat, lng) => {
        setLoadingOsm(true)
        const query = `
    [out:json][timeout:10];
(
  node(around:20,${lat},${lng})[historic];
  node(around:20,${lat},${lng})[amenity];
  way(around:20,${lat},${lng})[amenity];
  way(around:20,${lat},${lng})[historic];
  node(around:20,${lat},${lng})[natural];
  node(around:20,${lat},${lng})[leisure=park];
  node(around:20,${lat},${lng})[leisure=nature_reserve];
  node(around:20,${lat},${lng})[landuse=forest];
  way(around:20,${lat},${lng})[natural];
  way(around:20,${lat},${lng})[leisure=park];
  way(around:20,${lat},${lng})[leisure=nature_reserve];
  way(around:20,${lat},${lng})[landuse=forest];
  relation(around:20,${lat},${lng})[boundary=national_park];
);
out center qt;
  `
        const url =
            'https://overpass-api.de/api/interpreter?data=' +
            encodeURIComponent(query)

        try {
            const response = await fetch(url)
            if (!response.ok) throw new Error('Overpass API fel')
            const json = await response.json()
            setOsmData(json.elements)
        } catch (error) {
            console.error('Kunde inte hämta OSM data:', error)
            setOsmData(null)
        } finally {
            setLoadingOsm(false)
        }
    }

    const filteredData =
        selectedCategory === 'all'
            ? data
            : data.filter((marker) => marker.icon === selectedCategory)

    return (
        <>
            <MapContainer center={[59.4036, 18.3297]} zoom={11}>
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
                        {filteredData.map((marker) => {
                            const markerIcon = new Icon({
                                iconUrl: marker.icon
                                    ? `${process.env.PUBLIC_URL}${marker.icon}`
                                    : `${process.env.PUBLIC_URL}/img/location.webp`,
                                iconSize: [30, 30]
                            })

                            const handleMarkerClick = () => {
                                fetchOsmDetails(marker.lat, marker.lng)
                            }

                            return (
                                <Marker
                                    key={marker.id}
                                    position={[marker.lat, marker.lng]}
                                    icon={markerIcon}
                                    ref={(ref) =>
                                        (markerRefs.current[marker.id] = ref)
                                    }
                                    eventHandlers={{
                                        click: handleMarkerClick
                                    }}
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
                                            {/* OSM data */}
                                            {loadingOsm && (
                                                <p>Laddar OSM data...</p>
                                            )}
                                            {!loadingOsm && (
                                                <OsmInfo data={osmData} />
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

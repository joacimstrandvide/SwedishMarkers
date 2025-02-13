import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
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

function MapPart() {
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchMarkers = async () => {
            const { data, error } = await supabase.from('markers').select('*')
            if (error) console.error('Error fetching markers:', error)
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

    return (
        <>
            <MapContainer
                center={[59.40360214513208, 18.32974331322703]}
                zoom={13}
            >
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
                                >
                                    <Popup>
                                        <h3>{marker.name}</h3>
                                        <p>{marker.popupcontent}</p>
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

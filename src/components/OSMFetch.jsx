import { useMap } from 'react-leaflet'
import { useState } from 'react'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import styles from './OSMFetch.module.css'

export default function OsmFetcher() {
    const map = useMap()
    const [searchTerm, setSearchTerm] = useState('')
    const [osmData, setOsmData] = useState(null)
    const [loading, setLoading] = useState(false)

    // Hitta området anänvdaren tittar på
    const fetchOsmByBounds = async (theme) => {
        if (!map) return
        const bounds = map.getBounds()
        const south = bounds.getSouth()
        const west = bounds.getWest()
        const north = bounds.getNorth()
        const east = bounds.getEast()

        setLoading(true)

        const query = `
[out:json][timeout:15];
(
  node["amenity"="${theme}"](${south},${west},${north},${east});
  way["amenity"="${theme}"](${south},${west},${north},${east});
);
out center qt;
        `
        const url =
            'https://overpass-api.de/api/interpreter?data=' +
            encodeURIComponent(query)

        try {
            const response = await fetch(url)
            const json = await response.json()
            setOsmData(json.elements)

            // Zooma till resultat
            const locations = json.elements
                .map((el) => {
                    if (el.lat && el.lon) return [el.lat, el.lon]
                    if (el.center) return [el.center.lat, el.center.lon]
                    return null
                })
                .filter(Boolean)

            if (locations.length > 0) {
                const resultBounds = L.latLngBounds(locations)
                map.fitBounds(resultBounds)
            }
        } catch (err) {
            console.error('OSM fetch failed:', err)
            setOsmData([])
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchTerm.trim() !== '') {
            fetchOsmByBounds(searchTerm.trim().toLowerCase())
        }
    }

    return (
        <>
            <form className={styles.searchBar} onSubmit={handleSearch}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Sök..."
                />
                <button type="submit">Sök</button>
            </form>

            {loading && (
                <div className={styles.loadingText}>Laddar OSM data...</div>
            )}

            {osmData &&
                osmData.map((el) => {
                    if (el.type === 'node' && el.lat && el.lon) {
                        return (
                            <Marker key={el.id} position={[el.lat, el.lon]}>
                                <Popup>
                                    {el.tags?.name ||
                                        el.tags?.amenity ||
                                        'Namnlös'}
                                    <br />
                                </Popup>
                            </Marker>
                        )
                    }

                    if (el.type === 'way' && el.center) {
                        return (
                            <Marker
                                key={el.id}
                                position={[el.center.lat, el.center.lon]}
                            >
                                <Popup>
                                    {el.tags?.name ||
                                        el.tags?.amenity ||
                                        'Namnlös'}
                                    <br />
                                </Popup>
                            </Marker>
                        )
                    }

                    return null
                })}
        </>
    )
}

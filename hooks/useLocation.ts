import { useState, useEffect } from 'react'
import * as Location from 'expo-location'

export function useLocation() {
    const [location, setLocation] = useState<Location.LocationObject | null>(
        null
    )
    const [locationName, setLocationName] = useState<string>('')
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    async function updateLocation() {
        try {
            // First, request permission
            const { status } =
                await Location.requestForegroundPermissionsAsync()

            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied')
                return
            }

            // Get current location
            const currentLocation = await Location.getCurrentPositionAsync({})
            setLocation(currentLocation)

            // Get location name
            const [place] = await Location.reverseGeocodeAsync({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            })

            if (place) {
                const locality =
                    place.city ||
                    place.district ||
                    place.subregion ||
                    place.region ||
                    ''
                const country = place.country || ''

                if (locality && country) {
                    setLocationName(`${locality}, ${country}`)
                } else if (locality) {
                    setLocationName(locality)
                } else if (country) {
                    setLocationName(country)
                } else {
                    setLocationName('Location name unavailable')
                }
            } else {
                setLocationName('Location name unavailable')
            }
        } catch (error) {
            console.error('Error updating location:', error)
            setErrorMsg('Failed to get location')
        }
    }

    // Request location permission and get initial location when component mounts
    useEffect(() => {
        updateLocation()
    }, [])

    return { location, locationName, errorMsg, updateLocation }
}

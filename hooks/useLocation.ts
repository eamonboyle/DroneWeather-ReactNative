import { useState, useEffect } from 'react'
import * as Location from 'expo-location'

export function useLocation() {
    const [location, setLocation] = useState<Location.LocationObject | null>(
        null
    )
    const [locationName, setLocationName] = useState<string>('')
    const [error, setError] = useState<Error | null>(null)

    const updateLocation = async (newLocation: Location.LocationObject) => {
        try {
            setLocation(newLocation)

            // Get location name using reverse geocoding
            const [placeDetails] = await Location.reverseGeocodeAsync({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
            })

            if (placeDetails) {
                const locationString =
                    placeDetails.city ||
                    placeDetails.region ||
                    'Current location'
                setLocationName(locationString)
            } else {
                setLocationName('Current location')
            }
        } catch (error) {
            setError(error as Error)
            console.error('Error updating location:', error)
        }
    }

    return {
        location,
        locationName,
        error,
        updateLocation,
    }
}

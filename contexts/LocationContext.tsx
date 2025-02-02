import React, { createContext, useContext, useState, useEffect } from 'react'
import * as Location from 'expo-location'

interface LocationContextType {
    location: Location.LocationObject | null
    locationName: string
    errorMsg: string | null
    updateLocation: (manualLocation?: Location.LocationObject) => Promise<void>
}

const LocationContext = createContext<LocationContextType | undefined>(
    undefined
)

export function LocationProvider({ children }: { children: React.ReactNode }) {
    const [location, setLocation] = useState<Location.LocationObject | null>(
        null
    )
    const [locationName, setLocationName] = useState<string>('')
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    async function updateLocation(manualLocation?: Location.LocationObject) {
        try {
            let currentLocation: Location.LocationObject

            if (manualLocation) {
                // Use manually selected location
                currentLocation = manualLocation
            } else if (!location) {
                // Only get device location if we don't have a location yet
                const { status } =
                    await Location.requestForegroundPermissionsAsync()

                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied')
                    return
                }

                currentLocation = await Location.getCurrentPositionAsync({})
            } else {
                // If we already have a location and no manual location provided, keep current location
                return
            }

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

    // Get initial location on app start
    useEffect(() => {
        if (!location) {
            updateLocation()
        }
    }, [])

    return (
        <LocationContext.Provider
            value={{ location, locationName, errorMsg, updateLocation }}
        >
            {children}
        </LocationContext.Provider>
    )
}

export function useLocation() {
    const context = useContext(LocationContext)
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider')
    }
    return context
}

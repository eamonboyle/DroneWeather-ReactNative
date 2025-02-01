import { useState, useEffect } from 'react'
import { View, Alert } from 'react-native'
import { WeekView } from '@/components/WeekView'
import { LocationBar } from '@/components/LocationBar'
import { WeatherService } from '@/services/weatherService'
import { WeatherData } from '@/types/weather'
import { useLocation } from '@/hooks/useLocation'
import * as Location from 'expo-location'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function WeekScreen() {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
    const [selectedHour, setSelectedHour] = useState(24)
    const [isLoading, setIsLoading] = useState(true)
    const { location, locationName, updateLocation } = useLocation()

    // Update weather data when location changes
    useEffect(() => {
        if (location) {
            handleLocationUpdate(location)
        }
    }, [location])

    const handleLocationUpdate = async (location: Location.LocationObject) => {
        setIsLoading(true)
        try {
            const weather = await WeatherService.getCurrentWeather(
                location.coords.latitude,
                location.coords.longitude
            )
            setWeatherData(weather)
        } catch (error) {
            console.error('Error fetching weather data:', error)
            Alert.alert(
                'Error',
                'Failed to fetch weather data. Please try again.'
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-black">
            <LocationBar
                locationName={locationName}
                onLocationUpdate={updateLocation}
            />
            {isLoading ? (
                <LoadingSpinner />
            ) : weatherData ? (
                <WeekView
                    weatherData={weatherData}
                    onHourSelect={setSelectedHour}
                />
            ) : null}
        </SafeAreaView>
    )
}

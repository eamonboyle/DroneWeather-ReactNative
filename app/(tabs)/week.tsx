import { useState, useEffect } from 'react'
import { View, Alert } from 'react-native'
import { WeekView } from '@/components/WeekView'
import { LocationBar } from '@/components/LocationBar'
import { WeatherService } from '@/services/weatherService'
import { WeatherData } from '@/types/weather'
import { useLocation } from '@/hooks/useLocation'
import * as Location from 'expo-location'
import { LoadingSpinner } from '@/components/LoadingSpinner'

export default function WeekScreen() {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
    const [selectedHour, setSelectedHour] = useState(24) // Start with first hour of tomorrow
    const [isLoading, setIsLoading] = useState(true)
    const { location, locationName, updateLocation } = useLocation()

    // Add useEffect to fetch weather data when location changes
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
        <View className="flex-1 bg-black">
            <LocationBar
                locationName={locationName}
                onLocationUpdate={handleLocationUpdate}
            />
            {isLoading ? (
                <LoadingSpinner />
            ) : weatherData ? (
                <WeekView
                    weatherData={weatherData}
                    onHourSelect={setSelectedHour}
                />
            ) : null}
        </View>
    )
}

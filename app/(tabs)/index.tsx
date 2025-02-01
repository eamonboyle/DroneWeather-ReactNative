import { View, Text, Alert, ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import * as Location from 'expo-location'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WeatherData, DroneFlightConditions } from '@/types/weather'
import { WeatherService } from '@/services/weatherService'
import { LocationBar } from '@/components/LocationBar'
import { WeatherGrid } from '@/components/WeatherGrid'
import React from 'react'
import { HourSelector } from '@/components/HourSelector'

export default function Home() {
    const [location, setLocation] = useState<Location.LocationObject | null>(
        null
    )
    const [locationName, setLocationName] = useState<string>('Current location')
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [flightConditions, setFlightConditions] =
        useState<DroneFlightConditions>({
            isSuitable: false,
            reasons: [],
        })
    const [selectedHour, setSelectedHour] = useState(() => {
        const now = new Date()
        return now.getHours()
    })

    const handleLocationUpdate = async (
        newLocation: Location.LocationObject
    ) => {
        setIsLoading(true)
        setLocation(newLocation)

        // Get location name using reverse geocoding
        const [placeDetails] = await Location.reverseGeocodeAsync({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
        })

        if (placeDetails) {
            const locationString =
                placeDetails.city || placeDetails.region || 'Current location'
            setLocationName(locationString)
        }

        // Fetch weather data
        try {
            const weather = await WeatherService.getCurrentWeather(
                newLocation.coords.latitude,
                newLocation.coords.longitude
            )
            setWeatherData(weather)
            const conditions = WeatherService.isDroneFlyable(weather)
            setFlightConditions(conditions)
        } catch (error) {
            console.error('Error fetching weather data:', error)
            Alert.alert('Error', 'Failed to fetch weather data')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        ;(async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                console.error('Permission to access location was denied')
                return
            }

            const location = await Location.getCurrentPositionAsync({})
            await handleLocationUpdate(location)
        })()
    }, [])

    return (
        <SafeAreaView className="flex-1 bg-black">
            <LocationBar
                locationName={locationName}
                onLocationUpdate={handleLocationUpdate}
            />

            <View className="flex-1 p-4">
                {isLoading ? (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-white text-lg mb-2">
                            Loading weather data...
                        </Text>
                        <ActivityIndicator size="large" color="#ffffff" />
                    </View>
                ) : (
                    <>
                        <View
                            className={`p-4 rounded-lg mb-4 ${
                                flightConditions.isSuitable
                                    ? 'bg-safe'
                                    : 'bg-danger'
                            }`}
                        >
                            <Text className="text-2xl text-white text-center">
                                {flightConditions.isSuitable
                                    ? 'Safe to fly'
                                    : 'Not suitable for flying'}
                            </Text>
                            {flightConditions.reasons.length > 0 && (
                                <Text className="text-white text-center mt-2">
                                    {flightConditions.reasons.join(', ')}
                                </Text>
                            )}
                        </View>

                        {weatherData && (
                            <WeatherGrid
                                weatherData={weatherData}
                                hourIndex={selectedHour}
                            />
                        )}
                    </>
                )}
            </View>

            <HourSelector
                selectedHour={selectedHour}
                onHourChange={setSelectedHour}
                className="mb-4"
            />
        </SafeAreaView>
    )
}

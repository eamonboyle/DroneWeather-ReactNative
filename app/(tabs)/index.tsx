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
import { useLocation } from '@/hooks/useLocation'

export default function Home() {
    const { location, locationName, errorMsg, updateLocation } = useLocation()
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedHour, setSelectedHour] = useState(0)
    const [flightConditions, setFlightConditions] =
        useState<DroneFlightConditions>({
            isSuitable: false,
            reasons: [],
        })

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
            const conditions = await WeatherService.isDroneFlyable(
                weather,
                selectedHour
            )
            setFlightConditions(conditions)
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

    useEffect(() => {
        if (weatherData) {
            const updateFlightConditions = async () => {
                const conditions = await WeatherService.isDroneFlyable(
                    weatherData,
                    selectedHour
                )
                setFlightConditions(conditions)
            }
            updateFlightConditions()
        }
    }, [weatherData, selectedHour])

    useEffect(() => {
        ;(async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                console.error('Permission to access location was denied')
                return
            }

            const location = await Location.getCurrentPositionAsync({})
            await updateLocation()
        })()
    }, [])

    return (
        <SafeAreaView className="flex-1 bg-black">
            <LocationBar
                locationName={locationName}
                onLocationUpdate={updateLocation}
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

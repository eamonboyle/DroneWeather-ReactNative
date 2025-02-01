import { View, Text, Alert } from 'react-native'
import { useEffect, useState } from 'react'
import * as Location from 'expo-location'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WeatherData, DroneFlightConditions } from '@/types/weather'
import { WeatherService } from '@/services/weatherService'
import { LocationBar } from '@/components/LocationBar'
import { WeatherGrid } from '@/components/WeatherGrid'

export default function Home() {
    const [location, setLocation] = useState<Location.LocationObject | null>(
        null
    )
    const [locationName, setLocationName] = useState<string>('Current location')
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
    const [flightConditions, setFlightConditions] =
        useState<DroneFlightConditions>({
            isSuitable: false,
            reasons: [],
        })

    const handleLocationUpdate = async (
        newLocation: Location.LocationObject
    ) => {
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
                <View
                    className={`p-4 rounded-lg mb-4 ${
                        flightConditions.isSuitable ? 'bg-safe' : 'bg-danger'
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

                {weatherData && <WeatherGrid weatherData={weatherData} />}
            </View>
        </SafeAreaView>
    )
}

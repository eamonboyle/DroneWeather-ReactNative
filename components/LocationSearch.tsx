import React, { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
} from 'react-native'
import {
    searchLocations,
    LocationSearchResult,
} from '@/services/locationSearchService'
import * as Location from 'expo-location'
import { useWeatherData } from '@/contexts/WeatherDataContext'
import { WeatherService } from '@/services/weatherService'
import { useLocation } from '@/contexts/LocationContext'

interface LocationSearchProps {
    onLocationSelected?: () => void
}

export function LocationSearch({ onLocationSelected }: LocationSearchProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [results, setResults] = useState<LocationSearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { updateLocation } = useLocation()
    const { setWeatherData } = useWeatherData()

    const handleSearch = async () => {
        if (!searchQuery.trim()) return

        setIsLoading(true)
        setError(null)

        try {
            const searchResults = await searchLocations(searchQuery)
            setResults(searchResults)
        } catch (err) {
            setError('Failed to search locations. Please try again.')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLocationSelect = async (result: LocationSearchResult) => {
        try {
            // Create a mock location object that matches the structure expected by the app
            const mockLocation: Location.LocationObject = {
                coords: {
                    latitude: result.latitude,
                    longitude: result.longitude,
                    altitude: null,
                    accuracy: null,
                    altitudeAccuracy: null,
                    heading: null,
                    speed: null,
                },
                timestamp: Date.now(),
            }

            // Update the location context with the selected location
            await updateLocation(mockLocation)

            // Fetch new weather data for the selected location
            const weather = await WeatherService.getCurrentWeather(
                result.latitude,
                result.longitude
            )
            setWeatherData(weather)

            // Clear the search results
            setResults([])
            setSearchQuery('')

            // Call the onLocationSelected callback if provided
            onLocationSelected?.()
        } catch (err) {
            setError('Failed to update location. Please try again.')
            console.error(err)
        }
    }

    return (
        <View className="w-full">
            <View className="flex-row items-center space-x-2 p-4">
                <TextInput
                    className="flex-1 h-10 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
                    placeholder="Search location..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity
                    onPress={handleSearch}
                    className="bg-blue-500 px-4 h-10 rounded-lg justify-center"
                >
                    <Text className="text-white">Search</Text>
                </TouchableOpacity>
            </View>

            {isLoading && (
                <View className="p-4">
                    <ActivityIndicator size="small" color="#0000ff" />
                </View>
            )}

            {error && <Text className="text-red-500 px-4">{error}</Text>}

            <ScrollView className="max-h-60">
                {results.map((result, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleLocationSelect(result)}
                        className="p-4 border-b border-gray-200 dark:border-gray-700"
                    >
                        <Text className="text-base dark:text-white">
                            {result.formatted}
                        </Text>
                        {(result.city || result.country) && (
                            <Text className="text-sm text-gray-500 dark:text-gray-400">
                                {[result.city, result.country]
                                    .filter(Boolean)
                                    .join(', ')}
                            </Text>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

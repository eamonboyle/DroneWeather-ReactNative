import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import { useState } from 'react'

interface LocationBarProps {
    locationName: string
    onLocationUpdate: () => Promise<void>
}

export function LocationBar({
    locationName,
    onLocationUpdate,
}: LocationBarProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleSearchPress = () => {
        Alert.alert('Search', 'Search for a location')
    }

    const handleLocationPress = async () => {
        if (isLoading) return // Prevent multiple presses while loading

        setIsLoading(true)
        try {
            await onLocationUpdate()
        } catch (error) {
            console.error('Error getting location:', error)
            Alert.alert('Error', 'Failed to get current location')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-800">
            <Pressable
                onPress={handleSearchPress}
                className="w-10 h-10 items-center justify-center"
            >
                <Ionicons name="search" size={24} color="#3b82f6" />
            </Pressable>

            <View className="flex-1 items-center">
                <Text className="text-blue-500 text-xl font-semibold">
                    {locationName}
                </Text>
            </View>

            <Pressable
                onPress={handleLocationPress}
                className="w-10 h-10 items-center justify-center"
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#3b82f6" />
                ) : (
                    <Ionicons name="locate" size={24} color="#3b82f6" />
                )}
            </Pressable>
        </View>
    )
}

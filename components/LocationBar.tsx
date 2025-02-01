import { View, Text, Pressable, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Location from 'expo-location'

interface LocationBarProps {
    locationName: string
    onLocationUpdate: () => Promise<void>
}

export function LocationBar({
    locationName,
    onLocationUpdate,
}: LocationBarProps) {
    const handleSearchPress = () => {
        Alert.alert('Search', 'Search for a location')
    }

    const handleLocationPress = async () => {
        try {
            await onLocationUpdate()
        } catch (error) {
            console.error('Error getting location:', error)
            Alert.alert('Error', 'Failed to get current location')
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
            >
                <Ionicons name="location" size={24} color="#3b82f6" />
            </Pressable>
        </View>
    )
}

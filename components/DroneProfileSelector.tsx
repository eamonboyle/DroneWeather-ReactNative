import React from 'react'
import {
    View,
    Text,
    Image,
    Pressable,
    Modal,
    ScrollView,
    StyleSheet,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { DroneProfile, DRONE_PROFILES } from '@/types/droneProfiles'

interface DroneProfileSelectorProps {
    selectedProfile: DroneProfile | null
    onSelectProfile: (profile: DroneProfile) => void
}

export function DroneProfileSelector({
    selectedProfile,
    onSelectProfile,
}: DroneProfileSelectorProps) {
    const [isModalVisible, setIsModalVisible] = React.useState(false)

    return (
        <View className="mb-6">
            <Text className="text-blue-400 text-lg mb-2">Drone Profile</Text>

            <Pressable
                onPress={() => setIsModalVisible(true)}
                className="bg-gray-800/50 rounded-lg p-4 flex-row items-center justify-between"
            >
                {selectedProfile ? (
                    <View className="flex-row items-center flex-1">
                        {selectedProfile.imageUrl && (
                            <Image
                                source={{ uri: selectedProfile.imageUrl }}
                                className="w-12 h-12 rounded-md mr-3"
                            />
                        )}
                        <View className="flex-1">
                            <Text className="text-white text-lg font-semibold">
                                {selectedProfile.name}
                            </Text>
                            <Text className="text-gray-400">
                                {selectedProfile.manufacturer}
                            </Text>
                        </View>
                    </View>
                ) : (
                    <Text className="text-gray-400 text-lg">
                        Select a drone profile
                    </Text>
                )}
                <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color="#60A5FA"
                />
            </Pressable>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View className="flex-1 bg-black/50">
                    <View className="flex-1 mt-24 bg-gray-900 rounded-t-3xl">
                        <View className="p-4 border-b border-gray-800 flex-row justify-between items-center">
                            <Text className="text-white text-xl font-semibold">
                                Select Drone Profile
                            </Text>
                            <Pressable
                                onPress={() => setIsModalVisible(false)}
                                className="p-2"
                            >
                                <MaterialCommunityIcons
                                    name="close"
                                    size={24}
                                    color="#60A5FA"
                                />
                            </Pressable>
                        </View>

                        <ScrollView className="flex-1 p-4">
                            {DRONE_PROFILES.map((profile) => (
                                <Pressable
                                    key={profile.id}
                                    onPress={() => {
                                        onSelectProfile(profile)
                                        setIsModalVisible(false)
                                    }}
                                    className={`bg-gray-800/50 rounded-lg p-4 mb-3 flex-row items-center ${
                                        selectedProfile?.id === profile.id
                                            ? 'border border-blue-500'
                                            : ''
                                    }`}
                                >
                                    {profile.imageUrl && (
                                        <Image
                                            source={{ uri: profile.imageUrl }}
                                            className="w-16 h-16 rounded-md mr-4"
                                        />
                                    )}
                                    <View className="flex-1">
                                        <Text className="text-white text-lg font-semibold">
                                            {profile.name}
                                        </Text>
                                        <Text className="text-gray-400">
                                            {profile.manufacturer} •{' '}
                                            {profile.model}
                                        </Text>
                                        <View className="flex-row mt-2">
                                            <Text className="text-gray-400 text-sm">
                                                Max Wind:{' '}
                                                {
                                                    profile.thresholds.windSpeed
                                                        .max
                                                }{' '}
                                                {
                                                    profile.thresholds.windSpeed
                                                        .unit
                                                }
                                            </Text>
                                            <Text className="text-gray-400 text-sm ml-4">
                                                Temp Range:{' '}
                                                {
                                                    profile.thresholds
                                                        .temperature.min
                                                }
                                                ° -
                                                {
                                                    profile.thresholds
                                                        .temperature.max
                                                }
                                                °
                                            </Text>
                                        </View>
                                    </View>
                                    {selectedProfile?.id === profile.id && (
                                        <MaterialCommunityIcons
                                            name="check-circle"
                                            size={24}
                                            color="#60A5FA"
                                            className="ml-2"
                                        />
                                    )}
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

import {
    StyleSheet,
    Image,
    Platform,
    View,
    TextInput,
    Alert,
    Text,
    Pressable,
} from 'react-native'
import { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { Collapsible } from '@/components/Collapsible'
import { ExternalLink } from '@/components/ExternalLink'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { WeatherThresholds } from '@/types/weatherConfig'
import { WeatherConfigService } from '@/services/weatherConfigService'
import { useWeatherConfig } from '@/contexts/WeatherConfigContext'

interface SettingItemProps {
    icon: keyof typeof MaterialCommunityIcons.glyphMap
    label: string
    value: string
    onChangeText: (value: string) => void
    unit: string
    sublabel?: string
}

function SettingItem({
    icon,
    label,
    value,
    onChangeText,
    unit,
    sublabel,
}: SettingItemProps) {
    return (
        <View className="bg-gray-800/50 rounded-lg p-4 mb-3">
            <View className="flex-row items-center mb-2">
                <MaterialCommunityIcons
                    name={icon}
                    size={24}
                    color="#60A5FA"
                    className="opacity-75"
                />
                <Text className="text-white text-lg font-semibold ml-2">
                    {label}
                </Text>
            </View>
            {sublabel && (
                <Text className="text-gray-400 text-sm mb-2 ml-9">
                    {sublabel}
                </Text>
            )}
            <View className="flex-row items-center ml-9">
                <TextInput
                    className="flex-1 bg-gray-700 text-white p-2 rounded-l-lg text-center text-lg"
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType="numeric"
                />
                <View className="bg-gray-600 px-3 py-2 rounded-r-lg">
                    <Text className="text-gray-300 text-lg">{unit}</Text>
                </View>
            </View>
        </View>
    )
}

export default function SettingsScreen() {
    const [thresholds, setThresholds] = useState<WeatherThresholds | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const { refreshThresholds } = useWeatherConfig()

    useEffect(() => {
        loadThresholds()
    }, [])

    const loadThresholds = async () => {
        try {
            const loadedThresholds = await WeatherConfigService.getThresholds()
            setThresholds(loadedThresholds)
        } catch (error) {
            Alert.alert('Error', 'Failed to load weather thresholds')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        if (!thresholds) return

        try {
            await WeatherConfigService.saveThresholds(thresholds)
            await refreshThresholds()
            Alert.alert('Success', 'Weather thresholds saved successfully')
        } catch (error) {
            Alert.alert('Error', 'Failed to save weather thresholds')
        }
    }

    const handleReset = async () => {
        try {
            const defaultThresholds =
                await WeatherConfigService.resetToDefaults()
            setThresholds(defaultThresholds)
            await refreshThresholds()
            Alert.alert('Success', 'Weather thresholds reset to defaults')
        } catch (error) {
            Alert.alert('Error', 'Failed to reset weather thresholds')
        }
    }

    const updateThreshold = (
        category: keyof WeatherThresholds,
        subcategory: string,
        value: string
    ) => {
        if (!thresholds) return

        const numValue = Number(value)
        if (isNaN(numValue)) return

        setThresholds({
            ...thresholds,
            [category]: {
                ...thresholds[category],
                [subcategory]: numValue,
            },
        })
    }

    if (isLoading || !thresholds) {
        return (
            <SafeAreaView className="flex-1 bg-gray-900">
                <View className="flex-1 justify-center items-center">
                    <Text className="text-white text-lg">
                        Loading settings...
                    </Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            <ScrollView className="flex-1 px-4">
                <View className="mt-4 mb-2">
                    <Text className="text-blue-400 text-lg mb-1">
                        Wind Settings
                    </Text>
                    <SettingItem
                        icon="weather-windy"
                        label="Maximum Wind Speed"
                        sublabel="Maximum safe wind speed for drone flight"
                        value={thresholds.windSpeed.safe.toString()}
                        onChangeText={(value) =>
                            updateThreshold('windSpeed', 'safe', value)
                        }
                        unit="km/h"
                    />
                    <SettingItem
                        icon="weather-windy-variant"
                        label="Maximum Wind Gusts"
                        sublabel="Maximum safe wind gust speed"
                        value={thresholds.windGusts.safe.toString()}
                        onChangeText={(value) =>
                            updateThreshold('windGusts', 'safe', value)
                        }
                        unit="km/h"
                    />
                </View>

                <View className="mb-2">
                    <Text className="text-blue-400 text-lg mb-1">
                        Visibility Settings
                    </Text>
                    <SettingItem
                        icon="eye"
                        label="Safe Visibility"
                        sublabel="Minimum safe visibility distance"
                        value={thresholds.visibility.safe.toString()}
                        onChangeText={(value) =>
                            updateThreshold('visibility', 'safe', value)
                        }
                        unit="m"
                    />
                    <SettingItem
                        icon="eye-outline"
                        label="Warning Visibility"
                        sublabel="Minimum visibility before warning"
                        value={thresholds.visibility.warning.toString()}
                        onChangeText={(value) =>
                            updateThreshold('visibility', 'warning', value)
                        }
                        unit="m"
                    />
                </View>

                <View className="mb-2">
                    <Text className="text-blue-400 text-lg mb-1">
                        Weather Conditions
                    </Text>
                    <SettingItem
                        icon="water-percent"
                        label="Safe Humidity"
                        value={thresholds.humidity.safe.toString()}
                        onChangeText={(value) =>
                            updateThreshold('humidity', 'safe', value)
                        }
                        unit="%"
                    />
                    <SettingItem
                        icon="water-percent"
                        label="Warning Humidity"
                        value={thresholds.humidity.warning.toString()}
                        onChangeText={(value) =>
                            updateThreshold('humidity', 'warning', value)
                        }
                        unit="%"
                    />
                    <SettingItem
                        icon="weather-pouring"
                        label="Safe Rain Chance"
                        value={thresholds.rainChance.safe.toString()}
                        onChangeText={(value) =>
                            updateThreshold('rainChance', 'safe', value)
                        }
                        unit="%"
                    />
                    <SettingItem
                        icon="weather-pouring"
                        label="Warning Rain Chance"
                        value={thresholds.rainChance.warning.toString()}
                        onChangeText={(value) =>
                            updateThreshold('rainChance', 'warning', value)
                        }
                        unit="%"
                    />
                </View>

                <View className="flex-row justify-between mb-6 mt-4">
                    <Pressable
                        className="bg-blue-600 px-6 py-4 rounded-lg flex-1 mr-2 flex-row items-center justify-center"
                        onPress={handleSave}
                    >
                        <MaterialCommunityIcons
                            name="content-save"
                            size={24}
                            color="white"
                        />
                        <Text className="text-white text-lg font-semibold ml-2">
                            Save Changes
                        </Text>
                    </Pressable>
                    <Pressable
                        className="bg-red-600 px-6 py-4 rounded-lg flex-1 ml-2 flex-row items-center justify-center"
                        onPress={handleReset}
                    >
                        <MaterialCommunityIcons
                            name="refresh"
                            size={24}
                            color="white"
                        />
                        <Text className="text-white text-lg font-semibold ml-2">
                            Reset
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
})

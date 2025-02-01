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
import {
    WeatherThresholds,
    DEFAULT_WEATHER_THRESHOLDS,
} from '@/types/weatherConfig'
import { WeatherConfigService } from '@/services/weatherConfigService'
import { useWeatherConfig } from '@/contexts/WeatherConfigContext'
import { SettingsSlider } from '@/components/SettingsSlider'

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
    const [thresholds, setThresholds] = useState<WeatherThresholds>(
        DEFAULT_WEATHER_THRESHOLDS
    )
    const [isLoading, setIsLoading] = useState(true)
    const { refreshThresholds, updateThresholds } = useWeatherConfig()

    useEffect(() => {
        loadThresholds()
    }, [])

    const loadThresholds = async () => {
        try {
            const loadedThresholds = await WeatherConfigService.getThresholds()
            setThresholds(loadedThresholds)
        } catch (error) {
            console.error('Error loading thresholds:', error)
            Alert.alert('Error', 'Failed to load weather thresholds')
            // Use default thresholds if loading fails
            setThresholds(DEFAULT_WEATHER_THRESHOLDS)
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = async () => {
        try {
            const defaultThresholds =
                await WeatherConfigService.resetToDefaults()
            setThresholds(defaultThresholds)
            await updateThresholds(defaultThresholds)
            Alert.alert('Success', 'Weather thresholds reset to defaults')
        } catch (error) {
            console.error('Error resetting thresholds:', error)
            Alert.alert('Error', 'Failed to reset weather thresholds')
            // Use default thresholds if reset fails
            setThresholds(DEFAULT_WEATHER_THRESHOLDS)
        }
    }

    const handleValueChange = (
        category: keyof WeatherThresholds,
        field: string,
        value: number | string
    ) => {
        const newThresholds = {
            ...thresholds,
            [category]: {
                ...thresholds[category],
                [field]: value,
            },
        }
        setThresholds(newThresholds)
        updateThresholds(newThresholds)
    }

    if (isLoading) {
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
                        Temperature
                    </Text>
                    <SettingsSlider
                        icon="thermometer"
                        label="Minimum Temperature"
                        value={thresholds.temperature.min}
                        onValueChange={(value) =>
                            handleValueChange('temperature', 'min', value)
                        }
                        minimumValue={0}
                        maximumValue={100}
                        units={['celsius', 'fahrenheit']}
                        selectedUnit={thresholds.temperature.unit}
                        onUnitChange={(unit) =>
                            handleValueChange('temperature', 'unit', unit)
                        }
                        unit="°"
                    />
                    <SettingsSlider
                        icon="thermometer"
                        label="Maximum Temperature"
                        value={thresholds.temperature.max}
                        onValueChange={(value) =>
                            handleValueChange('temperature', 'max', value)
                        }
                        minimumValue={0}
                        maximumValue={100}
                        unit="°"
                    />
                </View>

                <View className="mb-2">
                    <Text className="text-blue-400 text-lg mb-1">
                        Wind Speed
                    </Text>
                    <SettingsSlider
                        icon="weather-windy"
                        label="Maximum Wind Speed"
                        value={thresholds.windSpeed.max}
                        onValueChange={(value) =>
                            handleValueChange('windSpeed', 'max', value)
                        }
                        minimumValue={0}
                        maximumValue={100}
                        units={['kmh', 'mph']}
                        selectedUnit={thresholds.windSpeed.unit}
                        onUnitChange={(unit) =>
                            handleValueChange('windSpeed', 'unit', unit)
                        }
                    />
                    <SettingsSlider
                        icon="weather-windy-variant"
                        label="Maximum Wind Gust"
                        value={thresholds.windGust.max}
                        onValueChange={(value) =>
                            handleValueChange('windGust', 'max', value)
                        }
                        minimumValue={0}
                        maximumValue={100}
                        unit={thresholds.windSpeed.unit}
                    />
                </View>

                <View className="mb-2">
                    <Text className="text-blue-400 text-lg mb-1">
                        Visibility
                    </Text>
                    <SettingsSlider
                        icon="eye"
                        label="Minimum Visibility"
                        value={thresholds.visibility.min}
                        onValueChange={(value) =>
                            handleValueChange('visibility', 'min', value)
                        }
                        minimumValue={0}
                        maximumValue={50}
                        step={5}
                        units={['kilometers', 'miles']}
                        selectedUnit={thresholds.visibility.unit}
                        onUnitChange={(unit) =>
                            handleValueChange('visibility', 'unit', unit)
                        }
                    />
                </View>

                <View className="mb-2">
                    <Text className="text-blue-400 text-lg mb-1">Weather</Text>
                    <SettingsSlider
                        icon="weather-cloudy"
                        label="Maximum Cloud Cover"
                        value={thresholds.weather.maxCloudCover}
                        onValueChange={(value) =>
                            handleValueChange('weather', 'maxCloudCover', value)
                        }
                        minimumValue={0}
                        maximumValue={100}
                        unit="%"
                    />
                    <SettingsSlider
                        icon="weather-pouring"
                        label="Maximum Precipitation Probability"
                        value={thresholds.weather.maxPrecipitationProbability}
                        onValueChange={(value) =>
                            handleValueChange(
                                'weather',
                                'maxPrecipitationProbability',
                                value
                            )
                        }
                        minimumValue={0}
                        maximumValue={100}
                        unit="%"
                    />
                </View>

                <View className="flex-row justify-center mb-6 mt-4">
                    <Pressable
                        className="bg-red-600 px-6 py-4 rounded-lg flex-row items-center justify-center"
                        onPress={handleReset}
                    >
                        <MaterialCommunityIcons
                            name="refresh"
                            size={24}
                            color="white"
                        />
                        <Text className="text-white text-lg font-semibold ml-2">
                            Reset to Defaults
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

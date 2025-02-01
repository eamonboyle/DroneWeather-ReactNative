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

import { Collapsible } from '@/components/Collapsible'
import { ExternalLink } from '@/components/ExternalLink'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { WeatherThresholds } from '@/types/weatherConfig'
import { WeatherConfigService } from '@/services/weatherConfigService'
import { useWeatherConfig } from '@/contexts/WeatherConfigContext'

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
            <ScrollView className="flex-1 p-4">
                <View className="mb-6 mt-2">
                    <Text className="text-white text-lg font-semibold mb-2">
                        Wind Speed (km/h)
                    </Text>
                    <View className="flex-row items-center mb-2">
                        <Text className="text-white w-20">Safe:</Text>
                        <TextInput
                            className="flex-1 bg-gray-800 text-white p-2 rounded"
                            value={thresholds.windSpeed.safe.toString()}
                            onChangeText={(value) =>
                                updateThreshold('windSpeed', 'safe', value)
                            }
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-white text-lg font-semibold mb-2">
                        Wind Gusts (km/h)
                    </Text>
                    <View className="flex-row items-center mb-2">
                        <Text className="text-white w-20">Safe:</Text>
                        <TextInput
                            className="flex-1 bg-gray-800 text-white p-2 rounded"
                            value={thresholds.windGusts.safe.toString()}
                            onChangeText={(value) =>
                                updateThreshold('windGusts', 'safe', value)
                            }
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-white text-lg font-semibold mb-2">
                        Visibility (m)
                    </Text>
                    <View className="flex-row items-center mb-2">
                        <Text className="text-white w-20">Safe:</Text>
                        <TextInput
                            className="flex-1 bg-gray-800 text-white p-2 rounded"
                            value={thresholds.visibility.safe.toString()}
                            onChangeText={(value) =>
                                updateThreshold('visibility', 'safe', value)
                            }
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="flex-row items-center mb-2">
                        <Text className="text-white w-20">Warning:</Text>
                        <TextInput
                            className="flex-1 bg-gray-800 text-white p-2 rounded"
                            value={thresholds.visibility.warning.toString()}
                            onChangeText={(value) =>
                                updateThreshold('visibility', 'warning', value)
                            }
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-white text-lg font-semibold mb-2">
                        Humidity (%)
                    </Text>
                    <View className="flex-row items-center mb-2">
                        <Text className="text-white w-20">Safe:</Text>
                        <TextInput
                            className="flex-1 bg-gray-800 text-white p-2 rounded"
                            value={thresholds.humidity.safe.toString()}
                            onChangeText={(value) =>
                                updateThreshold('humidity', 'safe', value)
                            }
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="flex-row items-center mb-2">
                        <Text className="text-white w-20">Warning:</Text>
                        <TextInput
                            className="flex-1 bg-gray-800 text-white p-2 rounded"
                            value={thresholds.humidity.warning.toString()}
                            onChangeText={(value) =>
                                updateThreshold('humidity', 'warning', value)
                            }
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-white text-lg font-semibold mb-2">
                        Rain Chance (%)
                    </Text>
                    <View className="flex-row items-center mb-2">
                        <Text className="text-white w-20">Safe:</Text>
                        <TextInput
                            className="flex-1 bg-gray-800 text-white p-2 rounded"
                            value={thresholds.rainChance.safe.toString()}
                            onChangeText={(value) =>
                                updateThreshold('rainChance', 'safe', value)
                            }
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="flex-row items-center mb-2">
                        <Text className="text-white w-20">Warning:</Text>
                        <TextInput
                            className="flex-1 bg-gray-800 text-white p-2 rounded"
                            value={thresholds.rainChance.warning.toString()}
                            onChangeText={(value) =>
                                updateThreshold('rainChance', 'warning', value)
                            }
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <View className="flex-row justify-between mb-6">
                    <Pressable
                        className="bg-blue-600 px-6 py-3 rounded-lg flex-1 mr-2"
                        onPress={handleSave}
                    >
                        <Text className="text-white text-center font-semibold">
                            Save Changes
                        </Text>
                    </Pressable>
                    <Pressable
                        className="bg-red-600 px-6 py-3 rounded-lg flex-1 ml-2"
                        onPress={handleReset}
                    >
                        <Text className="text-white text-center font-semibold">
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

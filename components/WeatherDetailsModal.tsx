import React from 'react'
import { View, Text, Modal, Pressable, ScrollView } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { HourlyWeatherData } from '@/types/weather'
import { useWeatherConfig } from '@/contexts/WeatherConfigContext'
import { BlurView } from 'expo-blur'

interface WeatherDetailsModalProps {
    isVisible: boolean
    onClose: () => void
    hourData: HourlyWeatherData | null
}

interface DetailRowProps {
    icon: keyof typeof MaterialCommunityIcons.glyphMap
    label: string
    value: string
    color?: string
    isSafe?: boolean | 'warning'
}

function DetailRow({
    icon,
    label,
    value,
    color = '#60A5FA',
    isSafe,
}: DetailRowProps) {
    return (
        <View className="flex-row items-center justify-between py-3 border-b border-gray-700">
            <View className="flex-row items-center flex-1">
                <MaterialCommunityIcons name={icon} size={24} color={color} />
                <Text className="text-gray-300 ml-3 text-base">{label}</Text>
            </View>
            <View className="flex-row items-center">
                <Text className="text-white text-base font-medium">
                    {value}
                </Text>
                {isSafe !== undefined && (
                    <MaterialCommunityIcons
                        name={
                            isSafe === 'warning'
                                ? 'alert'
                                : isSafe
                                  ? 'check-circle'
                                  : 'alert-circle'
                        }
                        size={20}
                        color={
                            isSafe === 'warning'
                                ? '#fbbf24'
                                : isSafe
                                  ? '#22c55e'
                                  : '#ef4444'
                        }
                        style={{ marginLeft: 8 }}
                    />
                )}
            </View>
        </View>
    )
}

export function WeatherDetailsModal({
    isVisible,
    onClose,
    hourData,
}: WeatherDetailsModalProps) {
    const { thresholds } = useWeatherConfig()

    if (!hourData) return null

    // Convert and format temperature
    const temperature =
        thresholds.temperature.unit === 'fahrenheit'
            ? ((hourData.temperature2m * 9) / 5 + 32).toFixed(1) + '°F'
            : hourData.temperature2m.toFixed(1) + '°C'
    const isTempSafe =
        hourData.temperature2m >= thresholds.temperature.min &&
        hourData.temperature2m <= thresholds.temperature.max

    // Convert and format wind speeds
    const windSpeed =
        thresholds.windSpeed.unit === 'mph'
            ? (hourData.windSpeed10m * 0.621371).toFixed(1) + ' mph'
            : hourData.windSpeed10m.toFixed(1) + ' km/h'
    const windGust =
        thresholds.windSpeed.unit === 'mph'
            ? (hourData.windGusts10m * 0.621371).toFixed(1) + ' mph'
            : hourData.windGusts10m.toFixed(1) + ' km/h'
    const isWindSafe =
        hourData.windSpeed10m <= thresholds.windSpeed.max &&
        hourData.windGusts10m <= thresholds.windGust.max

    // Convert and format visibility
    const visibility =
        thresholds.visibility.unit === 'miles'
            ? (hourData.visibility / 1.60934).toFixed(1) + ' mi'
            : hourData.visibility.toFixed(1) + ' km'
    const isVisibilitySafe = hourData.visibility >= thresholds.visibility.min

    // Format precipitation and cloud cover
    const precipitation = `${hourData.precipitationProbability.toFixed(0)}%`
    const cloudCover = `${hourData.cloudCover.toFixed(0)}%`
    const isPrecipSafe =
        hourData.precipitationProbability <=
        thresholds.weather.maxPrecipitationProbability
    const isCloudSafe = hourData.cloudCover <= thresholds.weather.maxCloudCover

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <BlurView intensity={20} tint="dark" style={{ flex: 1 }}>
                <Pressable
                    className="flex-1 justify-center items-center p-4"
                    onPress={onClose}
                >
                    <Pressable
                        className="bg-gray-900 w-full max-w-md rounded-3xl overflow-hidden shadow-xl"
                        onPress={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <View className="px-6 py-4 bg-gray-800">
                            <Text className="text-white text-2xl font-bold">
                                {format(hourData.time, 'EEEE, MMMM d')}
                            </Text>
                            <Text className="text-gray-400 text-lg mt-1">
                                {format(hourData.time, 'h:mm a')}
                            </Text>
                        </View>

                        {/* Content */}
                        <ScrollView className="px-6 py-4">
                            <DetailRow
                                icon="thermometer"
                                label="Temperature"
                                value={temperature}
                                isSafe={isTempSafe}
                            />
                            <DetailRow
                                icon="weather-windy"
                                label="Wind Speed"
                                value={windSpeed}
                                isSafe={isWindSafe}
                            />
                            <DetailRow
                                icon="weather-windy-variant"
                                label="Wind Gusts"
                                value={windGust}
                                isSafe={isWindSafe}
                            />
                            <DetailRow
                                icon="eye"
                                label="Visibility"
                                value={visibility}
                                isSafe={isVisibilitySafe}
                            />
                            <DetailRow
                                icon="weather-pouring"
                                label="Precipitation"
                                value={precipitation}
                                isSafe={isPrecipSafe}
                            />
                            <DetailRow
                                icon="weather-cloudy"
                                label="Cloud Cover"
                                value={cloudCover}
                                isSafe={
                                    hourData.cloudCover <=
                                    thresholds.weather.maxCloudCover
                                        ? true
                                        : 'warning'
                                }
                            />
                        </ScrollView>

                        {/* Close Button */}
                        <View className="px-6 py-4 border-t border-gray-800">
                            <Pressable
                                onPress={onClose}
                                className="bg-blue-600 py-3 rounded-xl items-center"
                            >
                                <Text className="text-white text-base font-semibold">
                                    Close
                                </Text>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </BlurView>
        </Modal>
    )
}

import React from 'react'
import { View, Text, Modal, Pressable, ScrollView } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { HourlyWeatherData } from '@/types/weather'
import { useWeatherConfig } from '@/contexts/WeatherConfigContext'
import { BlurView } from 'expo-blur'
import { DroneFlyabilityService } from '@/services/droneFlyabilityService'

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
    subValues?: { label: string; value: string; isSafe?: boolean | 'warning' }[]
}

function DetailRow({
    icon,
    label,
    value,
    color = '#60A5FA',
    isSafe,
    subValues,
}: DetailRowProps) {
    return (
        <View className="py-3 border-b border-gray-700">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                    <MaterialCommunityIcons
                        name={icon}
                        size={24}
                        color={color}
                    />
                    <Text className="text-gray-300 ml-3 text-base">
                        {label}
                    </Text>
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
            {subValues && subValues.length > 0 && (
                <View className="ml-9 mt-2">
                    {subValues.map((subValue, index) => (
                        <View
                            key={index}
                            className="flex-row justify-between items-center py-1"
                        >
                            <Text className="text-gray-400 text-sm">
                                {subValue.label}
                            </Text>
                            <View className="flex-row items-center">
                                <Text className="text-gray-300 text-sm">
                                    {subValue.value}
                                </Text>
                                {subValue.isSafe !== undefined && (
                                    <MaterialCommunityIcons
                                        name={
                                            subValue.isSafe === 'warning'
                                                ? 'alert'
                                                : subValue.isSafe
                                                  ? 'check-circle'
                                                  : 'alert-circle'
                                        }
                                        size={16}
                                        color={
                                            subValue.isSafe === 'warning'
                                                ? '#fbbf24'
                                                : subValue.isSafe
                                                  ? '#22c55e'
                                                  : '#ef4444'
                                        }
                                        style={{ marginLeft: 8 }}
                                    />
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            )}
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

    const flyabilityData = DroneFlyabilityService.checkFlyingConditions(
        hourData,
        thresholds
    )

    // Convert and format temperature
    const temperature =
        thresholds.temperature.unit === 'fahrenheit'
            ? ((hourData.temperature2m * 9) / 5 + 32).toFixed(1) + '°F'
            : hourData.temperature2m.toFixed(1) + '°C'
    const isTempSafe =
        hourData.temperature2m >= thresholds.temperature.min &&
        hourData.temperature2m <= thresholds.temperature.max

    // Format wind speeds at different heights
    const formatWindSpeed = (speed: number) =>
        thresholds.windSpeed.unit === 'mph'
            ? (speed * 0.621371).toFixed(1) + ' mph'
            : speed.toFixed(1) + ' km/h'

    const windSpeedSubValues = flyabilityData.windSpeedDetails.map(
        (detail) => ({
            label: `At ${detail.height}`,
            value: formatWindSpeed(detail.speed),
            isSafe: detail.speed <= thresholds.windSpeed.max,
        })
    )

    const windSpeed = formatWindSpeed(hourData.windSpeed10m)
    const windGust = formatWindSpeed(hourData.windGusts10m)
    const isWindSafe =
        hourData.windSpeed10m <= thresholds.windSpeed.max &&
        hourData.windGusts10m <= thresholds.windGust.max

    // Convert and format visibility
    const visibilityInKm = hourData.visibility
    const minVisibilityKm =
        thresholds.visibility.unit === 'miles'
            ? thresholds.visibility.min * 1.60934 // Convert miles to km
            : thresholds.visibility.min
    const visibility =
        thresholds.visibility.unit === 'miles'
            ? (visibilityInKm / 1.60934).toFixed(1) + ' mi'
            : visibilityInKm.toFixed(1) + ' km'
    const visibilityThreshold =
        thresholds.visibility.unit === 'miles'
            ? `${thresholds.visibility.min} mi`
            : `${thresholds.visibility.min} km`
    const isVisibilitySafe = visibilityInKm >= minVisibilityKm

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
                            {/* {flyabilityData.reasons.length > 0 && (
                                <View className="mb-4 p-3 bg-red-900/30 rounded-lg">
                                    <Text className="text-red-400 font-semibold mb-1">
                                        Unsafe Conditions:
                                    </Text>
                                    {flyabilityData.reasons.map(
                                        (reason, index) => (
                                            <Text
                                                key={index}
                                                className="text-red-300"
                                            >
                                                • {reason}
                                            </Text>
                                        )
                                    )}
                                </View>
                            )} */}
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
                                subValues={windSpeedSubValues}
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
                                isSafe={isCloudSafe ? true : 'warning'}
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

import { View, Text, Pressable } from 'react-native'
import { WeatherData } from '@/types/weather'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useState, useEffect } from 'react'
import { WindDataPopup } from './WindDataPopup'
import { WeatherService } from '@/services/weatherService'
import { WeatherConfigService } from '@/services/weatherConfigService'
import { WeatherThresholds } from '@/types/weatherConfig'
import React from 'react'
import { useWeatherConfig } from '@/contexts/WeatherConfigContext'

interface WeatherGridProps {
    weatherData: WeatherData
    hourIndex: number
}

interface WindPopupState {
    isVisible: boolean
    data: { height: string; speed: number }[]
    title: string
    icon: keyof typeof MaterialCommunityIcons.glyphMap
    type: 'speed' | 'gusts'
}

export function WeatherGrid({ weatherData, hourIndex }: WeatherGridProps) {
    const [windPopupState, setWindPopupState] = useState<WindPopupState>({
        isVisible: false,
        data: [],
        title: '',
        icon: 'weather-windy',
        type: 'speed',
    })
    const { thresholds } = useWeatherConfig()
    const [flyabilityData, setFlyabilityData] = useState<{
        isSuitable: boolean
        reasons: string[]
        windSpeedDetails: { height: string; speed: number }[]
        windGustDetails: { height: string; speed: number }[]
    } | null>(null)

    useEffect(() => {
        loadFlyability()
    }, [weatherData, hourIndex, thresholds])

    const loadFlyability = async () => {
        try {
            const flyability = await WeatherService.isDroneFlyable(
                weatherData,
                hourIndex
            )
            setFlyabilityData(flyability)
        } catch (error) {
            console.error('Error loading flyability:', error)
        }
    }

    const handleWindPress = (type: 'speed' | 'gusts') => {
        if (!flyabilityData) return

        const config = {
            speed: {
                data: flyabilityData.windSpeedDetails,
                title: 'Wind Speed Details',
                icon: 'weather-windy' as const,
                type: 'speed' as const,
            },
            gusts: {
                data: flyabilityData.windGustDetails,
                title: 'Wind Gusts Details',
                icon: 'weather-windy-variant' as const,
                type: 'gusts' as const,
            },
        }

        setWindPopupState({
            isVisible: true,
            ...config[type],
        })
    }

    // Helper function to determine if a specific weather parameter is within acceptable range
    function isParameterSafe(
        parameter: string,
        value: number
    ): 'safe' | 'warning' | 'unsafe' {
        if (!thresholds) return 'unsafe'

        switch (parameter) {
            case 'Wind Speed':
                return value <= thresholds.windSpeed.max ? 'safe' : 'unsafe'
            case 'Temperature':
                return value >= thresholds.temperature.min &&
                    value <= thresholds.temperature.max
                    ? 'safe'
                    : 'unsafe'
            case 'Cloud Cover':
                return value <= thresholds.weather.maxCloudCover
                    ? 'safe'
                    : 'warning'
            case 'Visibility':
                return value >= thresholds.visibility.min * 1000
                    ? 'safe'
                    : 'unsafe'
            case 'Precipitation Probability':
                return value <= thresholds.weather.maxPrecipitationProbability
                    ? 'safe'
                    : 'unsafe'
            default:
                return 'safe'
        }
    }

    if (!thresholds || !flyabilityData) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-white text-lg">
                    Loading weather data...
                </Text>
            </View>
        )
    }

    const hourData = weatherData.hourlyData[hourIndex]

    const weatherItems = [
        {
            label: 'Temperature',
            value:
                thresholds.temperature.unit === 'fahrenheit'
                    ? `${((hourData.temperature2m * 9) / 5 + 32).toFixed(1)}°F`
                    : `${hourData.temperature2m.toFixed(1)}°C`,
            numericValue: hourData.temperature2m,
            icon: 'thermometer',
        },
        {
            label: 'Wind Speed',
            value:
                thresholds.windSpeed.unit === 'mph'
                    ? `${(hourData.windSpeed10m * 0.621371).toFixed(1)} mph`
                    : `${hourData.windSpeed10m.toFixed(1)} km/h`,
            numericValue: hourData.windSpeed10m,
            icon: 'weather-windy',
            onPress: () => handleWindPress('speed'),
        },
        {
            label: 'Wind Gusts',
            value:
                thresholds.windSpeed.unit === 'mph'
                    ? `${(hourData.windGusts10m * 0.621371).toFixed(1)} mph`
                    : `${hourData.windGusts10m.toFixed(1)} km/h`,
            numericValue: hourData.windGusts10m,
            icon: 'weather-windy-variant',
            onPress: () => handleWindPress('gusts'),
        },
        {
            label: 'Wind Direction',
            value: `${Number(hourData.windDirection10m).toFixed(2)}°`,
            numericValue: hourData.windDirection10m,
            icon: 'compass',
        },
        {
            label: 'Precipitation',
            value: `${Number(hourData.precipitation).toFixed(2)} mm`,
            numericValue: hourData.precipitation,
            icon: 'water',
        },
        {
            label: 'Cloud Cover',
            value: `${hourData.cloudCover.toFixed(0)}%`,
            numericValue: hourData.cloudCover,
            icon: 'weather-cloudy',
        },
        {
            label: 'Visibility',
            value:
                thresholds.visibility.unit === 'miles'
                    ? `${((hourData.visibility / 1000) * 0.621371).toFixed(1)} mi`
                    : `${(hourData.visibility / 1000).toFixed(1)} km`,
            numericValue: hourData.visibility,
            icon: 'eye',
        },
        {
            label: 'Humidity',
            value: `${Number(hourData.relativeHumidity2m).toFixed(0)}%`,
            numericValue: hourData.relativeHumidity2m,
            icon: 'water-percent',
        },
        {
            label: 'Rain Chance',
            value: `${hourData.precipitationProbability.toFixed(0)}%`,
            numericValue: hourData.precipitationProbability,
            icon: 'weather-pouring',
        },
    ]

    return (
        <>
            <View className="flex-row flex-wrap gap-2">
                {weatherItems.map((item) => {
                    const safety = isParameterSafe(
                        item.label,
                        item.numericValue
                    )
                    const bgColor =
                        safety === 'safe'
                            ? 'bg-green-800'
                            : safety === 'warning'
                              ? 'bg-yellow-700'
                              : 'bg-red-800'

                    const handlePress = () => {
                        if (item.label === 'Wind Speed') {
                            handleWindPress('speed')
                        } else if (item.label === 'Wind Gusts') {
                            handleWindPress('gusts')
                        }
                    }

                    return (
                        <Pressable
                            key={item.label}
                            onPress={handlePress}
                            className={`p-4 rounded-lg flex-1 min-w-[30%] ${bgColor}`}
                        >
                            <View className="items-center">
                                <MaterialCommunityIcons
                                    name={item.icon as any}
                                    size={24}
                                    color="white"
                                    style={{ opacity: 0.75 }}
                                />
                                <Text className="text-white text-sm opacity-75 mt-1">
                                    {item.label}
                                </Text>
                            </View>
                            <Text className="text-white text-lg font-semibold mt-2 text-center">
                                {item.value}
                            </Text>
                        </Pressable>
                    )
                })}
            </View>

            <WindDataPopup
                {...windPopupState}
                onClose={() =>
                    setWindPopupState((prev) => ({ ...prev, isVisible: false }))
                }
            />
        </>
    )
}

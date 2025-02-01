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
                return value <= thresholds.windSpeed.safe ? 'safe' : 'unsafe'
            case 'Wind Gusts':
                return value <= thresholds.windGusts.safe ? 'safe' : 'unsafe'
            case 'Precipitation':
                return value <= thresholds.precipitation.safe
                    ? 'safe'
                    : 'unsafe'
            case 'Cloud Cover':
                if (value <= thresholds.cloudCover.safe) return 'safe'
                else if (value <= thresholds.cloudCover.warning)
                    return 'warning'
                else return 'unsafe'
            case 'Visibility':
                if (value >= thresholds.visibility.safe) return 'safe'
                else if (value >= thresholds.visibility.warning)
                    return 'warning'
                else return 'unsafe'
            case 'Humidity':
                if (value <= thresholds.humidity.safe) return 'safe'
                else if (value <= thresholds.humidity.warning) return 'warning'
                else return 'unsafe'
            case 'Rain Chance':
                if (value <= thresholds.rainChance.safe) return 'safe'
                else if (value <= thresholds.rainChance.warning)
                    return 'warning'
                else return 'unsafe'
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
            value: `${Number(hourData.temperature2m).toFixed(2)}°C`,
            numericValue: hourData.temperature2m,
            icon: 'thermometer',
        },
        {
            label: 'Wind Speed',
            value: `${Number(hourData.windSpeed10m).toFixed(2)} km/h`,
            numericValue: hourData.windSpeed10m,
            icon: 'weather-windy',
        },
        {
            label: 'Wind Gusts',
            value: `${Number(hourData.windGusts10m).toFixed(2)} km/h`,
            numericValue: hourData.windGusts10m,
            icon: 'weather-windy-variant',
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
            value: `${Number(hourData.cloudCover).toFixed(2)}%`,
            numericValue: hourData.cloudCover,
            icon: 'cloud',
        },
        {
            label: 'Visibility',
            value: `${Number(hourData.visibility).toFixed(0)} m`,
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
            value: `${Number(hourData.precipitationProbability).toFixed(0)}%`,
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

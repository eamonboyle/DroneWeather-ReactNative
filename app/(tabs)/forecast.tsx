import { View, Text, ScrollView, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { format, isBefore, startOfHour } from 'date-fns'
import { useWeatherConfig } from '@/contexts/WeatherConfigContext'
import { useWeatherData } from '@/contexts/WeatherDataContext'
import { LocationBar } from '@/components/LocationBar'
import { useLocation } from '@/contexts/LocationContext'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useEffect, useState } from 'react'
import { DroneFlyabilityService } from '@/services/droneFlyabilityService'
import { HourlyWeatherData } from '@/types/weather'

interface TableCellProps {
    value?: string | number
    isSafe?: boolean | 'warning'
    icon?: keyof typeof MaterialCommunityIcons.glyphMap
    width?: number
}

function TableCell({ value, isSafe = true, icon, width = 60 }: TableCellProps) {
    const bgColor =
        isSafe === 'warning'
            ? 'bg-yellow-700'
            : isSafe
              ? 'bg-green-800'
              : 'bg-red-800'

    return (
        <View
            className={`${bgColor} p-2 justify-center items-center border-r border-b border-gray-700`}
            style={{ width }}
        >
            {icon ? (
                <MaterialCommunityIcons name={icon} size={20} color="white" />
            ) : (
                <Text className="text-white text-center">{value}</Text>
            )}
        </View>
    )
}

function TableHeader({
    label,
    icon,
    width = 60,
}: {
    label: string
    icon: keyof typeof MaterialCommunityIcons.glyphMap
    width?: number
}) {
    return (
        <View
            className="bg-gray-800 p-2 justify-center items-center border-r border-b border-gray-700"
            style={{ width }}
        >
            <MaterialCommunityIcons name={icon} size={20} color="#60A5FA" />
            <Text className="text-gray-300 text-xs text-center mt-1">
                {label}
            </Text>
        </View>
    )
}

export default function ForecastTable() {
    const router = useRouter()
    const { location, locationName } = useLocation()
    const { thresholds } = useWeatherConfig()
    const { weatherData } = useWeatherData()
    const { width: screenWidth } = useWindowDimensions()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate a short loading state to ensure smooth transition
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [])

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-900">
                <LocationBar locationName={locationName} />
                <LoadingSpinner text="Loading forecast data..." />
            </SafeAreaView>
        )
    }

    if (!weatherData) {
        return (
            <SafeAreaView className="flex-1 bg-gray-900">
                <LocationBar locationName={locationName} />
                <View className="flex-1 justify-center items-center">
                    <Text className="text-white text-lg">
                        No weather data available
                    </Text>
                </View>
            </SafeAreaView>
        )
    }

    const formatWindSpeed = (speed: number) => {
        return thresholds.windSpeed.unit === 'mph'
            ? (speed * 0.621371).toFixed(0)
            : speed.toFixed(0)
    }

    const formatTemperature = (temp: number) => {
        return thresholds.temperature.unit === 'fahrenheit'
            ? ((temp * 9) / 5 + 32).toFixed(0)
            : temp.toFixed(0)
    }

    const formatVisibility = (vis: number) => {
        return thresholds.visibility.unit === 'miles'
            ? (vis / 1.60934).toFixed(1)
            : vis.toFixed(1)
    }

    const isWindSafe = (speed: number, gust: number) => {
        const convertedSpeed =
            thresholds.windSpeed.unit === 'mph' ? speed * 0.621371 : speed
        const convertedGust =
            thresholds.windSpeed.unit === 'mph' ? gust * 0.621371 : gust
        return (
            convertedSpeed <= thresholds.windSpeed.max &&
            convertedGust <= thresholds.windGust.max
        )
    }

    const isTemperatureSafe = (temp: number) => {
        return (
            temp >= thresholds.temperature.min &&
            temp <= thresholds.temperature.max
        )
    }

    // Calculate cell widths based on screen width
    const timeWidth = 80
    const cellWidth = (screenWidth - timeWidth) / 5 // 5 parameters excluding time (temp, wind, gusts, cloud, rain)

    // Group hours by date, filtering out past hours
    const groupedByDay = weatherData.hourlyData.reduce(
        (acc, hour) => {
            // Skip hours before current time
            if (isBefore(hour.time, startOfHour(new Date()))) {
                return acc
            }

            const date = format(hour.time, 'yyyy-MM-dd')
            if (!acc[date]) {
                acc[date] = []
            }
            acc[date].push(hour)
            return acc
        },
        {} as Record<string, typeof weatherData.hourlyData>
    )

    // Filter out any empty days (where all hours were in the past)
    const filteredGroupedByDay = Object.entries(groupedByDay).reduce(
        (acc, [date, hours]) => {
            if (hours.length > 0) {
                acc[date] = hours
            }
            return acc
        },
        {} as Record<string, typeof weatherData.hourlyData>
    )

    const checkConditions = (hour: HourlyWeatherData) => {
        const conditions = DroneFlyabilityService.checkFlyingConditions(
            hour,
            thresholds
        )
        return conditions
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            <LocationBar locationName={locationName} />

            {/* Headers - Now outside ScrollView to stay fixed */}
            <View className="z-10">
                <View className="flex-row bg-gray-900">
                    <TableHeader
                        label="Time"
                        icon="clock-outline"
                        width={timeWidth}
                    />
                    <TableHeader
                        label="Temp"
                        icon="thermometer"
                        width={cellWidth}
                    />
                    <TableHeader
                        label="Wind"
                        icon="weather-windy"
                        width={cellWidth}
                    />
                    <TableHeader
                        label="Gusts"
                        icon="weather-windy-variant"
                        width={cellWidth}
                    />
                    <TableHeader
                        label="Cloud"
                        icon="weather-cloudy"
                        width={cellWidth}
                    />
                    <TableHeader
                        label="Rain"
                        icon="weather-pouring"
                        width={cellWidth}
                    />
                </View>
            </View>

            <ScrollView
                stickyHeaderIndices={Object.keys(filteredGroupedByDay).map(
                    (_, index) => index
                )}
            >
                {/* Data Rows Grouped by Day */}
                {Object.entries(filteredGroupedByDay).map(([date, hours]) => (
                    <View key={date}>
                        {/* Day Header - Will be sticky */}
                        <View
                            className="flex-row bg-gray-800/95 border-t border-b border-gray-700 py-2 px-4"
                            style={{ width: screenWidth }}
                        >
                            <Text className="text-white font-semibold">
                                {format(new Date(date), 'EEEE, MMMM d')}
                            </Text>
                        </View>

                        {/* Hours for this day */}
                        {hours.map((hour, index) => {
                            const conditions = checkConditions(hour)
                            return (
                                <View key={index} className="flex-row">
                                    <TableCell
                                        value={format(hour.time, 'HH:mm')}
                                        width={timeWidth}
                                    />
                                    <TableCell
                                        value={formatTemperature(
                                            hour.temperature2m
                                        )}
                                        isSafe={
                                            !conditions.reasons.some((r) =>
                                                r.includes('Temperature')
                                            )
                                        }
                                        width={cellWidth}
                                    />
                                    <TableCell
                                        value={formatWindSpeed(
                                            hour.windSpeed10m
                                        )}
                                        isSafe={
                                            !conditions.reasons.some((r) =>
                                                r.includes('Wind speed')
                                            )
                                        }
                                        width={cellWidth}
                                    />
                                    <TableCell
                                        value={formatWindSpeed(
                                            hour.windGusts10m
                                        )}
                                        isSafe={
                                            !conditions.reasons.some((r) =>
                                                r.includes('Wind speed')
                                            )
                                        }
                                        width={cellWidth}
                                    />
                                    <TableCell
                                        value={`${hour.cloudCover}%`}
                                        isSafe={
                                            hour.cloudCover >=
                                            thresholds.weather.maxCloudCover
                                                ? 'warning'
                                                : true
                                        }
                                        width={cellWidth}
                                    />
                                    <TableCell
                                        value={`${hour.precipitationProbability}%`}
                                        isSafe={
                                            !conditions.reasons.some((r) =>
                                                r.includes('precipitation')
                                            )
                                        }
                                        width={cellWidth}
                                    />
                                </View>
                            )
                        })}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

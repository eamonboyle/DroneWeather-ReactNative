import React, { useState } from 'react'
import { View, ScrollView, Text, Pressable } from 'react-native'
import { format, isBefore, startOfHour } from 'date-fns'
import { WeatherData, HourlyWeatherData } from '@/types/weather'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useWeatherConfig } from '@/contexts/WeatherConfigContext'
import { LinearGradient } from 'expo-linear-gradient'
import { WeatherDetailsModal } from './WeatherDetailsModal'
import { DroneFlyabilityService } from '@/services/droneFlyabilityService'

interface WeekViewProps {
    weatherData: WeatherData
    onHourSelect: (hour: number) => void
}

interface DayData {
    date: Date
    hours: HourlyWeatherData[]
}

export function WeekView({ weatherData, onHourSelect }: WeekViewProps) {
    const [selectedHour, setSelectedHour] = useState<HourlyWeatherData | null>(
        null
    )
    const [isModalVisible, setIsModalVisible] = useState(false)

    // Group hourly data by day, showing remaining hours for today and full days for future
    const groupedData = React.useMemo(() => {
        const days: DayData[] = []
        const currentHour = startOfHour(new Date())
        const currentDate = format(currentHour, 'yyyy-MM-dd')

        // Process all hours
        let currentDayHours: HourlyWeatherData[] = []
        let futureDays: DayData[] = []

        weatherData.hourlyData.forEach((hour) => {
            const hourDate = format(hour.time, 'yyyy-MM-dd')

            if (hourDate === currentDate) {
                // For current day, only include hours from now onwards
                if (!isBefore(hour.time, currentHour)) {
                    currentDayHours.push(hour)
                }
            } else if (hourDate > currentDate) {
                // For future days, group all hours by day
                const lastDay = futureDays[futureDays.length - 1]
                if (
                    lastDay &&
                    format(lastDay.date, 'yyyy-MM-dd') === hourDate
                ) {
                    lastDay.hours.push(hour)
                } else {
                    futureDays.push({
                        date: hour.time,
                        hours: [hour],
                    })
                }
            }
        })

        // Add current day if it has remaining hours
        if (currentDayHours.length > 0) {
            days.push({
                date: currentDayHours[0].time,
                hours: currentDayHours,
            })
        }

        // Add all future days
        days.push(...futureDays)

        return days
    }, [weatherData])

    const handleHourPress = (hour: HourlyWeatherData, index: number) => {
        setSelectedHour(hour)
        setIsModalVisible(true)
        onHourSelect(index)
    }

    return (
        <>
            <ScrollView className="flex-1 bg-gray-900">
                {groupedData.map((day, index) => (
                    <View key={index} className="mb-6">
                        <View className="px-4 py-3 bg-gray-800/50 border-b border-gray-700">
                            <Text className="text-xl font-bold text-white">
                                {format(day.date, 'EEEE')}
                            </Text>
                            <Text className="text-sm text-gray-400 mt-1">
                                {format(day.date, 'MMMM d, yyyy')}
                            </Text>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="py-3"
                        >
                            {day.hours.map((hour, hourIndex) => (
                                <HourCard
                                    key={hourIndex}
                                    hourData={hour}
                                    onPress={() =>
                                        handleHourPress(
                                            hour,
                                            index * 24 + hourIndex + 24
                                        )
                                    }
                                />
                            ))}
                        </ScrollView>
                    </View>
                ))}
            </ScrollView>

            <WeatherDetailsModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                hourData={selectedHour}
            />
        </>
    )
}

interface HourCardProps {
    hourData: HourlyWeatherData
    onPress: () => void
}

function HourCard({ hourData, onPress }: HourCardProps) {
    const { thresholds } = useWeatherConfig()

    // Check flyability conditions
    const conditions = DroneFlyabilityService.checkFlyingConditions(
        hourData,
        thresholds
    )

    // Format temperature based on unit preference
    const temperature =
        thresholds.temperature.unit === 'fahrenheit'
            ? ((hourData.temperature2m * 9) / 5 + 32).toFixed(0) + '°F'
            : hourData.temperature2m.toFixed(0) + '°C'

    // Format wind speed and gust based on unit preference
    const windSpeed =
        thresholds.windSpeed.unit === 'mph'
            ? hourData.windSpeed10m * 0.621371
            : hourData.windSpeed10m

    const windGust =
        thresholds.windSpeed.unit === 'mph'
            ? hourData.windGusts10m * 0.621371
            : hourData.windGusts10m

    const windSpeedDisplay =
        thresholds.windSpeed.unit === 'mph'
            ? `${windSpeed.toFixed(0)}/${windGust.toFixed(0)} mph`
            : `${windSpeed.toFixed(0)}/${windGust.toFixed(0)} km/h`

    // Check cloud cover separately (as warning only)
    const hasHighCloudCover =
        hourData.cloudCover > thresholds.weather.maxCloudCover

    // Determine gradient colors based only on conditions (ignoring cloud cover)
    const gradientColors: readonly [string, string] = conditions.isSuitable
        ? ['#065f46', '#047857'] // Green for safe
        : ['#991b1b', '#b91c1c'] // Red for unsafe

    return (
        <Pressable onPress={onPress} className="mx-2">
            <LinearGradient
                colors={gradientColors}
                className="p-4 rounded-2xl w-32 shadow-lg"
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View className="flex-row justify-between items-start">
                    <Text className="text-gray-200 text-base font-medium">
                        {format(hourData.time, 'HH:mm')}
                    </Text>
                    {(!conditions.isSuitable || hasHighCloudCover) && (
                        <MaterialCommunityIcons
                            name={
                                hasHighCloudCover && conditions.isSuitable
                                    ? 'cloud-alert'
                                    : 'information'
                            }
                            size={18}
                            color="white"
                            style={{ opacity: 0.7 }}
                        />
                    )}
                </View>

                <Text className="text-white text-3xl font-bold mb-3 mt-2">
                    {temperature}
                </Text>

                <View className="border-t border-white/20 pt-2">
                    <View className="flex-row items-center">
                        <MaterialCommunityIcons
                            name="weather-windy"
                            size={18}
                            color="white"
                            style={{ opacity: 0.9 }}
                        />
                        <Text className="text-white text-sm ml-2 opacity-90">
                            {windSpeedDisplay}
                        </Text>
                    </View>
                </View>
            </LinearGradient>
        </Pressable>
    )
}

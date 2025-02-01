import React from 'react'
import { View, ScrollView, Text, Pressable } from 'react-native'
import { format } from 'date-fns'
import { WeatherData, HourlyWeatherData } from '@/types/weather'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useWeatherConfig } from '@/contexts/WeatherConfigContext'

interface WeekViewProps {
    weatherData: WeatherData
    onHourSelect: (hour: number) => void
}

interface DayData {
    date: Date
    hours: HourlyWeatherData[]
}

export function WeekView({ weatherData, onHourSelect }: WeekViewProps) {
    // Group hourly data by day, starting from tomorrow (index 25)
    const groupedData = React.useMemo(() => {
        const days: DayData[] = []
        const startIndex = 24 // Start from hour 24 (tomorrow)

        for (let i = startIndex; i < weatherData.hourlyData.length; i += 24) {
            const dayHours = weatherData.hourlyData.slice(i, i + 24)
            if (dayHours.length > 0) {
                days.push({
                    date: dayHours[0].time,
                    hours: dayHours,
                })
            }
        }

        return days
    }, [weatherData])

    return (
        <ScrollView className="flex-1">
            {groupedData.map((day, index) => (
                <View key={index} className="mb-4">
                    <Text className="text-lg font-bold text-white px-4 py-2 bg-gray-800">
                        {format(day.date, 'EEEE, MMM d')}
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {day.hours.map((hour, hourIndex) => (
                            <HourCard
                                key={hourIndex}
                                hourData={hour}
                                onPress={() =>
                                    onHourSelect(index * 24 + hourIndex + 24)
                                }
                            />
                        ))}
                    </ScrollView>
                </View>
            ))}
        </ScrollView>
    )
}

interface HourCardProps {
    hourData: HourlyWeatherData
    onPress: () => void
}

function HourCard({ hourData, onPress }: HourCardProps) {
    const { thresholds } = useWeatherConfig()

    // Convert wind speed to the correct unit if needed
    const windSpeed =
        thresholds.windSpeed.unit === 'mph'
            ? hourData.windSpeed10m * 0.621371 // Convert to mph
            : hourData.windSpeed10m // Keep as km/h

    const isWindSafe = thresholds && windSpeed <= thresholds.windSpeed.max
    const bgColorClass = isWindSafe ? 'bg-green-800/50' : 'bg-red-800/50'

    // Format temperature based on unit preference
    const temperature =
        thresholds.temperature.unit === 'fahrenheit'
            ? ((hourData.temperature2m * 9) / 5 + 32).toFixed(0) + '°F'
            : hourData.temperature2m.toFixed(0) + '°C'

    // Format wind speed based on unit preference
    const windSpeedDisplay =
        thresholds.windSpeed.unit === 'mph'
            ? `${windSpeed.toFixed(0)} mph`
            : `${windSpeed.toFixed(0)} km/h`

    return (
        <Pressable
            onPress={onPress}
            className={`p-3 m-2 ${bgColorClass} rounded-lg w-24 items-center`}
        >
            <Text className="text-white text-sm">
                {format(hourData.time, 'HH:mm')}
            </Text>
            <Text className="text-white text-lg font-bold mt-1">
                {temperature}
            </Text>
            <View className="flex-row items-center mt-1">
                <MaterialCommunityIcons
                    name="weather-windy"
                    size={16}
                    color={isWindSafe ? '#22c55e' : '#ef4444'}
                />
                <Text className="text-white text-sm ml-1">
                    {windSpeedDisplay}
                </Text>
            </View>
        </Pressable>
    )
}

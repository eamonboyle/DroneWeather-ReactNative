import { View, Text } from 'react-native'
import { WeatherData } from '@/types/weather'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface WeatherGridProps {
    weatherData: WeatherData
    hourIndex: number
}

export function WeatherGrid({ weatherData, hourIndex }: WeatherGridProps) {
    // Helper function to determine if a specific weather parameter is within acceptable range
    function isParameterSafe(
        parameter: string,
        value: number
    ): 'safe' | 'warning' | 'unsafe' {
        switch (parameter) {
            case 'Wind Speed':
                return value <= 20 ? 'safe' : 'unsafe'
            case 'Wind Gusts':
                return value <= 30 ? 'safe' : 'unsafe'
            case 'Precipitation':
                return value === 0 ? 'safe' : 'unsafe'
            case 'Cloud Cover':
                if (value <= 70) return 'safe'
                else return 'warning'
            default:
                return 'safe'
        }
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
    ]

    return (
        <View className="flex-row flex-wrap gap-2">
            {weatherItems.map((item) => {
                const safety = isParameterSafe(item.label, item.numericValue)
                const bgColor =
                    safety === 'safe'
                        ? 'bg-green-800'
                        : safety === 'warning'
                          ? 'bg-yellow-700'
                          : 'bg-red-800'

                return (
                    <View
                        key={item.label}
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
                    </View>
                )
            })}
        </View>
    )
}

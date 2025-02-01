import { View, Text } from 'react-native'
import { WeatherData } from '@/types/weather'

interface WeatherGridProps {
    weatherData: WeatherData
}

export function WeatherGrid({ weatherData }: WeatherGridProps) {
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

    const weatherItems = [
        {
            label: 'Temperature',
            value: `${Number(weatherData.temperature).toFixed(2)}°C`,
            numericValue: weatherData.temperature,
        },
        {
            label: 'Wind Speed',
            value: `${Number(weatherData.windSpeed).toFixed(2)} km/h`,
            numericValue: weatherData.windSpeed,
        },
        {
            label: 'Wind Gusts',
            value: `${Number(weatherData.windGusts).toFixed(2)} km/h`,
            numericValue: weatherData.windGusts,
        },
        {
            label: 'Wind Direction',
            value: `${Number(weatherData.windDirection).toFixed(2)}°`,
            numericValue: weatherData.windDirection,
        },
        {
            label: 'Precipitation',
            value: `${Number(weatherData.precipitation).toFixed(2)} mm`,
            numericValue: weatherData.precipitation,
        },
        {
            label: 'Cloud Cover',
            value: `${Number(weatherData.cloudCover).toFixed(2)}%`,
            numericValue: weatherData.cloudCover,
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
                        <Text className="text-white text-sm opacity-75">
                            {item.label}
                        </Text>
                        <Text className="text-white text-lg font-semibold mt-1">
                            {item.value}
                        </Text>
                    </View>
                )
            })}
        </View>
    )
}

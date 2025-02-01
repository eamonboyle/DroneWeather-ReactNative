import { fetchWeatherApi } from 'openmeteo'
import { WeatherData } from '@/types/weather'

export class WeatherService {
    static async getCurrentWeather(
        latitude: number,
        longitude: number
    ): Promise<WeatherData> {
        const params = {
            latitude,
            longitude,
            current: [
                'temperature_2m',
                'relative_humidity_2m',
                'is_day',
                'precipitation',
                'rain',
                'showers',
                'snowfall',
                'weather_code',
                'cloud_cover',
                'pressure_msl',
                'surface_pressure',
                'wind_speed_10m',
                'wind_direction_10m',
                'wind_gusts_10m',
            ],
        }
        const url = 'https://api.open-meteo.com/v1/forecast'
        const responses = await fetchWeatherApi(url, params)

        // Process first location. Add a for-loop for multiple locations or weather models
        const response = responses[0]

        // Attributes for timezone and location
        const utcOffsetSeconds = response.utcOffsetSeconds()

        const current = response.current()!

        // Note: The order of weather variables in the URL query and the indices below need to match!
        const weatherData = {
            current: {
                time: new Date(
                    (Number(current.time()) + utcOffsetSeconds) * 1000
                ),
                temperature2m: current.variables(0)!.value(),
                relativeHumidity2m: current.variables(1)!.value(),
                isDay: current.variables(2)!.value(),
                precipitation: current.variables(3)!.value(),
                rain: current.variables(4)!.value(),
                showers: current.variables(5)!.value(),
                snowfall: current.variables(6)!.value(),
                weatherCode: current.variables(7)!.value(),
                cloudCover: current.variables(8)!.value(),
                pressureMsl: current.variables(9)!.value(),
                surfacePressure: current.variables(10)!.value(),
                windSpeed10m: current.variables(11)!.value(),
                windDirection10m: current.variables(12)!.value(),
                windGusts10m: current.variables(13)!.value(),
                latitude,
                longitude,
            },
        }

        return {
            temperature: weatherData.current.temperature2m,
            windSpeed: weatherData.current.windSpeed10m,
            windGusts: weatherData.current.windGusts10m,
            windDirection: weatherData.current.windDirection10m,
            precipitation: weatherData.current.precipitation,
            cloudCover: weatherData.current.cloudCover,
            visibility: 1,
        }
    }

    static isDroneFlyable(weather: WeatherData): {
        isSuitable: boolean
        reasons: string[]
    } {
        const reasons: string[] = []

        if (weather.windSpeed > 20) {
            reasons.push('Wind speed is too high')
        }

        if (weather.windGusts > 30) {
            reasons.push('Wind gusts are too strong')
        }

        if (weather.precipitation > 0) {
            reasons.push('Precipitation detected')
        }

        // if (weather.cloudCover > 90) {
        //     reasons.push('Heavy cloud cover')
        // }

        return {
            isSuitable: reasons.length === 0,
            reasons,
        }
    }
}

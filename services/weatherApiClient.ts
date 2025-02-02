import { fetchWeatherApi } from 'openmeteo'
import { HourlyWeatherData } from '@/types/weather'
import { range } from '@/utils/range'

interface WeatherApiParams {
    latitude: number
    longitude: number
    hourly: string[]
    wind_speed_unit: string
    timezone: string
}

const HOURLY_VARIABLES = [
    'temperature_2m',
    'relative_humidity_2m',
    'dew_point_2m',
    'apparent_temperature',
    'precipitation_probability',
    'precipitation',
    'rain',
    'showers',
    'snowfall',
    'snow_depth',
    'weather_code',
    'cloud_cover',
    'cloud_cover_low',
    'cloud_cover_mid',
    'cloud_cover_high',
    'visibility',
    'evapotranspiration',
    'et0_fao_evapotranspiration',
    'vapour_pressure_deficit',
    'wind_speed_10m',
    'wind_speed_80m',
    'wind_speed_120m',
    'wind_speed_180m',
    'wind_direction_10m',
    'wind_direction_80m',
    'wind_direction_120m',
    'wind_direction_180m',
    'wind_gusts_10m',
    'temperature_80m',
    'temperature_120m',
    'temperature_180m',
] as const

const API_URL = 'https://api.open-meteo.com/v1/forecast'

export class WeatherApiClient {
    static async fetchWeatherData(
        latitude: number,
        longitude: number
    ): Promise<HourlyWeatherData[]> {
        try {
            const params: WeatherApiParams = {
                latitude,
                longitude,
                hourly: [...HOURLY_VARIABLES],
                wind_speed_unit: 'mph',
                timezone: 'auto',
            }

            const responses = await fetchWeatherApi(API_URL, params)
            const response = responses[0]
            const utcOffsetSeconds = response.utcOffsetSeconds()
            const hourly = response.hourly()

            if (!hourly) {
                throw new Error('No hourly data available')
            }

            const times = range(
                Number(hourly.time()),
                Number(hourly.timeEnd()),
                hourly.interval()
            ).map((t) => new Date((t + utcOffsetSeconds) * 1000))

            const hourlyData: HourlyWeatherData[] = times.map(
                (time, index) => ({
                    time,
                    temperature2m:
                        hourly.variables(0)?.valuesArray()?.[index] ?? 0,
                    relativeHumidity2m:
                        hourly.variables(1)?.valuesArray()?.[index] ?? 0,
                    dewPoint2m:
                        hourly.variables(2)?.valuesArray()?.[index] ?? 0,
                    apparentTemperature:
                        hourly.variables(3)?.valuesArray()?.[index] ?? 0,
                    precipitationProbability:
                        hourly.variables(4)?.valuesArray()?.[index] ?? 0,
                    precipitation:
                        hourly.variables(5)?.valuesArray()?.[index] ?? 0,
                    rain: hourly.variables(6)?.valuesArray()?.[index] ?? 0,
                    showers: hourly.variables(7)?.valuesArray()?.[index] ?? 0,
                    snowfall: hourly.variables(8)?.valuesArray()?.[index] ?? 0,
                    snowDepth: hourly.variables(9)?.valuesArray()?.[index] ?? 0,
                    weatherCode:
                        hourly.variables(10)?.valuesArray()?.[index] ?? 0,
                    cloudCover:
                        hourly.variables(11)?.valuesArray()?.[index] ?? 0,
                    cloudCoverLow:
                        hourly.variables(12)?.valuesArray()?.[index] ?? 0,
                    cloudCoverMid:
                        hourly.variables(13)?.valuesArray()?.[index] ?? 0,
                    cloudCoverHigh:
                        hourly.variables(14)?.valuesArray()?.[index] ?? 0,
                    visibility:
                        hourly.variables(15)?.valuesArray()?.[index] ?? 0,
                    evapotranspiration:
                        hourly.variables(16)?.valuesArray()?.[index] ?? 0,
                    et0FaoEvapotranspiration:
                        hourly.variables(17)?.valuesArray()?.[index] ?? 0,
                    vapourPressureDeficit:
                        hourly.variables(18)?.valuesArray()?.[index] ?? 0,
                    windSpeed10m:
                        hourly.variables(19)?.valuesArray()?.[index] ?? 0,
                    windSpeed80m:
                        hourly.variables(20)?.valuesArray()?.[index] ?? 0,
                    windSpeed120m:
                        hourly.variables(21)?.valuesArray()?.[index] ?? 0,
                    windSpeed180m:
                        hourly.variables(22)?.valuesArray()?.[index] ?? 0,
                    windDirection10m:
                        hourly.variables(23)?.valuesArray()?.[index] ?? 0,
                    windDirection80m:
                        hourly.variables(24)?.valuesArray()?.[index] ?? 0,
                    windDirection120m:
                        hourly.variables(25)?.valuesArray()?.[index] ?? 0,
                    windDirection180m:
                        hourly.variables(26)?.valuesArray()?.[index] ?? 0,
                    windGusts10m:
                        hourly.variables(27)?.valuesArray()?.[index] ?? 0,
                    temperature80m:
                        hourly.variables(28)?.valuesArray()?.[index] ?? 0,
                    temperature120m:
                        hourly.variables(29)?.valuesArray()?.[index] ?? 0,
                    temperature180m:
                        hourly.variables(30)?.valuesArray()?.[index] ?? 0,
                })
            )

            return hourlyData
        } catch (error) {
            console.error('Error fetching weather data:', error)
            throw new Error('Failed to fetch weather data')
        }
    }
}

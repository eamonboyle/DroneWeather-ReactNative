import { fetchWeatherApi } from 'openmeteo'
import { HourlyWeatherData, WeatherData } from '@/types/weather'
import { range } from '@/utils/range'
import { WeatherConfigService } from '@/services/weatherConfigService'
import { WeatherCacheService } from '@/services/weatherCacheService'

function convertTemperature(
    value: number,
    fromUnit: 'celsius' | 'fahrenheit',
    toUnit: 'celsius' | 'fahrenheit'
): number {
    if (fromUnit === toUnit) return value
    if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
        return (value * 9) / 5 + 32
    }
    return ((value - 32) * 5) / 9
}

function convertSpeed(
    value: number,
    fromUnit: 'kmh' | 'mph',
    toUnit: 'kmh' | 'mph'
): number {
    if (fromUnit === toUnit) return value
    if (fromUnit === 'kmh' && toUnit === 'mph') {
        return value * 0.621371
    }
    return value * 1.60934
}

function convertDistance(
    value: number,
    fromUnit: 'kilometers' | 'miles',
    toUnit: 'kilometers' | 'miles'
): number {
    if (fromUnit === toUnit) return value
    if (fromUnit === 'kilometers' && toUnit === 'miles') {
        return value * 0.621371
    }
    return value * 1.60934
}

export class WeatherService {
    static async getCurrentWeather(
        latitude: number,
        longitude: number
    ): Promise<WeatherData> {
        // Try to get cached data first
        const cachedData = await WeatherCacheService.getCachedWeather(
            latitude,
            longitude
        )
        if (cachedData) {
            return cachedData
        }

        // If no cached data, fetch from API
        const params = {
            latitude: latitude,
            longitude: longitude,
            hourly: [
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
            ],
            wind_speed_unit: 'mph',
            timezone: 'auto',
        }
        const url = 'https://api.open-meteo.com/v1/forecast'
        const responses = await fetchWeatherApi(url, params)

        // Process first location. Add a for-loop for multiple locations or weather models
        const response = responses[0]

        // Attributes for timezone and location
        const utcOffsetSeconds = response.utcOffsetSeconds()

        const hourly = response.hourly()!
        const daily = response.daily()!

        // Note: The order of weather variables in the URL query and the indices below need to match!
        const weatherData = {
            hourly: {
                time: range(
                    Number(hourly.time()),
                    Number(hourly.timeEnd()),
                    hourly.interval()
                ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
                temperature2m: hourly.variables(0)!.valuesArray()!,
                relativeHumidity2m: hourly.variables(1)!.valuesArray()!,
                dewPoint2m: hourly.variables(2)!.valuesArray()!,
                apparentTemperature: hourly.variables(3)!.valuesArray()!,
                precipitationProbability: hourly.variables(4)!.valuesArray()!,
                precipitation: hourly.variables(5)!.valuesArray()!,
                rain: hourly.variables(6)!.valuesArray()!,
                showers: hourly.variables(7)!.valuesArray()!,
                snowfall: hourly.variables(8)!.valuesArray()!,
                snowDepth: hourly.variables(9)!.valuesArray()!,
                weatherCode: hourly.variables(10)!.valuesArray()!,
                cloudCover: hourly.variables(11)!.valuesArray()!,
                cloudCoverLow: hourly.variables(12)!.valuesArray()!,
                cloudCoverMid: hourly.variables(13)!.valuesArray()!,
                cloudCoverHigh: hourly.variables(14)!.valuesArray()!,
                visibility: hourly.variables(15)!.valuesArray()!,
                evapotranspiration: hourly.variables(16)!.valuesArray()!,
                et0FaoEvapotranspiration: hourly.variables(17)!.valuesArray()!,
                vapourPressureDeficit: hourly.variables(18)!.valuesArray()!,
                windSpeed10m: hourly.variables(19)!.valuesArray()!,
                windSpeed80m: hourly.variables(20)!.valuesArray()!,
                windSpeed120m: hourly.variables(21)!.valuesArray()!,
                windSpeed180m: hourly.variables(22)!.valuesArray()!,
                windDirection10m: hourly.variables(23)!.valuesArray()!,
                windDirection80m: hourly.variables(24)!.valuesArray()!,
                windDirection120m: hourly.variables(25)!.valuesArray()!,
                windDirection180m: hourly.variables(26)!.valuesArray()!,
                windGusts10m: hourly.variables(27)!.valuesArray()!,
                temperature80m: hourly.variables(28)!.valuesArray()!,
                temperature120m: hourly.variables(29)!.valuesArray()!,
                temperature180m: hourly.variables(30)!.valuesArray()!,
            },
        }

        const hourlyData: HourlyWeatherData[] = []

        for (let i = 0; i < weatherData.hourly.time.length; i++) {
            hourlyData.push({
                time: weatherData.hourly.time[i],
                temperature2m: weatherData.hourly.temperature2m[i],
                relativeHumidity2m: weatherData.hourly.relativeHumidity2m[i],
                dewPoint2m: weatherData.hourly.dewPoint2m[i],
                apparentTemperature: weatherData.hourly.apparentTemperature[i],
                precipitationProbability:
                    weatherData.hourly.precipitationProbability[i],
                precipitation: weatherData.hourly.precipitation[i],
                rain: weatherData.hourly.rain[i],
                showers: weatherData.hourly.showers[i],
                snowfall: weatherData.hourly.snowfall[i],
                snowDepth: weatherData.hourly.snowDepth[i],
                weatherCode: weatherData.hourly.weatherCode[i],
                cloudCover: weatherData.hourly.cloudCover[i],
                cloudCoverLow: weatherData.hourly.cloudCoverLow[i],
                cloudCoverMid: weatherData.hourly.cloudCoverMid[i],
                cloudCoverHigh: weatherData.hourly.cloudCoverHigh[i],
                visibility: weatherData.hourly.visibility[i],
                evapotranspiration: weatherData.hourly.evapotranspiration[i],
                et0FaoEvapotranspiration:
                    weatherData.hourly.et0FaoEvapotranspiration[i],
                vapourPressureDeficit:
                    weatherData.hourly.vapourPressureDeficit[i],
                windSpeed10m: weatherData.hourly.windSpeed10m[i],
                windSpeed80m: weatherData.hourly.windSpeed80m[i],
                windSpeed120m: weatherData.hourly.windSpeed120m[i],
                windSpeed180m: weatherData.hourly.windSpeed180m[i],
                windDirection10m: weatherData.hourly.windDirection10m[i],
                windDirection80m: weatherData.hourly.windDirection80m[i],
                windDirection120m: weatherData.hourly.windDirection120m[i],
                windDirection180m: weatherData.hourly.windDirection180m[i],
                windGusts10m: weatherData.hourly.windGusts10m[i],
                temperature80m: weatherData.hourly.temperature80m[i],
                temperature120m: weatherData.hourly.temperature120m[i],
                temperature180m: weatherData.hourly.temperature180m[i],
            })
        }

        const result = {
            hourlyData,
        }

        // Cache the fetched data
        await WeatherCacheService.cacheWeather(result, latitude, longitude)

        return result
    }

    static async isDroneFlyable(
        weather: WeatherData,
        hourIndex: number = 0
    ): Promise<{
        isSuitable: boolean
        reasons: string[]
        windSpeedDetails: { height: string; speed: number }[]
        windGustDetails: { height: string; speed: number }[]
    }> {
        const hourData = weather.hourlyData[hourIndex]
        const reasons: string[] = []

        try {
            const thresholds = await WeatherConfigService.getThresholds()
            if (!thresholds) {
                throw new Error('Weather thresholds not available')
            }

            // Temperature check
            const temp = hourData.temperature2m
            if (
                thresholds.temperature?.unit &&
                typeof thresholds.temperature?.min === 'number' &&
                typeof thresholds.temperature?.max === 'number'
            ) {
                const minTemp =
                    thresholds.temperature.unit === 'fahrenheit'
                        ? convertTemperature(
                              thresholds.temperature.min,
                              'fahrenheit',
                              'celsius'
                          )
                        : thresholds.temperature.min
                const maxTemp =
                    thresholds.temperature.unit === 'fahrenheit'
                        ? convertTemperature(
                              thresholds.temperature.max,
                              'fahrenheit',
                              'celsius'
                          )
                        : thresholds.temperature.max

                if (temp < minTemp || temp > maxTemp) {
                    reasons.push(
                        `Temperature (${temp}°C) is outside safe range (${minTemp}°C - ${maxTemp}°C)`
                    )
                }
            }

            // Wind speed check
            if (
                thresholds.windSpeed?.unit &&
                typeof thresholds.windSpeed?.max === 'number'
            ) {
                const maxWindSpeed =
                    thresholds.windSpeed.unit === 'mph'
                        ? convertSpeed(thresholds.windSpeed.max, 'mph', 'kmh')
                        : thresholds.windSpeed.max

                if (hourData.windSpeed10m > maxWindSpeed) {
                    reasons.push('Wind speed is too high')
                }
            }

            // Collect all wind speeds at different heights
            const windSpeedDetails = [
                { height: '10m', speed: hourData.windSpeed10m },
                { height: '80m', speed: hourData.windSpeed80m },
                { height: '120m', speed: hourData.windSpeed120m },
                { height: '180m', speed: hourData.windSpeed180m },
            ]

            // Currently we only have gusts at 10m, but structure allows for future additions
            const windGustDetails = [
                { height: '10m', speed: hourData.windGusts10m },
            ]

            // Visibility check
            if (
                thresholds.visibility?.unit &&
                typeof thresholds.visibility?.min === 'number'
            ) {
                const minVisibility =
                    thresholds.visibility.unit === 'miles'
                        ? convertDistance(
                              thresholds.visibility.min,
                              'miles',
                              'kilometers'
                          ) * 1000 // Convert to meters
                        : thresholds.visibility.min * 1000 // Convert km to meters

                if (hourData.visibility < minVisibility) {
                    reasons.push('Visibility is too low')
                }
            }

            // Weather conditions
            if (
                thresholds.weather &&
                typeof thresholds.weather.maxCloudCover === 'number' &&
                typeof thresholds.weather.maxPrecipitationProbability ===
                    'number'
            ) {
                if (hourData.cloudCover > thresholds.weather.maxCloudCover) {
                    reasons.push('Cloud cover is too high')
                }

                if (
                    hourData.precipitationProbability >
                    thresholds.weather.maxPrecipitationProbability
                ) {
                    reasons.push('High chance of precipitation')
                }
            }

            return {
                isSuitable: reasons.length === 0,
                reasons,
                windSpeedDetails,
                windGustDetails,
            }
        } catch (error) {
            console.error('Error checking drone flyability:', error)
            return {
                isSuitable: false,
                reasons: [
                    'Unable to determine flight conditions due to configuration error',
                ],
                windSpeedDetails: [],
                windGustDetails: [],
            }
        }
    }
}

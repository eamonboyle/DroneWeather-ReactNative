import { fetchWeatherApi } from 'openmeteo'
import { HourlyWeatherData, WeatherData } from '@/types/weather'
import { range } from '@/utils/range'

export class WeatherService {
    static async getCurrentWeather(
        latitude: number,
        longitude: number
    ): Promise<WeatherData> {
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

        console.log('Weather Data', weatherData)

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

        return {
            hourlyData,
            current: {
                temperature: hourlyData[0].temperature2m,
                windSpeed: hourlyData[0].windSpeed10m,
                windGusts: hourlyData[0].windGusts10m,
                windDirection: hourlyData[0].windDirection10m,
                precipitation: hourlyData[0].precipitation,
                cloudCover: hourlyData[0].cloudCover,
                visibility: hourlyData[0].visibility,
            },
        }
    }

    static isDroneFlyable(weather: WeatherData): {
        isSuitable: boolean
        reasons: string[]
    } {
        const reasons: string[] = []

        if (weather.current.windSpeed > 20) {
            reasons.push('Wind speed is too high')
        }

        if (weather.current.windGusts > 30) {
            reasons.push('Wind gusts are too strong')
        }

        if (weather.current.precipitation > 0) {
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

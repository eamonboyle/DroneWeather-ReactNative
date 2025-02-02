import { HourlyWeatherData } from '@/types/weather'
import { WeatherThresholds } from '@/types/weatherConfig'
import {
    convertTemperature,
    convertSpeed,
    convertDistance,
} from '@/utils/unitConversion'

export interface DroneFlightConditions {
    isSuitable: boolean
    reasons: string[]
    windSpeedDetails: { height: string; speed: number }[]
    windGustDetails: { height: string; speed: number }[]
}

interface ConditionCheck {
    isSafe: boolean
    reason?: string
}

function checkTemperature(
    temperature: number,
    thresholds: WeatherThresholds
): ConditionCheck {
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

    const isSafe = temperature >= minTemp && temperature <= maxTemp
    return {
        isSafe,
        reason: isSafe
            ? undefined
            : `Temperature (${temperature}°C) is outside safe range (${minTemp}°C - ${maxTemp}°C)`,
    }
}

function checkWindSpeed(
    windSpeed: number,
    thresholds: WeatherThresholds
): ConditionCheck {
    const maxWindSpeed =
        thresholds.windSpeed.unit === 'mph'
            ? convertSpeed(thresholds.windSpeed.max, 'mph', 'kmh')
            : thresholds.windSpeed.max

    const isSafe = windSpeed <= maxWindSpeed
    return {
        isSafe,
        reason: isSafe ? undefined : 'Wind speed is too high',
    }
}

function checkVisibility(
    visibility: number,
    thresholds: WeatherThresholds
): ConditionCheck {
    const minVisibility =
        thresholds.visibility.unit === 'miles'
            ? convertDistance(
                  thresholds.visibility.min,
                  'miles',
                  'kilometers'
              ) * 1000
            : thresholds.visibility.min * 1000

    const isSafe = visibility >= minVisibility
    return {
        isSafe,
        reason: isSafe ? undefined : 'Visibility is too low',
    }
}

function checkWeatherConditions(
    cloudCover: number,
    precipitationProbability: number,
    thresholds: WeatherThresholds
): ConditionCheck[] {
    const checks: ConditionCheck[] = []

    if (cloudCover > thresholds.weather.maxCloudCover) {
        checks.push({ isSafe: false, reason: 'Cloud cover is too high' })
    }

    if (
        precipitationProbability >
        thresholds.weather.maxPrecipitationProbability
    ) {
        checks.push({ isSafe: false, reason: 'High chance of precipitation' })
    }

    return checks
}

function getWindDetails(hourData: HourlyWeatherData): {
    speeds: { height: string; speed: number }[]
    gusts: { height: string; speed: number }[]
} {
    return {
        speeds: [
            { height: '10m', speed: hourData.windSpeed10m },
            { height: '80m', speed: hourData.windSpeed80m },
            { height: '120m', speed: hourData.windSpeed120m },
            { height: '180m', speed: hourData.windSpeed180m },
        ],
        gusts: [{ height: '10m', speed: hourData.windGusts10m }],
    }
}

export class DroneFlyabilityService {
    static checkFlyingConditions(
        hourData: HourlyWeatherData,
        thresholds: WeatherThresholds
    ): DroneFlightConditions {
        const reasons: string[] = []
        const { speeds: windSpeedDetails, gusts: windGustDetails } =
            getWindDetails(hourData)

        // Perform all condition checks
        const checks: ConditionCheck[] = [
            checkTemperature(hourData.temperature2m, thresholds),
            checkWindSpeed(hourData.windSpeed10m, thresholds),
            checkVisibility(hourData.visibility, thresholds),
            ...checkWeatherConditions(
                hourData.cloudCover,
                hourData.precipitationProbability,
                thresholds
            ),
        ]

        // Collect all failure reasons
        checks.forEach((check) => {
            if (!check.isSafe && check.reason) {
                reasons.push(check.reason)
            }
        })

        return {
            isSuitable: reasons.length === 0,
            reasons,
            windSpeedDetails,
            windGustDetails,
        }
    }
}

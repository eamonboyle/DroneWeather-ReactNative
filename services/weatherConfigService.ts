import AsyncStorage from '@react-native-async-storage/async-storage'
import {
    WeatherThresholds,
    DEFAULT_WEATHER_THRESHOLDS,
} from '@/types/weatherConfig'

// Types
interface StorageOperationResult<T> {
    success: boolean
    data?: T
    error?: string
}

// Constants
const CONFIG = {
    STORAGE_KEY: 'weather_thresholds',
} as const

// Helper Functions
function mergeWithDefaults(
    partial: Partial<WeatherThresholds['temperature']>,
    defaults: WeatherThresholds['temperature']
) {
    return {
        unit: partial?.unit ?? defaults.unit,
        min: partial?.min ?? defaults.min,
        max: partial?.max ?? defaults.max,
    }
}

function mergeWindSpeedWithDefaults(
    partial: Partial<WeatherThresholds['windSpeed']>,
    defaults: WeatherThresholds['windSpeed']
) {
    return {
        unit: partial?.unit ?? defaults.unit,
        max: partial?.max ?? defaults.max,
    }
}

function mergeVisibilityWithDefaults(
    partial: Partial<WeatherThresholds['visibility']>,
    defaults: WeatherThresholds['visibility']
) {
    return {
        unit: partial?.unit ?? defaults.unit,
        min: partial?.min ?? defaults.min,
    }
}

function mergeWeatherWithDefaults(
    partial: Partial<WeatherThresholds['weather']>,
    defaults: WeatherThresholds['weather']
) {
    return {
        maxCloudCover: partial?.maxCloudCover ?? defaults.maxCloudCover,
        maxPrecipitationProbability:
            partial?.maxPrecipitationProbability ??
            defaults.maxPrecipitationProbability,
    }
}

function ensureCompleteThresholds(
    partialThresholds: Partial<WeatherThresholds>
): WeatherThresholds {
    return {
        temperature: mergeWithDefaults(
            partialThresholds.temperature ?? {},
            DEFAULT_WEATHER_THRESHOLDS.temperature
        ),
        windSpeed: mergeWindSpeedWithDefaults(
            partialThresholds.windSpeed ?? {},
            DEFAULT_WEATHER_THRESHOLDS.windSpeed
        ),
        windGust: {
            max:
                partialThresholds.windGust?.max ??
                DEFAULT_WEATHER_THRESHOLDS.windGust.max,
        },
        visibility: mergeVisibilityWithDefaults(
            partialThresholds.visibility ?? {},
            DEFAULT_WEATHER_THRESHOLDS.visibility
        ),
        weather: mergeWeatherWithDefaults(
            partialThresholds.weather ?? {},
            DEFAULT_WEATHER_THRESHOLDS.weather
        ),
    }
}

async function readFromStorage(): Promise<
    StorageOperationResult<WeatherThresholds>
> {
    try {
        const stored = await AsyncStorage.getItem(CONFIG.STORAGE_KEY)
        if (!stored) {
            return { success: false }
        }
        return {
            success: true,
            data: ensureCompleteThresholds(JSON.parse(stored)),
        }
    } catch (error) {
        console.error('Error reading weather thresholds:', error)
        return {
            success: false,
            error: 'Failed to read weather thresholds',
        }
    }
}

async function writeToStorage(
    thresholds: WeatherThresholds
): Promise<StorageOperationResult<void>> {
    try {
        await AsyncStorage.setItem(
            CONFIG.STORAGE_KEY,
            JSON.stringify(thresholds)
        )
        return { success: true }
    } catch (error) {
        console.error('Error saving weather thresholds:', error)
        return {
            success: false,
            error: 'Failed to save weather thresholds',
        }
    }
}

// Main Service
export class WeatherConfigService {
    static async getThresholds(): Promise<WeatherThresholds> {
        const { success, data, error } = await readFromStorage()

        if (success && data) {
            return data
        }

        if (error) {
            console.error(error)
        }

        // If no stored thresholds or error, save and return defaults
        await this.saveThresholds(DEFAULT_WEATHER_THRESHOLDS)
        return DEFAULT_WEATHER_THRESHOLDS
    }

    static async saveThresholds(thresholds: WeatherThresholds): Promise<void> {
        const completeThresholds = ensureCompleteThresholds(thresholds)
        const { success, error } = await writeToStorage(completeThresholds)

        if (!success && error) {
            throw new Error(error)
        }
    }

    static async resetToDefaults(): Promise<WeatherThresholds> {
        await this.saveThresholds(DEFAULT_WEATHER_THRESHOLDS)
        return DEFAULT_WEATHER_THRESHOLDS
    }

    static async validateThresholds(
        thresholds: Partial<WeatherThresholds>
    ): Promise<{
        isValid: boolean
        errors: string[]
    }> {
        const errors: string[] = []

        // Validate temperature
        if (thresholds.temperature) {
            if (thresholds.temperature.min > thresholds.temperature.max) {
                errors.push(
                    'Minimum temperature cannot be greater than maximum temperature'
                )
            }
        }

        // Validate wind speed
        if (thresholds.windSpeed?.max && thresholds.windSpeed.max < 0) {
            errors.push('Wind speed maximum must be positive')
        }

        // Validate visibility
        if (thresholds.visibility?.min && thresholds.visibility.min < 0) {
            errors.push('Visibility minimum must be positive')
        }

        // Validate weather conditions
        if (thresholds.weather) {
            if (
                thresholds.weather.maxCloudCover < 0 ||
                thresholds.weather.maxCloudCover > 100
            ) {
                errors.push('Cloud cover must be between 0 and 100')
            }
            if (
                thresholds.weather.maxPrecipitationProbability < 0 ||
                thresholds.weather.maxPrecipitationProbability > 100
            ) {
                errors.push(
                    'Precipitation probability must be between 0 and 100'
                )
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
        }
    }
}

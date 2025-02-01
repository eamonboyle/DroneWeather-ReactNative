import AsyncStorage from '@react-native-async-storage/async-storage'
import {
    WeatherThresholds,
    DEFAULT_WEATHER_THRESHOLDS,
} from '@/types/weatherConfig'

const STORAGE_KEY = 'weather_thresholds'

function ensureCompleteThresholds(
    partialThresholds: Partial<WeatherThresholds>
): WeatherThresholds {
    return {
        temperature: {
            unit:
                partialThresholds.temperature?.unit ??
                DEFAULT_WEATHER_THRESHOLDS.temperature.unit,
            min:
                partialThresholds.temperature?.min ??
                DEFAULT_WEATHER_THRESHOLDS.temperature.min,
            max:
                partialThresholds.temperature?.max ??
                DEFAULT_WEATHER_THRESHOLDS.temperature.max,
        },
        windSpeed: {
            unit:
                partialThresholds.windSpeed?.unit ??
                DEFAULT_WEATHER_THRESHOLDS.windSpeed.unit,
            max:
                partialThresholds.windSpeed?.max ??
                DEFAULT_WEATHER_THRESHOLDS.windSpeed.max,
        },
        visibility: {
            unit:
                partialThresholds.visibility?.unit ??
                DEFAULT_WEATHER_THRESHOLDS.visibility.unit,
            min:
                partialThresholds.visibility?.min ??
                DEFAULT_WEATHER_THRESHOLDS.visibility.min,
        },
        weather: {
            maxCloudCover:
                partialThresholds.weather?.maxCloudCover ??
                DEFAULT_WEATHER_THRESHOLDS.weather.maxCloudCover,
            maxPrecipitationProbability:
                partialThresholds.weather?.maxPrecipitationProbability ??
                DEFAULT_WEATHER_THRESHOLDS.weather.maxPrecipitationProbability,
        },
    }
}

export class WeatherConfigService {
    static async getThresholds(): Promise<WeatherThresholds> {
        try {
            const storedThresholds = await AsyncStorage.getItem(STORAGE_KEY)
            if (storedThresholds) {
                const parsedThresholds = JSON.parse(storedThresholds)
                return ensureCompleteThresholds(parsedThresholds)
            }
            // If no stored thresholds, save and return defaults
            await this.saveThresholds(DEFAULT_WEATHER_THRESHOLDS)
            return DEFAULT_WEATHER_THRESHOLDS
        } catch (error) {
            console.error('Error loading weather thresholds:', error)
            return DEFAULT_WEATHER_THRESHOLDS
        }
    }

    static async saveThresholds(thresholds: WeatherThresholds): Promise<void> {
        try {
            const completeThresholds = ensureCompleteThresholds(thresholds)
            await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(completeThresholds)
            )
        } catch (error) {
            console.error('Error saving weather thresholds:', error)
            throw error
        }
    }

    static async resetToDefaults(): Promise<WeatherThresholds> {
        await this.saveThresholds(DEFAULT_WEATHER_THRESHOLDS)
        return DEFAULT_WEATHER_THRESHOLDS
    }
}

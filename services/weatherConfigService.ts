import AsyncStorage from '@react-native-async-storage/async-storage'
import {
    WeatherThresholds,
    DEFAULT_WEATHER_THRESHOLDS,
} from '@/types/weatherConfig'

const STORAGE_KEY = 'weather_thresholds'

export class WeatherConfigService {
    static async getThresholds(): Promise<WeatherThresholds> {
        try {
            const storedThresholds = await AsyncStorage.getItem(STORAGE_KEY)
            if (storedThresholds) {
                return JSON.parse(storedThresholds)
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
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(thresholds))
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

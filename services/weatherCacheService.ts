import AsyncStorage from '@react-native-async-storage/async-storage'
import { WeatherData } from '@/types/weather'

interface CachedWeatherData {
    data: WeatherData
    timestamp: number
    latitude: number
    longitude: number
}

const CACHE_KEY = 'weather_data_cache'
const CACHE_DURATION = 60 * 60 * 1000 // 60 minutes in milliseconds

export class WeatherCacheService {
    static async getCachedWeather(
        latitude: number,
        longitude: number
    ): Promise<WeatherData | null> {
        try {
            const cachedData = await AsyncStorage.getItem(CACHE_KEY)
            if (!cachedData) return null

            const parsed: CachedWeatherData = JSON.parse(cachedData)
            const now = Date.now()

            // Check if cache is expired or location is different
            if (
                now - parsed.timestamp > CACHE_DURATION ||
                Math.abs(parsed.latitude - latitude) > 0.001 ||
                Math.abs(parsed.longitude - longitude) > 0.001
            ) {
                return null
            }

            return parsed.data
        } catch (error) {
            console.error('Error reading weather cache:', error)
            return null
        }
    }

    static async cacheWeather(
        data: WeatherData,
        latitude: number,
        longitude: number
    ): Promise<void> {
        try {
            const cacheData: CachedWeatherData = {
                data,
                timestamp: Date.now(),
                latitude,
                longitude,
            }
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
        } catch (error) {
            console.error('Error caching weather data:', error)
        }
    }

    static async clearCache(): Promise<void> {
        try {
            await AsyncStorage.removeItem(CACHE_KEY)
        } catch (error) {
            console.error('Error clearing weather cache:', error)
        }
    }
}

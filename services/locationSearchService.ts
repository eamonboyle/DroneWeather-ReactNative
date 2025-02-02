import opencage from 'opencage-api-client'
import Constants from 'expo-constants'

const OPENCAGE_API_KEY = Constants.expoConfig?.extra?.opencageApiKey

export interface LocationSearchResult {
    formatted: string
    latitude: number
    longitude: number
    city?: string
    country?: string
}

interface OpenCageResult {
    formatted: string
    geometry: {
        lat: number
        lng: number
    }
    components: {
        city?: string
        town?: string
        village?: string
        country?: string
    }
}

export async function searchLocations(
    query: string
): Promise<LocationSearchResult[]> {
    try {
        if (!OPENCAGE_API_KEY) {
            throw new Error('OpenCage API key is not configured')
        }

        const response = await opencage.geocode({
            q: query,
            key: OPENCAGE_API_KEY,
            limit: 5,
        })

        return response.results.map((result: OpenCageResult) => ({
            formatted: result.formatted,
            latitude: result.geometry.lat,
            longitude: result.geometry.lng,
            city:
                result.components.city ||
                result.components.town ||
                result.components.village,
            country: result.components.country,
        }))
    } catch (error) {
        console.error('Error searching locations:', error)
        throw error
    }
}

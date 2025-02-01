export interface WeatherThresholds {
    temperature: {
        unit: 'celsius' | 'fahrenheit'
        min: number
        max: number
    }
    windSpeed: {
        unit: 'kmh' | 'mph'
        max: number
    }
    windGust: {
        max: number
    }
    visibility: {
        unit: 'kilometers' | 'miles'
        min: number
    }
    weather: {
        maxCloudCover: number // percentage
        maxPrecipitationProbability: number // percentage
    }
}

export const DEFAULT_WEATHER_THRESHOLDS: WeatherThresholds = {
    temperature: {
        unit: 'celsius',
        min: 0,
        max: 40,
    },
    windSpeed: {
        unit: 'kmh',
        max: 20,
    },
    windGust: {
        max: 40,
    },
    visibility: {
        unit: 'kilometers',
        min: 5,
    },
    weather: {
        maxCloudCover: 100,
        maxPrecipitationProbability: 50,
    },
}

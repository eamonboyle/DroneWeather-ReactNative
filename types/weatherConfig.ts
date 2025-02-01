export interface WeatherThresholds {
    windSpeed: {
        safe: number; // Maximum wind speed considered safe (in km/h)
    };
    windGusts: {
        safe: number; // Maximum wind gusts considered safe (in km/h)
    };
    precipitation: {
        safe: number; // Maximum precipitation considered safe (in mm)
    };
    cloudCover: {
        safe: number; // Maximum cloud cover considered safe (in %)
        warning: number; // Cloud cover threshold for warning (in %)
    };
    visibility: {
        safe: number; // Minimum visibility considered safe (in m)
        warning: number; // Visibility threshold for warning (in m)
    };
    humidity: {
        safe: number; // Maximum humidity considered safe (in %)
        warning: number; // Humidity threshold for warning (in %)
    };
    rainChance: {
        safe: number; // Maximum rain chance considered safe (in %)
        warning: number; // Rain chance threshold for warning (in %)
    };
}

export const DEFAULT_WEATHER_THRESHOLDS: WeatherThresholds = {
    windSpeed: {
        safe: 20,
    },
    windGusts: {
        safe: 30,
    },
    precipitation: {
        safe: 0,
    },
    cloudCover: {
        safe: 70,
        warning: 70,
    },
    visibility: {
        safe: 5000,
        warning: 3000,
    },
    humidity: {
        safe: 80,
        warning: 90,
    },
    rainChance: {
        safe: 20,
        warning: 40,
    },
}; 
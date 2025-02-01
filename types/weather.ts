export interface WeatherData {
    temperature: number
    windSpeed: number
    windGusts: number
    windDirection: number
    precipitation: number
    cloudCover: number
    visibility: number
}

export interface DroneFlightConditions {
    isSuitable: boolean
    reasons: string[]
}

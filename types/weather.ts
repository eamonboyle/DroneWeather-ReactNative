export interface HourlyWeatherData {
    time: Date
    temperature2m: number
    relativeHumidity2m: number
    dewPoint2m: number
    apparentTemperature: number
    precipitationProbability: number
    precipitation: number
    rain: number
    showers: number
    snowfall: number
    snowDepth: number
    weatherCode: number
    cloudCover: number
    cloudCoverLow: number
    cloudCoverMid: number
    cloudCoverHigh: number
    visibility: number
    evapotranspiration: number
    et0FaoEvapotranspiration: number
    vapourPressureDeficit: number
    windSpeed10m: number
    windSpeed80m: number
    windSpeed120m: number
    windSpeed180m: number
    windDirection10m: number
    windDirection80m: number
    windDirection120m: number
    windDirection180m: number
    windGusts10m: number
    temperature80m: number
    temperature120m: number
    temperature180m: number
}

export interface WeatherData {
    hourlyData: HourlyWeatherData[]
    current: {
        temperature: number
        windSpeed: number
        windGusts: number
        windDirection: number
        precipitation: number
        cloudCover: number
        visibility: number
    }
}

export interface DroneFlightConditions {
    isSuitable: boolean
    reasons: string[]
}

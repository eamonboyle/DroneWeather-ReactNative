export type TemperatureUnit = 'celsius' | 'fahrenheit'
export type SpeedUnit = 'kmh' | 'mph'
export type DistanceUnit = 'kilometers' | 'miles'

export const convertTemperature = (
    value: number,
    fromUnit: TemperatureUnit,
    toUnit: TemperatureUnit
): number => {
    if (fromUnit === toUnit) return value
    if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
        return (value * 9) / 5 + 32
    }
    return ((value - 32) * 5) / 9
}

export const convertSpeed = (
    value: number,
    fromUnit: SpeedUnit,
    toUnit: SpeedUnit
): number => {
    if (fromUnit === toUnit) return value
    if (fromUnit === 'kmh' && toUnit === 'mph') {
        return value * 0.621371
    }
    return value * 1.60934
}

export const convertDistance = (
    value: number,
    fromUnit: DistanceUnit,
    toUnit: DistanceUnit
): number => {
    if (fromUnit === toUnit) return value
    if (fromUnit === 'kilometers' && toUnit === 'miles') {
        return value * 0.621371
    }
    return value * 1.60934
} 
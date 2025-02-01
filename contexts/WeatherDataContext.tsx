import React, { createContext, useContext, useState } from 'react'
import { WeatherData } from '@/types/weather'

interface WeatherDataContextType {
    weatherData: WeatherData | null
    setWeatherData: (data: WeatherData | null) => void
}

const WeatherDataContext = createContext<WeatherDataContextType | undefined>(undefined)

export function WeatherDataProvider({ children }: { children: React.ReactNode }) {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null)

    return (
        <WeatherDataContext.Provider value={{ weatherData, setWeatherData }}>
            {children}
        </WeatherDataContext.Provider>
    )
}

export function useWeatherData() {
    const context = useContext(WeatherDataContext)
    if (context === undefined) {
        throw new Error('useWeatherData must be used within a WeatherDataProvider')
    }
    return context
} 
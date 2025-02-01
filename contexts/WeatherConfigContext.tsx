import React, { createContext, useContext, useState, useEffect } from 'react'
import { WeatherThresholds } from '@/types/weatherConfig'
import { WeatherConfigService } from '@/services/weatherConfigService'

interface WeatherConfigContextType {
    thresholds: WeatherThresholds | null;
    refreshThresholds: () => Promise<void>;
}

const WeatherConfigContext = createContext<WeatherConfigContextType | undefined>(undefined)

export function WeatherConfigProvider({ children }: { children: React.ReactNode }) {
    const [thresholds, setThresholds] = useState<WeatherThresholds | null>(null)

    const refreshThresholds = async () => {
        try {
            const loadedThresholds = await WeatherConfigService.getThresholds()
            setThresholds(loadedThresholds)
        } catch (error) {
            console.error('Error refreshing thresholds:', error)
        }
    }

    useEffect(() => {
        refreshThresholds()
    }, [])

    return (
        <WeatherConfigContext.Provider value={{ thresholds, refreshThresholds }}>
            {children}
        </WeatherConfigContext.Provider>
    )
}

export function useWeatherConfig() {
    const context = useContext(WeatherConfigContext)
    if (context === undefined) {
        throw new Error('useWeatherConfig must be used within a WeatherConfigProvider')
    }
    return context
} 
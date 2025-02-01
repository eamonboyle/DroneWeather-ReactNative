import React, { createContext, useContext, useState, useEffect } from 'react'
import {
    WeatherThresholds,
    DEFAULT_WEATHER_THRESHOLDS,
} from '@/types/weatherConfig'
import { WeatherConfigService } from '@/services/weatherConfigService'

interface WeatherConfigContextType {
    thresholds: WeatherThresholds
    refreshThresholds: () => Promise<void>
    updateThresholds: (newThresholds: WeatherThresholds) => Promise<void>
}

const WeatherConfigContext = createContext<
    WeatherConfigContextType | undefined
>(undefined)

export function WeatherConfigProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [thresholds, setThresholds] = useState<WeatherThresholds>(
        DEFAULT_WEATHER_THRESHOLDS
    )

    const refreshThresholds = async () => {
        try {
            const loadedThresholds = await WeatherConfigService.getThresholds()
            setThresholds(loadedThresholds)
        } catch (error) {
            console.error('Error refreshing thresholds:', error)
            setThresholds(DEFAULT_WEATHER_THRESHOLDS)
        }
    }

    const updateThresholds = async (newThresholds: WeatherThresholds) => {
        try {
            await WeatherConfigService.saveThresholds(newThresholds)
            setThresholds(newThresholds)
        } catch (error) {
            console.error('Error updating thresholds:', error)
            setThresholds(DEFAULT_WEATHER_THRESHOLDS)
        }
    }

    useEffect(() => {
        refreshThresholds()
    }, [])

    return (
        <WeatherConfigContext.Provider
            value={{ thresholds, refreshThresholds, updateThresholds }}
        >
            {children}
        </WeatherConfigContext.Provider>
    )
}

export function useWeatherConfig() {
    const context = useContext(WeatherConfigContext)
    if (context === undefined) {
        throw new Error(
            'useWeatherConfig must be used within a WeatherConfigProvider'
        )
    }
    return context
}

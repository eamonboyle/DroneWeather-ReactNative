import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { useColorScheme } from '@/hooks/useColorScheme'
import { WeatherConfigProvider } from '@/contexts/WeatherConfigContext'
import { WeatherDataProvider } from '@/contexts/WeatherDataContext'
import { LocationProvider } from '@/contexts/LocationContext'

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: '(tabs)',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const colorScheme = useColorScheme()
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    })

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error
    }, [error])

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync()
        }
    }, [loaded])

    if (!loaded) {
        return null
    }

    return (
        <LocationProvider>
            <RootLayoutNav />
        </LocationProvider>
    )
}

function RootLayoutNav() {
    const colorScheme = useColorScheme()

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider
                value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
            >
                <WeatherConfigProvider>
                    <WeatherDataProvider>
                        <Stack>
                            <Stack.Screen
                                name="(tabs)"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="modal"
                                options={{ presentation: 'modal' }}
                            />
                            <Stack.Screen
                                name="forecast-table"
                                options={{
                                    headerShown: false,
                                    presentation: 'modal',
                                }}
                            />
                        </Stack>
                        <StatusBar style="auto" />
                    </WeatherDataProvider>
                </WeatherConfigProvider>
            </ThemeProvider>
        </GestureHandlerRootView>
    )
}

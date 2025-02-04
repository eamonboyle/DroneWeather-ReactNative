import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Platform } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import '@/styles/globals.css'

export default function TabLayout() {
    return (
        <SafeAreaProvider>
            <StatusBar style="auto" />
            <Tabs
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#000',
                    },
                    headerTintColor: '#fff',
                    tabBarStyle: {
                        backgroundColor: '#1f2937',
                        borderTopWidth: 0,
                    },
                    tabBarActiveTintColor: '#60A5FA',
                    tabBarInactiveTintColor: '#9CA3AF',
                    tabBarHideOnKeyboard: Platform.OS === 'android',
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home" size={size} color={color} />
                        ),
                        headerShown: false,
                    }}
                />
                <Tabs.Screen
                    name="map"
                    options={{
                        title: 'Map',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons
                                name="map"
                                size={size}
                                color={color}
                            />
                        ),
                        headerShown: false,
                    }}
                />
                <Tabs.Screen
                    name="week"
                    options={{
                        title: 'Week',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons
                                name="calendar"
                                size={size}
                                color={color}
                            />
                        ),
                        headerShown: false,
                    }}
                />
                <Tabs.Screen
                    name="forecast"
                    options={{
                        title: 'Forecast',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons
                                name="calendar-month"
                                size={size}
                                color={color}
                            />
                        ),
                        headerShown: false,
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: 'Settings',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons
                                name="cog"
                                size={size}
                                color={color}
                            />
                        ),
                        headerShown: false,
                    }}
                />
            </Tabs>
        </SafeAreaProvider>
    )
}

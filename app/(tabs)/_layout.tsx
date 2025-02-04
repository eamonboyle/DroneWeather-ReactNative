import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
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
                        backgroundColor: '#000',
                    },
                    tabBarActiveTintColor: '#fff',
                    tabBarInactiveTintColor: '#666',
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
                            <Ionicons name="cloud" size={size} color={color} />
                        ),
                        headerShown: false,
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: 'Settings',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons
                                name="settings"
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

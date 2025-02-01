import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
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
                    name="tools"
                    options={{
                        title: 'Tools',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="build" size={size} color={color} />
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

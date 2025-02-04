import {
    View,
    Text,
    Alert,
    ActivityIndicator,
    Animated,
    KeyboardAvoidingView,
    Platform,
} from 'react-native'
import { useEffect, useState, useRef } from 'react'
import * as Location from 'expo-location'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DroneFlightConditions } from '@/types/weather'
import { WeatherService } from '@/services/weatherService'
import { LocationBar } from '@/components/LocationBar'
import { WeatherGrid } from '@/components/WeatherGrid'
import React from 'react'
import { HourSelector } from '@/components/HourSelector'
import { useLocation } from '@/contexts/LocationContext'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useWeatherData } from '@/contexts/WeatherDataContext'

export default function Home() {
    const router = useRouter()
    const { location, locationName, errorMsg, updateLocation } = useLocation()
    const { weatherData, setWeatherData } = useWeatherData()
    const [isLoading, setIsLoading] = useState(true)
    const [selectedHour, setSelectedHour] = useState(0)
    const [flightConditions, setFlightConditions] =
        useState<DroneFlightConditions>({
            isSuitable: false,
            reasons: [],
        })

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current
    const translateY = useRef(new Animated.Value(20)).current
    const scaleAnim = useRef(new Animated.Value(0.9)).current

    useEffect(() => {
        if (!isLoading) {
            // Animate content in
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start()
        }
    }, [isLoading])

    useEffect(() => {
        if (location) {
            handleLocationUpdate(location)
        }
    }, [location])

    const handleLocationUpdate = async (location: Location.LocationObject) => {
        setIsLoading(true)
        try {
            const weather = await WeatherService.getCurrentWeather(
                location.coords.latitude,
                location.coords.longitude
            )
            setWeatherData(weather)
            const conditions = await WeatherService.isDroneFlyable(
                weather,
                selectedHour
            )
            setFlightConditions(conditions)
        } catch (error) {
            console.error('Error fetching weather data:', error)
            Alert.alert(
                'Error',
                'Failed to fetch weather data. Please try again.'
            )
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (weatherData) {
            const updateFlightConditions = async () => {
                const conditions = await WeatherService.isDroneFlyable(
                    weatherData,
                    selectedHour
                )
                setFlightConditions(conditions)
            }
            updateFlightConditions()
        }
    }, [weatherData, selectedHour])

    useEffect(() => {
        ;(async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                console.error('Permission to access location was denied')
                return
            }

            const location = await Location.getCurrentPositionAsync({})
            await updateLocation()
        })()
    }, [])

    const renderLoadingState = () => (
        <Animated.View
            style={[
                {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                },
            ]}
        >
            <ActivityIndicator size="large" color="#60A5FA" />
            <Text className="text-white text-lg mt-4 font-medium">
                Loading weather data...
            </Text>
        </Animated.View>
    )

    const renderFlightStatus = () => {
        const gradientColors = flightConditions.isSuitable
            ? (['#065f46', '#047857'] as const)
            : (['#991b1b', '#b91c1c'] as const)

        return (
            <Animated.View
                style={[
                    {
                        marginBottom: 24,
                        opacity: fadeAnim,
                        transform: [{ translateY }],
                    },
                ]}
            >
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="p-6 rounded-3xl shadow-lg"
                >
                    <View className="flex-row items-center justify-center mb-2">
                        <MaterialCommunityIcons
                            name={
                                flightConditions.isSuitable
                                    ? 'airplane'
                                    : 'airplane-off'
                            }
                            size={32}
                            color="white"
                            style={{ opacity: 0.9 }}
                        />
                        <Text className="text-2xl text-white font-bold ml-3">
                            {flightConditions.isSuitable
                                ? 'Safe to Fly'
                                : 'Not Safe to Fly'}
                        </Text>
                    </View>
                    {flightConditions.reasons.length > 0 && (
                        <View className="bg-black/20 rounded-xl p-4 mt-2">
                            {flightConditions.reasons.map((reason, index) => (
                                <View
                                    key={index}
                                    className="flex-row items-center mb-2 last:mb-0"
                                >
                                    <MaterialCommunityIcons
                                        name="alert-circle"
                                        size={18}
                                        color="#FCA5A5"
                                    />
                                    <Text className="text-white ml-2 flex-1">
                                        {reason}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </LinearGradient>
            </Animated.View>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            <Animated.View style={[{ flex: 1, opacity: fadeAnim }]}>
                <LocationBar locationName={locationName} />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    <View className="flex-1 px-4 pt-4">
                        {isLoading ? (
                            renderLoadingState()
                        ) : (
                            <>
                                {renderFlightStatus()}

                                {weatherData && (
                                    <Animated.View
                                        style={[
                                            {
                                                opacity: fadeAnim,
                                                transform: [{ translateY }],
                                            },
                                        ]}
                                    >
                                        <WeatherGrid
                                            weatherData={weatherData}
                                            hourIndex={selectedHour}
                                        />
                                    </Animated.View>
                                )}
                            </>
                        )}
                    </View>
                </KeyboardAvoidingView>

                <View className="absolute bottom-0 left-0 right-0 bg-gray-900">
                    <Animated.View
                        style={[
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY }],
                            },
                        ]}
                    >
                        <HourSelector
                            selectedHour={selectedHour}
                            onHourChange={setSelectedHour}
                            className="mb-4"
                        />
                    </Animated.View>
                </View>
            </Animated.View>
        </SafeAreaView>
    )
}

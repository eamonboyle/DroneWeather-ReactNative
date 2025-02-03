import React, { useRef, useEffect, useMemo } from 'react'
import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface HourSelectorProps {
    selectedHour: number
    onHourChange: (hour: number) => void
    className?: string
}

export function HourSelector({
    selectedHour,
    onHourChange,
    className = '',
}: HourSelectorProps) {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const windowWidth = Dimensions.get('window').width
    const itemWidth = 60 // Width of each hour item
    const scrollViewRef = useRef<ScrollView>(null)

    const getCurrentHour = () => new Date().getHours()
    const currentHour = useMemo(() => getCurrentHour(), []) // Memoize current hour

    // Set initial hour when component mounts
    useEffect(() => {
        if (selectedHour === 0) {
            onHourChange(currentHour)
        }
    }, [])

    // Handle scrolling whenever selectedHour changes
    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
                x: selectedHour * itemWidth,
                animated: true,
            })
        }
    }, [selectedHour])

    const handleCurrentHourPress = () => {
        onHourChange(currentHour)
    }

    const getHourStyle = (hour: number) => {
        if (selectedHour === hour) {
            return {
                container: 'bg-blue-500',
                text: 'text-white',
            }
        }
        if (hour === currentHour) {
            return {
                container: 'bg-blue-500/20 border-2 border-blue-500',
                text: 'text-blue-400',
            }
        }
        return {
            container: 'bg-transparent',
            text: 'text-gray-400',
        }
    }

    return (
        <View className={`px-4 ${className}`}>
            <View className="flex-row items-center justify-between mb-2">
                <LinearGradient
                    colors={['#FFD700', '#32CD32', '#FF4500']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="h-1 flex-1 rounded-full"
                />
                <Pressable
                    onPress={handleCurrentHourPress}
                    className="ml-4 flex-row items-center bg-blue-500 px-3 py-1.5 rounded-full"
                >
                    <MaterialCommunityIcons
                        name="clock"
                        size={16}
                        color="white"
                    />
                    <Text className="text-white text-sm font-medium ml-1">
                        Now
                    </Text>
                </Pressable>
            </View>
            <View className="relative">
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: windowWidth / 2 - itemWidth / 2,
                    }}
                >
                    {hours.map((hour) => {
                        const style = getHourStyle(hour)
                        return (
                            <Pressable
                                key={hour}
                                onPress={() => onHourChange(hour)}
                                className={`w-[60px] items-center py-2`}
                            >
                                <View
                                    className={`w-8 h-8 rounded-full items-center justify-center ${style.container}`}
                                >
                                    <Text className={`text-lg ${style.text}`}>
                                        {hour}H
                                    </Text>
                                </View>
                            </Pressable>
                        )
                    })}
                </ScrollView>
            </View>
        </View>
    )
}

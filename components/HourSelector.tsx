import React, { useRef, useEffect } from 'react'
import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

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

    useEffect(() => {
        // Get current hour if selectedHour is not provided
        const currentHour = selectedHour ?? new Date().getHours()

        // Add a small delay to ensure the ScrollView is rendered
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({
                x: currentHour * itemWidth,
                animated: true,
            })
        }, 100)
    }, [])

    return (
        <View className={`px-4 ${className}`}>
            <LinearGradient
                colors={['#FFD700', '#32CD32', '#FF4500']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="h-1 mb-2 rounded-full"
            />
            <View className="relative">
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: windowWidth / 2 - itemWidth / 2,
                    }}
                >
                    {hours.map((hour) => (
                        <Pressable
                            key={hour}
                            onPress={() => onHourChange(hour)}
                            className={`w-[60px] items-center py-2`}
                        >
                            <View
                                className={`w-8 h-8 rounded-full items-center justify-center
                                    ${selectedHour === hour ? 'bg-blue-500' : 'bg-transparent'}`}
                            >
                                <Text
                                    className={`text-lg
                                        ${selectedHour === hour ? 'text-white' : 'text-gray-400'}`}
                                >
                                    {hour}H
                                </Text>
                            </View>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
        </View>
    )
}

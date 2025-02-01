import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'

interface SettingsSliderProps {
    icon: keyof typeof MaterialCommunityIcons.glyphMap
    label: string
    value: number
    onValueChange: (value: number) => void
    minimumValue: number
    maximumValue: number
    step?: number
    unit?: string
    units?: string[]
    onUnitChange?: (unit: string) => void
    selectedUnit?: string
    sublabel?: string
}

export function SettingsSlider({
    icon,
    label,
    value,
    onValueChange,
    minimumValue,
    maximumValue,
    step = 1,
    unit,
    units,
    onUnitChange,
    selectedUnit,
    sublabel,
}: SettingsSliderProps) {
    return (
        <View className="bg-gray-800/50 rounded-lg p-4 mb-3">
            <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center flex-1">
                    <MaterialCommunityIcons
                        name={icon}
                        size={24}
                        color="#60A5FA"
                        className="opacity-75"
                    />
                    <Text className="text-white text-lg font-semibold ml-2">
                        {label}
                    </Text>
                </View>
                {units && onUnitChange && (
                    <View className="flex-row">
                        {units.map((u) => (
                            <Pressable
                                key={u}
                                onPress={() => onUnitChange(u)}
                                className={`px-3 py-1 rounded-lg ml-2 ${
                                    selectedUnit === u
                                        ? 'bg-blue-600'
                                        : 'bg-gray-700'
                                }`}
                            >
                                <Text
                                    className={`${
                                        selectedUnit === u
                                            ? 'text-white'
                                            : 'text-gray-400'
                                    }`}
                                >
                                    {u}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                )}
            </View>
            {sublabel && (
                <Text className="text-gray-400 text-sm mb-2 ml-9">
                    {sublabel}
                </Text>
            )}
            <View className="flex-row items-center ml-9">
                <View className="flex-1">
                    <Slider
                        minimumValue={minimumValue}
                        maximumValue={maximumValue}
                        step={step}
                        value={value}
                        onValueChange={onValueChange}
                        minimumTrackTintColor="#60A5FA"
                        maximumTrackTintColor="#374151"
                        thumbTintColor="#60A5FA"
                    />
                </View>
                <View className="ml-3 min-w-[60px]">
                    <Text className="text-white text-lg text-right">
                        {value}
                        {unit && ` ${unit}`}
                    </Text>
                </View>
            </View>
        </View>
    )
}

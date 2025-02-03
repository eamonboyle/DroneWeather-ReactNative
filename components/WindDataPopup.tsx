import { View, Text, Modal, Pressable } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useWeatherConfig } from '@/contexts/WeatherConfigContext'

interface WindDataPoint {
    height: string
    speed: number
}

interface WindDataPopupProps {
    isVisible: boolean
    onClose: () => void
    data: WindDataPoint[]
    title: string
    icon: keyof typeof MaterialCommunityIcons.glyphMap
    unit?: string
    type: 'speed' | 'gusts'
}

export function WindDataPopup({
    isVisible,
    onClose,
    data,
    title,
    icon,
    unit = 'km/h',
    type,
}: WindDataPopupProps) {
    const { thresholds } = useWeatherConfig()

    const isSpeedSafe = (speed: number) => {
        if (!thresholds) return false
        return type === 'speed'
            ? speed <= thresholds.windSpeed.max
            : speed <= thresholds.windGust.max
    }

    const formatSpeed = (speed: number) => {
        if (thresholds.windSpeed.unit === 'mph') {
            return `${(speed * 0.621371).toFixed(1)} mph`
        }
        return `${speed.toFixed(1)} km/h`
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <Pressable
                className="flex-1 justify-center items-center bg-black/50"
                onPress={onClose}
            >
                <Pressable
                    className="bg-gray-800 p-6 rounded-xl w-[80%] max-w-[400px]"
                    onPress={(e) => e.stopPropagation()}
                >
                    <View className="flex-row items-center mb-4">
                        <MaterialCommunityIcons
                            name={icon}
                            size={24}
                            color="white"
                            style={{ opacity: 0.75 }}
                        />
                        <Text className="text-white text-xl font-semibold ml-2">
                            {title}
                        </Text>
                    </View>

                    {data.map((item, index) => (
                        <View
                            key={item.height}
                            className={`flex-row justify-between items-center py-3 
                                ${index !== data.length - 1 ? 'border-b border-gray-700' : ''}`}
                        >
                            <Text className="text-white text-lg">
                                At {item.height}
                            </Text>
                            <View className="flex-row items-center">
                                <Text className="text-white text-lg font-semibold mr-2">
                                    {formatSpeed(item.speed)}
                                </Text>
                                <MaterialCommunityIcons
                                    name={
                                        isSpeedSafe(item.speed)
                                            ? 'check-circle'
                                            : 'close-circle'
                                    }
                                    size={24}
                                    color={
                                        isSpeedSafe(item.speed)
                                            ? '#22c55e'
                                            : '#ef4444'
                                    }
                                />
                            </View>
                        </View>
                    ))}

                    <Pressable
                        onPress={onClose}
                        className="mt-6 bg-gray-700 py-3 rounded-lg"
                    >
                        <Text className="text-white text-center font-semibold">
                            Close
                        </Text>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    )
}

import { View, Text, Modal, Pressable } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

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
}

export function WindDataPopup({
    isVisible,
    onClose,
    data,
    title,
    icon,
    unit = 'km/h',
}: WindDataPopupProps) {
    const isSpeedSafe = (speed: number) => speed <= 35

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
                                    {item.speed.toFixed(1)} {unit}
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

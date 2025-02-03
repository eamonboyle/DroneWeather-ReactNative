import React, { useEffect, useRef } from 'react'
import {
    View,
    Modal,
    Pressable,
    Text,
    TouchableWithoutFeedback,
    Animated,
    Dimensions,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { LocationSearch } from './LocationSearch'

interface LocationSearchModalProps {
    visible: boolean
    onClose: () => void
}

export function LocationSearchModal({
    visible,
    onClose,
}: LocationSearchModalProps) {
    const slideAnim = useRef(new Animated.Value(0)).current
    const { height } = Dimensions.get('window')

    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 1,
                useNativeDriver: true,
                damping: 20,
                mass: 1,
                stiffness: 100,
            }).start()
        } else {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                damping: 20,
                mass: 1,
                stiffness: 100,
            }).start()
        }
    }, [visible])

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 bg-black/50 justify-end">
                    <TouchableWithoutFeedback>
                        <Animated.View
                            className="bg-gray-900 rounded-t-3xl overflow-hidden"
                            style={{
                                transform: [
                                    {
                                        translateY: slideAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [height, 0],
                                        }),
                                    },
                                ],
                                height: height * 0.75,
                            }}
                        >
                            <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-800">
                                <View className="absolute w-full items-center top-2">
                                    <View className="w-12 h-1.5 rounded-full bg-gray-600" />
                                </View>
                                <Text className="text-white text-xl font-semibold mt-3">
                                    Search Location
                                </Text>
                                <Pressable
                                    onPress={onClose}
                                    className="w-10 h-10 items-center justify-center mt-3"
                                >
                                    <MaterialCommunityIcons
                                        name="close"
                                        size={24}
                                        color="#60A5FA"
                                    />
                                </Pressable>
                            </View>
                            <LocationSearch onLocationSelected={onClose} />
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

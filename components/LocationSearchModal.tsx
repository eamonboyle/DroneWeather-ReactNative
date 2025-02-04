import React from 'react'
import {
    View,
    Modal,
    Pressable,
    Text,
    TouchableWithoutFeedback,
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
    const { height } = Dimensions.get('window')

    const handleBackdropPress = (event: any) => {
        if (event.target === event.currentTarget) {
            onClose()
        }
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={handleBackdropPress}>
                <View className="flex-1 bg-black/50 justify-center items-center px-4">
                    <View
                        className="bg-gray-900 w-full rounded-2xl overflow-hidden"
                        style={{ maxHeight: height * 0.8 }}
                    >
                        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-800">
                            <Text className="text-white text-xl font-semibold">
                                Search Location
                            </Text>
                            <Pressable
                                onPress={onClose}
                                className="w-10 h-10 items-center justify-center"
                            >
                                <MaterialCommunityIcons
                                    name="close"
                                    size={24}
                                    color="#60A5FA"
                                />
                            </Pressable>
                        </View>
                        <View className="p-4">
                            <LocationSearch onLocationSelected={onClose} />
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

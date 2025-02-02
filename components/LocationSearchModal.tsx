import React from 'react'
import {
    View,
    Modal,
    Pressable,
    Text,
    TouchableWithoutFeedback,
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
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 bg-black/50 justify-center items-center">
                    <TouchableWithoutFeedback>
                        <View className="bg-gray-900 w-11/12 rounded-2xl overflow-hidden">
                            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-800">
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
                            <LocationSearch onLocationSelected={onClose} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
} 
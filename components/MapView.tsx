import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, Platform } from 'react-native'
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps'
import { useLocation } from '@/contexts/LocationContext'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { RestrictedAirspaceService, RestrictedZone } from '@/services/restrictedAirspaceService'

export function DroneMapView() {
    const { location } = useLocation()
    const [restrictedZones, setRestrictedZones] = useState<RestrictedZone[]>([])

    useEffect(() => {
        if (location) {
            const fetchZones = async () => {
                try {
                    const zones = await RestrictedAirspaceService.getRestrictedZonesInRange(
                        {
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        },
                        25 // 25km radius
                    )
                    setRestrictedZones(zones)
                } catch (error) {
                    console.error('Failed to fetch restricted zones:', error)
                }
            }

            fetchZones()
            // Refresh every 30 seconds
            const interval = setInterval(fetchZones, 30000)
            return () => clearInterval(interval)
        }
    }, [location])

    if (!location) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Waiting for location...</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                region={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.2, // Show larger area for aircraft
                    longitudeDelta: 0.2,
                }}
                showsUserLocation
                showsMyLocationButton
            >
                {/* Aircraft Zones */}
                {restrictedZones.map((zone) => (
                    <React.Fragment key={zone.id}>
                        <Circle
                            center={zone.center}
                            radius={zone.radius}
                            fillColor={
                                zone.type === 'prohibited'
                                    ? 'rgba(183, 28, 28, 0.3)'
                                    : zone.type === 'restricted'
                                    ? 'rgba(244, 67, 54, 0.3)'
                                    : 'rgba(255, 193, 7, 0.3)'
                            }
                            strokeColor={
                                zone.type === 'prohibited'
                                    ? '#B71C1C'
                                    : zone.type === 'restricted'
                                    ? '#F44336'
                                    : '#FFC107'
                            }
                            strokeWidth={2}
                        />
                        <Marker
                            coordinate={zone.center}
                            title={zone.name}
                            description={zone.description}
                        >
                            <View style={[
                                styles.aircraftMarker,
                                {
                                    backgroundColor: zone.type === 'prohibited'
                                        ? '#B71C1C'
                                        : zone.type === 'restricted'
                                        ? '#F44336'
                                        : '#FFC107'
                                }
                            ]}>
                                <MaterialCommunityIcons
                                    name="airplane"
                                    size={24}
                                    color="#FFFFFF"
                                />
                            </View>
                        </Marker>
                    </React.Fragment>
                ))}

                {/* Drone Location */}
                <Marker
                    coordinate={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    }}
                    title="My Drone"
                    description="Current drone location"
                >
                    <View style={styles.droneMarker}>
                        <MaterialCommunityIcons
                            name="quadcopter"
                            size={32}
                            color="#3b82f6"
                        />
                    </View>
                </Marker>
            </MapView>

            <View style={styles.debug}>
                <Text style={styles.debugText}>
                    Lat: {location.coords.latitude.toFixed(6)}
                </Text>
                <Text style={styles.debugText}>
                    Lon: {location.coords.longitude.toFixed(6)}
                </Text>
                <Text style={styles.debugText}>
                    Aircraft: {restrictedZones.length}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 16,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#1f2937',
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    text: {
        color: 'white',
        textAlign: 'center',
        padding: 16,
    },
    debug: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 8,
        borderRadius: 8,
    },
    debugText: {
        color: 'white',
        fontSize: 12,
    },
    droneMarker: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 8,
        borderWidth: 3,
        borderColor: '#3b82f6',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    aircraftMarker: {
        borderRadius: 20,
        padding: 8,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
})

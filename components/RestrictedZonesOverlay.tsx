import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Circle, Marker } from 'react-native-maps'
import { useLocation } from '@/contexts/LocationContext'
import {
    RestrictedAirspaceService,
    RestrictedZone,
} from '@/services/restrictedAirspaceService'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const SEARCH_RADIUS_KM = 50 // Increased radius to see more data

export function RestrictedZonesOverlay() {
    const { location } = useLocation()
    const [restrictedZones, setRestrictedZones] = useState<RestrictedZone[]>([])

    useEffect(() => {
        if (!location) return

        const fetchZones = async () => {
            try {
                console.log('Fetching zones for location:', {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                })

                const zones =
                    await RestrictedAirspaceService.getRestrictedZonesInRange(
                        {
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        },
                        SEARCH_RADIUS_KM
                    )

                console.log('Fetched zones:', zones)
                setRestrictedZones(zones)
            } catch (error) {
                console.error('Failed to fetch restricted zones:', error)
            }
        }

        fetchZones()

        // Set up periodic refresh
        const intervalId = setInterval(fetchZones, 30000) // Refresh every 30 seconds

        return () => clearInterval(intervalId)
    }, [location])

    if (!location) return null

    console.log('Rendering zones:', restrictedZones.length)

    return (
        <>
            {restrictedZones.map((zone) => (
                <React.Fragment key={zone.id}>
                    <Circle
                        center={zone.center}
                        radius={zone.radius}
                        fillColor={getZoneColor(zone.type)}
                        strokeColor={getZoneStrokeColor(zone.type)}
                        strokeWidth={2}
                    />
                    <Marker
                        coordinate={zone.center}
                        title={zone.name}
                        description={getZoneDescription(zone)}
                    >
                        <MaterialCommunityIcons
                            name={getZoneIcon(zone.category)}
                            size={24}
                            color={getZoneIconColor(zone.type)}
                        />
                    </Marker>
                </React.Fragment>
            ))}
        </>
    )
}

function getZoneColor(type: RestrictedZone['type']): string {
    switch (type) {
        case 'warning':
            return 'rgba(255, 193, 7, 0.2)'
        case 'restricted':
            return 'rgba(244, 67, 54, 0.2)'
        case 'prohibited':
            return 'rgba(183, 28, 28, 0.2)'
        default:
            return 'rgba(158, 158, 158, 0.2)'
    }
}

function getZoneStrokeColor(type: RestrictedZone['type']): string {
    switch (type) {
        case 'warning':
            return '#FFC107'
        case 'restricted':
            return '#F44336'
        case 'prohibited':
            return '#B71C1C'
        default:
            return '#9E9E9E'
    }
}

function getZoneIcon(
    category: RestrictedZone['category']
): keyof typeof MaterialCommunityIcons.glyphMap {
    switch (category) {
        case 'airport':
            return 'airplane'
        case 'heliport':
            return 'helicopter'
        case 'military':
            return 'shield-alert'
        case 'national_park':
            return 'tree'
        case 'restricted':
            return 'alert-circle'
        default:
            return 'alert'
    }
}

function getZoneIconColor(type: RestrictedZone['type']): string {
    switch (type) {
        case 'warning':
            return '#FF9800'
        case 'restricted':
            return '#F44336'
        case 'prohibited':
            return '#B71C1C'
        default:
            return '#757575'
    }
}

function getZoneDescription(zone: RestrictedZone): string {
    const parts = [zone.description || `${zone.category} - ${zone.type}`]

    if (zone.restrictions) {
        if (zone.restrictions.maxHeight) {
            parts.push(`Max height: ${zone.restrictions.maxHeight}m`)
        }
        if (zone.restrictions.requiresAuthorization) {
            parts.push('Authorization required')
        }
        if (zone.restrictions.timeRestrictions) {
            const { start, end } = zone.restrictions.timeRestrictions
            if (start && end) {
                parts.push(`Time restrictions: ${start} - ${end}`)
            }
        }
    }

    return parts.join('\n')
}

const styles = StyleSheet.create({
    // Add any styles if needed
})

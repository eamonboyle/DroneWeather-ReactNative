import { LocationData } from '@/types/location'

export interface RestrictedZone {
    id: string
    name: string
    category:
        | 'airport'
        | 'heliport'
        | 'restricted'
        | 'national_park'
        | 'military'
    type: 'warning' | 'restricted' | 'prohibited'
    radius: number // in meters
    center: {
        latitude: number
        longitude: number
    }
    description?: string
    restrictions?: {
        maxHeight?: number // in meters
        requiresAuthorization?: boolean
        timeRestrictions?: {
            start?: string
            end?: string
        }
    }
}

interface OpenSkyState {
    icao24: string // Unique ICAO 24-bit address of the transponder
    callsign: string // Callsign of the vehicle
    origin_country: string // Country of origin
    time_position: number // Unix timestamp for last position update
    last_contact: number // Unix timestamp for last update in general
    longitude: number // WGS-84 longitude in decimal degrees
    latitude: number // WGS-84 latitude in decimal degrees
    baro_altitude: number // Barometric altitude in meters
    on_ground: boolean // Boolean value indicating if the position was retrieved from a surface position report
    velocity: number // Velocity over ground in m/s
    true_track: number // True track in decimal degrees (0 is north)
    vertical_rate: number // Vertical rate in m/s, positive indicates climbing
    geo_altitude: number // Geometric altitude in meters
}

interface OpenSkyResponse {
    time: number
    states: (string | number | boolean)[][]
}

const BASE_URL = 'https://opensky-network.org/api'
const RATE_LIMIT_WINDOW = 10000 // 10 seconds between requests
let lastRequestTime = 0

export class RestrictedAirspaceService {
    private static async waitForRateLimit() {
        const now = Date.now()
        const timeSinceLastRequest = now - lastRequestTime
        if (timeSinceLastRequest < RATE_LIMIT_WINDOW) {
            const waitTime = RATE_LIMIT_WINDOW - timeSinceLastRequest
            await new Promise((resolve) => setTimeout(resolve, waitTime))
        }
        lastRequestTime = Date.now()
    }

    private static parseOpenSkyState(
        rawState: (string | number | boolean)[]
    ): OpenSkyState | null {
        try {
            if (!rawState || rawState.length < 17) return null

            const state: OpenSkyState = {
                icao24: String(rawState[0]),
                callsign: String(rawState[1] || '').trim(),
                origin_country: String(rawState[2]),
                time_position: Number(rawState[3]),
                last_contact: Number(rawState[4]),
                longitude: Number(rawState[5]),
                latitude: Number(rawState[6]),
                baro_altitude: Number(rawState[7]),
                on_ground: Boolean(rawState[8]),
                velocity: Number(rawState[9]),
                true_track: Number(rawState[10]),
                vertical_rate: Number(rawState[11]),
                geo_altitude: Number(rawState[13]),
            }

            // Validate essential fields
            if (
                isNaN(state.latitude) ||
                isNaN(state.longitude) ||
                isNaN(state.baro_altitude) ||
                isNaN(state.velocity)
            ) {
                return null
            }

            return state
        } catch (error) {
            console.error('Error parsing OpenSky state:', error)
            return null
        }
    }

    private static convertToRestrictedZone(
        state: OpenSkyState
    ): RestrictedZone | null {
        try {
            // Skip aircraft on the ground
            if (state.on_ground) return null

            // Determine zone type based on altitude and vertical rate
            const isLowFlying = state.baro_altitude < 1000 // meters
            const isLanding = state.vertical_rate < -2 // m/s
            const isTakingOff = state.vertical_rate > 2 // m/s
            const isHighSpeed = state.velocity > 50 // m/s (~180 km/h)

            let type: RestrictedZone['type']
            let radius: number
            let category: RestrictedZone['category']

            if (isLanding || isTakingOff) {
                type = 'prohibited'
                radius = 3000
                category = 'airport'
            } else if (isLowFlying && isHighSpeed) {
                type = 'restricted'
                radius = 2000
                category = 'restricted'
            } else {
                type = 'warning'
                radius = 1000
                category = 'restricted'
            }

            return {
                id: state.icao24,
                name: state.callsign || 'Aircraft',
                category,
                type,
                radius,
                center: {
                    latitude: state.latitude,
                    longitude: state.longitude,
                },
                description: `${state.callsign || 'Aircraft'} from ${state.origin_country}\nAltitude: ${Math.round(state.baro_altitude)}m\nSpeed: ${Math.round(state.velocity * 3.6)}km/h`,
                restrictions: {
                    maxHeight: Math.max(
                        0,
                        Math.floor(state.baro_altitude - 150)
                    ), // 150m safety margin
                    requiresAuthorization: true,
                },
            }
        } catch (error) {
            console.error('Error converting to restricted zone:', error)
            return null
        }
    }

    static async getRestrictedZonesInRange(
        location: LocationData,
        radiusKm: number = 50
    ): Promise<RestrictedZone[]> {
        try {
            await this.waitForRateLimit()

            // Calculate bounding box
            const lat_padding = radiusKm / 111.32 // degrees latitude per km
            const lon_padding =
                radiusKm /
                (111.32 * Math.cos(location.latitude * (Math.PI / 180)))

            console.log('Fetching aircraft data from OpenSky Network...')
            const response = await fetch(
                `${BASE_URL}/states/all` +
                    `?lamin=${location.latitude - lat_padding}` +
                    `&lomin=${location.longitude - lon_padding}` +
                    `&lamax=${location.latitude + lat_padding}` +
                    `&lomax=${location.longitude + lon_padding}`
            )

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = (await response.json()) as OpenSkyResponse
            console.log(`Received ${data.states?.length || 0} aircraft states`)

            if (!data.states || !Array.isArray(data.states)) {
                console.log('No aircraft data received')
                return []
            }

            const zones = data.states
                .map((state) => this.parseOpenSkyState(state))
                .filter((state): state is OpenSkyState => state !== null)
                .map((state) => this.convertToRestrictedZone(state))
                .filter((zone): zone is RestrictedZone => zone !== null)

            console.log(`Processed ${zones.length} valid restricted zones`)
            return zones
        } catch (error) {
            console.error('Error fetching aircraft data:', error)
            return []
        }
    }

    static isLocationInRestrictedZone(
        location: LocationData,
        zones: RestrictedZone[]
    ): { isRestricted: boolean; zone?: RestrictedZone } {
        for (const zone of zones) {
            const distance = this.calculateDistance(
                location.latitude,
                location.longitude,
                zone.center.latitude,
                zone.center.longitude
            )

            if (distance <= zone.radius / 1000) {
                return { isRestricted: true, zone }
            }
        }

        return { isRestricted: false }
    }

    private static calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number {
        const R = 6371 // Earth's radius in kilometers
        const dLat = this.toRad(lat2 - lat1)
        const dLon = this.toRad(lon2 - lon1)
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) *
                Math.cos(this.toRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c
    }

    private static toRad(degrees: number): number {
        return degrees * (Math.PI / 180)
    }
}

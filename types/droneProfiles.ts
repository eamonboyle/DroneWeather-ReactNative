import { WeatherThresholds } from './weatherConfig'

export interface DroneProfile {
    id: string
    name: string
    manufacturer: string
    model: string
    imageUrl?: string
    thresholds: WeatherThresholds
}

// Popular drone profiles with their recommended weather thresholds
export const DRONE_PROFILES: DroneProfile[] = [
    {
        id: 'dji-mini-2',
        name: 'DJI Mini 2',
        manufacturer: 'DJI',
        model: 'Mini 2',
        imageUrl:
            'https://dji-official-fe.djicdn.com/cms/uploads/a1f1fe1b9bb4c96b5c44b1d9e3c8ac32.png',
        thresholds: {
            temperature: {
                unit: 'celsius',
                min: 0,
                max: 40,
            },
            windSpeed: {
                unit: 'kmh',
                max: 36, // Level 5 on Beaufort scale, slightly less than Mini 3 Pro
            },
            windGust: {
                max: 38,
            },
            visibility: {
                unit: 'kilometers',
                min: 5,
            },
            weather: {
                maxCloudCover: 90,
                maxPrecipitationProbability: 25, // Less weather resistant than Mini 3 Pro
            },
        },
    },
    {
        id: 'dji-mini-3-pro',
        name: 'DJI Mini 3 Pro',
        manufacturer: 'DJI',
        model: 'Mini 3 Pro',
        imageUrl:
            'https://dji-official-fe.djicdn.com/cms/uploads/6fd5f7f62f9a6a8f76e6cd4f6640c0c4.png',
        thresholds: {
            temperature: {
                unit: 'celsius',
                min: 0,
                max: 40,
            },
            windSpeed: {
                unit: 'kmh',
                max: 38, // Level 5 on Beaufort scale
            },
            windGust: {
                max: 40,
            },
            visibility: {
                unit: 'kilometers',
                min: 5,
            },
            weather: {
                maxCloudCover: 90,
                maxPrecipitationProbability: 30,
            },
        },
    },
    {
        id: 'dji-mavic-3',
        name: 'DJI Mavic 3',
        manufacturer: 'DJI',
        model: 'Mavic 3',
        imageUrl:
            'https://dji-official-fe.djicdn.com/cms/uploads/7c4f1f1c4132f5b6bff3c92876d9231c.png',
        thresholds: {
            temperature: {
                unit: 'celsius',
                min: -10,
                max: 40,
            },
            windSpeed: {
                unit: 'kmh',
                max: 43, // Level 5-6 on Beaufort scale
            },
            windGust: {
                max: 45,
            },
            visibility: {
                unit: 'kilometers',
                min: 5,
            },
            weather: {
                maxCloudCover: 90,
                maxPrecipitationProbability: 30,
            },
        },
    },
    {
        id: 'dji-air-2s',
        name: 'DJI Air 2S',
        manufacturer: 'DJI',
        model: 'Air 2S',
        imageUrl:
            'https://dji-official-fe.djicdn.com/cms/uploads/1bfb5f5ce5186efe9d1ff3c9dd714945.png',
        thresholds: {
            temperature: {
                unit: 'celsius',
                min: -10,
                max: 40,
            },
            windSpeed: {
                unit: 'kmh',
                max: 38, // Level 5 on Beaufort scale
            },
            windGust: {
                max: 40,
            },
            visibility: {
                unit: 'kilometers',
                min: 5,
            },
            weather: {
                maxCloudCover: 90,
                maxPrecipitationProbability: 30,
            },
        },
    },
    {
        id: 'dji-mini-4-pro',
        name: 'DJI Mini 4 Pro',
        manufacturer: 'DJI',
        model: 'Mini 4 Pro',
        imageUrl:
            'https://dji-official-fe.djicdn.com/dps/0c5e97540d6f8c2d4d9e9b1c8cc0d675.png',
        thresholds: {
            temperature: {
                unit: 'celsius',
                min: -10,
                max: 40,
            },
            windSpeed: {
                unit: 'kmh',
                max: 38,
            },
            windGust: {
                max: 40,
            },
            visibility: {
                unit: 'kilometers',
                min: 5,
            },
            weather: {
                maxCloudCover: 90,
                maxPrecipitationProbability: 25,
            },
        },
    },
    {
        id: 'dji-mavic-3-pro',
        name: 'DJI Mavic 3 Pro',
        manufacturer: 'DJI',
        model: 'Mavic 3 Pro',
        imageUrl:
            'https://dji-official-fe.djicdn.com/dps/f1f81f83c13c813a8f00b47397ef1f51.png',
        thresholds: {
            temperature: {
                unit: 'celsius',
                min: -10,
                max: 40,
            },
            windSpeed: {
                unit: 'kmh',
                max: 43,
            },
            windGust: {
                max: 45,
            },
            visibility: {
                unit: 'kilometers',
                min: 5,
            },
            weather: {
                maxCloudCover: 90,
                maxPrecipitationProbability: 30,
            },
        },
    },
    {
        id: 'autel-evo-lite-plus',
        name: 'Autel EVO Lite+',
        manufacturer: 'Autel Robotics',
        model: 'EVO Lite+',
        imageUrl:
            'https://autelpilot.com/cdn/shop/products/EVO-Lite-orange.png',
        thresholds: {
            temperature: {
                unit: 'celsius',
                min: -10,
                max: 40,
            },
            windSpeed: {
                unit: 'kmh',
                max: 40,
            },
            windGust: {
                max: 42,
            },
            visibility: {
                unit: 'kilometers',
                min: 5,
            },
            weather: {
                maxCloudCover: 90,
                maxPrecipitationProbability: 25,
            },
        },
    },
    {
        id: 'skydio-2-plus',
        name: 'Skydio 2+',
        manufacturer: 'Skydio',
        model: '2+',
        imageUrl:
            'https://assets.skydio.com/images/2plus/2plus-sport-kit-front-three-quarter.png',
        thresholds: {
            temperature: {
                unit: 'celsius',
                min: -10,
                max: 40,
            },
            windSpeed: {
                unit: 'kmh',
                max: 40,
            },
            windGust: {
                max: 42,
            },
            visibility: {
                unit: 'kilometers',
                min: 5,
            },
            weather: {
                maxCloudCover: 90,
                maxPrecipitationProbability: 20,
            },
        },
    },
    {
        id: 'parrot-anafi-ai',
        name: 'Parrot ANAFI Ai',
        manufacturer: 'Parrot',
        model: 'ANAFI Ai',
        imageUrl:
            'https://www.parrot.com/assets/s/2021/07/packshot-anafi-ai.png',
        thresholds: {
            temperature: {
                unit: 'celsius',
                min: -10,
                max: 40,
            },
            windSpeed: {
                unit: 'kmh',
                max: 46, // More wind resistant
            },
            windGust: {
                max: 48,
            },
            visibility: {
                unit: 'kilometers',
                min: 5,
            },
            weather: {
                maxCloudCover: 90,
                maxPrecipitationProbability: 35, // Better weather resistance
            },
        },
    },
    {
        id: 'autel-evo-2-pro',
        name: 'Autel EVO II Pro',
        manufacturer: 'Autel Robotics',
        model: 'EVO II Pro',
        imageUrl:
            'https://autelpilot.com/cdn/shop/products/EVO-II-Pro-orange.png',
        thresholds: {
            temperature: {
                unit: 'celsius',
                min: -10,
                max: 40,
            },
            windSpeed: {
                unit: 'kmh',
                max: 44,
            },
            windGust: {
                max: 46,
            },
            visibility: {
                unit: 'kilometers',
                min: 5,
            },
            weather: {
                maxCloudCover: 90,
                maxPrecipitationProbability: 30,
            },
        },
    },
    {
        id: 'dji-matrice-30t',
        name: 'DJI Matrice 30T',
        manufacturer: 'DJI Enterprise',
        model: 'Matrice 30T',
        imageUrl:
            'https://dji-official-fe.djicdn.com/dps/67e20b0d5d6587faa2501b6e4a3f9e72.png',
        thresholds: {
            temperature: {
                unit: 'celsius',
                min: -20,
                max: 50,
            },
            windSpeed: {
                unit: 'kmh',
                max: 54, // Enterprise grade, higher wind resistance
            },
            windGust: {
                max: 56,
            },
            visibility: {
                unit: 'kilometers',
                min: 3,
            },
            weather: {
                maxCloudCover: 100,
                maxPrecipitationProbability: 50, // IP55 rating
            },
        },
    },
    {
        id: 'dji-inspire-3',
        name: 'DJI Inspire 3',
        manufacturer: 'DJI',
        model: 'Inspire 3',
        imageUrl:
            'https://dji-official-fe.djicdn.com/dps/6e8989a4f91f8edcd11a31d4337be7d7.png',
        thresholds: {
            temperature: {
                unit: 'celsius',
                min: -20,
                max: 40,
            },
            windSpeed: {
                unit: 'kmh',
                max: 47,
            },
            windGust: {
                max: 50,
            },
            visibility: {
                unit: 'kilometers',
                min: 5,
            },
            weather: {
                maxCloudCover: 90,
                maxPrecipitationProbability: 30,
            },
        },
    },
    {
        id: 'dji-phantom-4-rtk',
        name: 'DJI Phantom 4 RTK',
        manufacturer: 'DJI Enterprise',
        model: 'Phantom 4 RTK',
        imageUrl:
            'https://dji-official-fe.djicdn.com/cms/uploads/7d3b0a8e30816c1472f6e835f3b9df08.png',
        thresholds: {
            temperature: {
                unit: 'celsius',
                min: -10,
                max: 40,
            },
            windSpeed: {
                unit: 'kmh',
                max: 43,
            },
            windGust: {
                max: 45,
            },
            visibility: {
                unit: 'kilometers',
                min: 5,
            },
            weather: {
                maxCloudCover: 90,
                maxPrecipitationProbability: 30,
            },
        },
    },
    {
        id: 'autel-dragonfish',
        name: 'Autel Dragonfish',
        manufacturer: 'Autel Robotics',
        model: 'Dragonfish',
        imageUrl:
            'https://autelpilot.com/cdn/shop/products/Dragonfish_Standard_45.png',
        thresholds: {
            temperature: {
                unit: 'celsius',
                min: -20,
                max: 45,
            },
            windSpeed: {
                unit: 'kmh',
                max: 50, // VTOL design, better wind resistance
            },
            windGust: {
                max: 52,
            },
            visibility: {
                unit: 'kilometers',
                min: 4,
            },
            weather: {
                maxCloudCover: 95,
                maxPrecipitationProbability: 40, // Better weather resistance
            },
        },
    },
    {
        id: 'freefly-astro',
        name: 'Freefly Astro',
        manufacturer: 'Freefly Systems',
        model: 'Astro',
        imageUrl: 'https://freeflysystems.com/static/astro_hero.png',
        thresholds: {
            temperature: {
                unit: 'celsius',
                min: -10,
                max: 40,
            },
            windSpeed: {
                unit: 'kmh',
                max: 45,
            },
            windGust: {
                max: 47,
            },
            visibility: {
                unit: 'kilometers',
                min: 5,
            },
            weather: {
                maxCloudCover: 90,
                maxPrecipitationProbability: 30,
            },
        },
    },
    {
        id: 'yuneec-h520e',
        name: 'Yuneec H520E',
        manufacturer: 'Yuneec',
        model: 'H520E',
        imageUrl: 'https://yuneec.com/static/h520e_hero.png',
        thresholds: {
            temperature: {
                unit: 'celsius',
                min: -20,
                max: 45,
            },
            windSpeed: {
                unit: 'kmh',
                max: 46,
            },
            windGust: {
                max: 48,
            },
            visibility: {
                unit: 'kilometers',
                min: 4,
            },
            weather: {
                maxCloudCover: 95,
                maxPrecipitationProbability: 35,
            },
        },
    },
    {
        id: 'dji-agras-t40',
        name: 'DJI Agras T40',
        manufacturer: 'DJI Agriculture',
        model: 'Agras T40',
        imageUrl:
            'https://dji-official-fe.djicdn.com/dps/e4e1fdd0d338d1d3bd067aaa0551ad4f.png',
        thresholds: {
            temperature: {
                unit: 'celsius',
                min: -10,
                max: 45,
            },
            windSpeed: {
                unit: 'kmh',
                max: 54, // Agricultural drone, high wind resistance
            },
            windGust: {
                max: 56,
            },
            visibility: {
                unit: 'kilometers',
                min: 4,
            },
            weather: {
                maxCloudCover: 100,
                maxPrecipitationProbability: 60, // IP67 rating, designed for spraying
            },
        },
    },
    {
        id: 'skydio-x10',
        name: 'Skydio X10',
        manufacturer: 'Skydio',
        model: 'X10',
        imageUrl:
            'https://assets.skydio.com/images/x10/x10-front-three-quarter.png',
        thresholds: {
            temperature: {
                unit: 'celsius',
                min: -20,
                max: 45,
            },
            windSpeed: {
                unit: 'kmh',
                max: 47,
            },
            windGust: {
                max: 49,
            },
            visibility: {
                unit: 'kilometers',
                min: 4,
            },
            weather: {
                maxCloudCover: 95,
                maxPrecipitationProbability: 40,
            },
        },
    },
]

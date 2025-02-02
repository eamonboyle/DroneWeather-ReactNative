module.exports = {
    expo: {
        name: 'drone-weather',
        slug: 'drone-weather',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/images/icon.png',
        userInterfaceStyle: 'automatic',
        splash: {
            image: './assets/splash.png',
            resizeMode: 'contain',
            backgroundColor: '#ffffff',
        },
        assetBundlePatterns: ['**/*'],
        ios: {
            supportsTablet: true,
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/adaptive-icon.png',
                backgroundColor: '#ffffff',
            },
        },
        extra: {
            opencageApiKey: process.env.OPENCAGE_API_KEY,
        },
    },
}

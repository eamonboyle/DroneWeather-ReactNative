# Drone Weather App

A mobile application built with React Native and Expo that helps drone pilots determine safe flying conditions based on weather data. The app provides real-time weather information and customizable safety thresholds for various weather parameters.

## Features

- Real-time weather data for your current location
- Customizable safety thresholds for:
  - Temperature
  - Wind Speed and Gusts
  - Cloud Cover
  - Precipitation Probability
- Visual indicators for safe/unsafe conditions
- Hourly forecast view
- Detailed table view for weekly forecast
- Unit conversion support (metric/imperial)
- Location-based weather updates
- Beautiful, modern UI with dark theme

## TODO:
- [x] Create a refresh button that refreshes location & weather
- [ ] Make forecase header row / day sticky, so you can see when scrolling
- [ ] Fix Week view load times
- [ ] Create some app tools
- [ ] Allow user to change location (needs location search functionality)
- [ ] Select drone profiles for default settings such as Wind speed - need to research the data for this

## Getting Started

1. Install dependencies:

    ```bash
    npm install
    ```

2. Start the development server:

    ```bash
    npx expo start
    ```

3. Run on your preferred platform:
- Press 'a' for Android
- Press 'i' for iOS
- Scan QR code with Expo Go app on your device

## Technology Stack

- React Native
- Expo
- TypeScript
- TailwindCSS (NativeWind)
- React Navigation
- Expo Router
- date-fns for date formatting
- React Native Reanimated for animations

## Configuration

The app allows customization of weather thresholds through the settings screen:

- Temperature range (°C/°F)
- Maximum wind speed (km/h / mph)
- Maximum wind gusts
- Maximum cloud cover percentage
- Maximum precipitation probability
- Minimum visibility

## Contributing

Feel free to submit issues and enhancement requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

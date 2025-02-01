/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
    ],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                safe: '#22c55e', // green-500
                warning: '#eab308', // yellow-500
                danger: '#ef4444', // red-500
            },
        },
    },
    plugins: [],
}

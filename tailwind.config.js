/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './src_old/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#030213',
        secondary: '#ececf0',
        accent: '#FF9500',
        'accent-dark': '#FF7A00',
        muted: '#ececf0',
        border: 'rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}

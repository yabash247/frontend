/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      //sm: '2rem',
      lg: '4rem',
      xl: '5rem',
      '2xl': '6rem',
    },
    extend: {
      aspectRatio: {
        //'4/3': '4 / 3',
      },
    },
  },
  plugins: [],
}


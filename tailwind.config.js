/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '968px',
      lg: '1144px',
      xl: '1440px',
      'betterhover': {'raw': '(hover: hover)'},
    },
    colors: {
      'blue': '#1fb6ff',
      'blue-light': '#6acdff',
      'purple': '#ab8cd8',
      'pink': '#ff49db',
      'orange': 'rgb(219, 106, 30)',
      'green-light': '#83d834',
      'green': '#13ce66',
      'yellow': '#ffc82c',
      'yellow-light': 'rgb(230, 230, 34)',
      'gray-dark': '#273444',
      'gray': '#8492a6',
      'gray-light': '#c5c5c5',
      'white': '#fff',
      'red': 'rgb(196, 36, 36)',
      'black': 'rgb(0, 0, 0)'
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-0.4deg)' },
          '50%': { transform: 'rotate(0.4deg)' },
        }
      },
      animation: {
        wiggle: 'wiggle 1.2s ease-in-out infinite',
      }
    }

  },
  plugins: [],
}


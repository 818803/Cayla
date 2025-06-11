/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sakura-pink': '#FFB7C5',
        'sakura-dark': '#A17D83',
        'sakura-bg': '#FFF5F7',
        'sakura-gray': '#FCEEF0',
        'sakura-text': '#5B5052',
        'sakura-accent': '#FF8FAB',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
       boxShadow: {
        'pink-glow': '0 0 20px 0 rgba(255, 143, 171, 0.5)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
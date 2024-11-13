/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        20: 20,
      },
      colors: {
        editorGray: '#AFB0AF',
        primary: '#A259FF36',
        primaryLight: '#A259FF10',
        bfpurple: {
          0: '#EFEFEF',
          50: '#F6F6FF',
          100: '#DFDEFF',
          200: '#D0CDFF',
          300: '#C0BDFF',
          400: '#B0ADFF',
          500: '#A19CFF',
          600: '#918CFF',
          700: '#827BFF',
          800: '#726BFF',
          900: '#635bff',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

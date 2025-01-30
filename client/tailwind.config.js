/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'screen1880':'1880px',
        'screen1600':'1600px',
        'screen1400':'1400px',
        'screen900':'900px',
        'sm300': '300px',
        'sm200': '200px', 
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    daisyui,
  ],
}


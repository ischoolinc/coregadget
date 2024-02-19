/** @type {import('tailwindcss').Config} */
import daisyUI from "daisyui";
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Roboto', 'Helvetica', 'Noto Sans TC', 'sans-serif'],
      serif: ['Roboto', 'Helvetica', 'Noto Sans TC', 'serif'],
    },
    extend: {},
  },
  plugins: [daisyUI],
  daisyui: {
    themes: [
      'cupcake',
      'cmyk',
      'light',
      'dark',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
    ],
  },
}


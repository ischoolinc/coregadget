const colors = require('tailwindcss/colors');
const { createCompilerHost } = require('typescript');
const plugin = require('tailwindcss/plugin');

module.exports = {
  mode: 'jit',
  purge: {
    content: [
      './src/**/*.{html,ts,scss}',
    ]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          lighter: '#CFEDEF',
          light: '#8FD4D8',
          DEFAULT: '#5EC1C7',
          dark: '#1098A0',
        },
        secondary: {
          lighter: '#CCD8E9',
          light: '#88A4CB',
          DEFAULT: '#2a74dd',
          dark: '#3C4F81',
        },
        third: {
          DEFAULT: '#ecc743',
          dark: '#CA8A04',
          darker: '#A16207',
        },
        gray: {
          text1: '#323232',
          text2: '#4F4F4F',
          text3: '#636363',
          DEFAULT: '#A3A3A3',
          light: '#E0E0E0',
          lightest: '#F3F3F3'
        },
        success: {
          DEFAULT: '#80B938',
          dark: '#65A30D',
        },
        warning: {
          DEFAULT: '#F43F5E',
          dark: '#dc3955',
          darker: '#BE123C4',
        },
      },

      screens: {
        'xs': '496px',
        // => @media (min-width: 496px) { ... }
        'lg2': '1056px',
      },

      gridColumnStart: {
        '13': '13',
        '14': '14',
        '15': '15',
        '16': '16',
        '17': '17',
       },

       gridColumnEnd: {
        '13': '13',
        '14': '14',
        '15': '15',
        '16': '16',
        '17': '17',
       },

       spacing: {
        '55': '13.3rem',
        '104': '418px',
        '5.5': '22px',
        '0.25': '1px',

      },

      minWidth: {
        '64': '256px',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      boxShadow: ['active'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
  ],
}

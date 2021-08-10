const colors = require('tailwindcss/colors')
const { createCompilerHost } = require('typescript');
const plugin = require('tailwindcss/plugin')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          lightest: '#EEF5F5',
          lighter: '#CFEDEF',
          light: '#8FD4D8',
          DEFAULT: '#5EC1C7',
          dark: '#1098A0',
          bg: '#F4F9F9',
        },
        secondary: {
          lighter: '#CCD8E9',
          light: '#88A4CB',
          DEFAULT: '#547CB4',
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
        'xl': { 'max': '1279px' },
        'lg': { 'max': '1023px' },
        'md2': { 'max': '980px' },
        'md': { 'max': '767px' },
        'sm': { 'max': '639px' },
        'xs': { 'max': '495px' },        
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
        '106': '424px',
        '5.5': '22px',
        '18': '72px',
        '160': '640px',
        '200': '800px',
        '4.7': '18px',
        '17': '68px',
        '30': '120px',
        '86': '344px',

      },

      borderWidth: {
        '1.5': '1.7px',
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      boxShadow: ['active'],
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
}

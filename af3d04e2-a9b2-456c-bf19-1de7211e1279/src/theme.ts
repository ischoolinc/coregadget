import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}
const theme = extendTheme({ 
  config,
  colors: {
    gblue: {
      100: "#68cacd",
      900: "#346c6d",
    },
  },
 })

export default theme
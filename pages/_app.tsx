import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core'
import { appThemeOptions } from '../utils/theme'
import { useEffect } from 'react'
import '../styles/globals.css'
import '../styles/fonts.css'
import '../styles/nprogress.css'
import { LoadingIndicator } from '../components/LoadingIndicator'

const theme = createMuiTheme(appThemeOptions)

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
      <LoadingIndicator />
    </ThemeProvider>
  )
}

export default MyApp

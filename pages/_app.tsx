import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core'
import { appThemeOptions } from '../utils/theme'
import { useEffect } from 'react'
import { CssGlobals } from '../components/CssGlobals'
import { CssFonts } from '../components/CssFonts'
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
      <CssGlobals />
      <CssFonts />
      <Component {...pageProps} />
      <LoadingIndicator />
    </ThemeProvider>
  )
}

export default MyApp

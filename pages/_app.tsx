import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core'
import { useEffect } from 'react'
import { CssFonts } from '../components/CssFonts'
import { CssGlobals } from '../components/CssGlobals'
import { LoadingIndicator } from '../components/LoadingIndicator'
import { appThemeOptions } from '../utils/theme'

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

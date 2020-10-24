import { makeStyles } from '@material-ui/core'
import { appFontFamily } from '../utils/theme'

const useStyles = makeStyles({
  '@global': {
    'html, body': {
      padding: 0,
      margin: 0,
      fontFamily: appFontFamily,
    },
    a: {
      color: 'inherit',
      textDecoration: 'none',
    },
    '*': {
      boxSizing: 'border-box',
    },
  },
})

export function CssGlobals() {
  useStyles()
  return null
}

import { ThemeOptions } from '@material-ui/core'

export const appFontFamily =
  'Noto Sans Thai, Sukhumvit Set, -apple-system, BlinkMacSystemFont, ' +
  'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, ' +
  'Helvetica Neue, sans-serif'

export const appThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: appFontFamily,
  },
  palette: {
    primary: {
      main: `#DE5C8E`,
    },
  },
}

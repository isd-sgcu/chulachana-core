import { makeStyles } from '@material-ui/core'
import { FontFace } from '@material-ui/styles/node_modules/csstype'

function localFontName(font: string, variant: string) {
  if (variant === 'Regular') {
    return font
  } else {
    return `${font} ${variant}`
  }
}

function makeFontFace(variant: string, weight: string | number): FontFace[] {
  const robotoVariant = variant === 'SemiBold' ? 'Medium' : variant
  return [
    {
      fontFamily: `'Noto Sans Thai'`,
      src: `local('${localFontName(
        'Roboto',
        robotoVariant
      )}'), url('/fonts/Roboto/Roboto-${robotoVariant}.ttf')`,
      fontWeight: weight,
      fontStyle: 'normal',
      fontDisplay: 'swap',
    },
    {
      fontFamily: `'Noto Sans Thai'`,
      src: `local('${localFontName(
        'Noto Sans Thai',
        variant
      )}'), url('/fonts/NotoSansThai/NotoSansThai-${variant}.ttf')`,
      fontWeight: weight,
      fontStyle: 'normal',
      fontDisplay: 'swap',
      unicodeRange: `'U+0E00-0E7F'`,
    },
  ]
}

const useStyles = makeStyles({
  '@global': {
    '@font-face': [
      ...makeFontFace('Regular', 'normal'),
      ...makeFontFace('Light', 300),
      ...makeFontFace('SemiBold', 600),
    ],
  },
})

export function CssFonts() {
  useStyles()
  return null
}

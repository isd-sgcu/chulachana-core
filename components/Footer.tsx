import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { appFontFamily } from '../utils/theme'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '100%',
      marginTop: 16,
      padding: 8,
      backgroundColor: theme.palette.primary.main,
      boxShadow:
        '0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)',
      borderRadius: 4,
    },
    footerText: {
      fontFamily: appFontFamily,
      fontSize: 11,
      fill: 'white',
      WebkitUserSelect: 'none',
      userSelect: 'none',
    },
  })
)

export default function Footer() {
  const classes = useStyles()
  return (
    <svg
      className={classes.paper}
      width="100%"
      viewBox="0 0 291 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text x="0" y="10" className={classes.footerText}>
        © 2020, องค์การบริหารสโมสรนิสิตจุฬาลงกรณ์มหาวิทยาลัย (อบจ.)
      </text>
    </svg>
  )
}

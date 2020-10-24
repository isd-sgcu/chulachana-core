import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { ComponentType, PropsWithChildren } from 'react'
import Footer from './Footer'

type PageLayoutProps = PropsWithChildren<{
  wavesComponent: ComponentType
}>

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@global': {
      body: {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    center: {
      display: 'flex',
      justifyContent: 'center',
    },
    container: {
      width: '100%',
      maxWidth: 376,
      padding: 'clamp(28px, 10vh, 116px)',
      paddingLeft: 28,
      paddingRight: 28,
      fallbacks: {
        padding: 28,
      },
    },
    paper: {
      height: 532,
      width: '100%',
      boxShadow:
        '0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)',
      borderRadius: 4,
    },
    inner: {
      position: 'relative',
      height: 528,
      background: `#ffffff`,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      zIndex: 0,
    },
    content: {
      padding: 16,
    },
    waves: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      zIndex: -1,
      '@global': {
        svg: {
          marginBottom: -8,
        },
      },
    },
    bottomCorner: {
      height: 4,
      background: theme.palette.primary.light,
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
    },
  })
)

export function PageLayout({ wavesComponent, children }: PageLayoutProps) {
  const classes = useStyles()
  const Waves = wavesComponent
  return (
    <div className={classes.center}>
      <div className={classes.container}>
        <div className={classes.paper}>
          <div className={classes.inner}>
            <div className={classes.content}>{children}</div>
            <div className={classes.waves}>
              <Waves />
            </div>
          </div>
          <div className={classes.bottomCorner} />
        </div>
        <Footer />
      </div>
    </div>
  )
}

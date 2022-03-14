import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import { useEffect, useState } from 'react'

const useStyles = makeStyles((theme: Theme) => {
  const themeColor = theme.palette.primary.light
  return createStyles({
    '@keyframes nprogress-spinner': {
      from: {
        transform: 'rotate(0deg)',
      },
      to: {
        transform: 'rotate(360deg)',
      },
    },
    '@global': {
      '#nprogress': {
        pointerEvents: 'none',
      },
      '#nprogress .bar': {
        background: themeColor,

        position: 'fixed',
        zIndex: 1031,
        top: 0,
        left: 0,

        width: '100%',
        height: 2,
      },
      '#nprogress .peg': {
        display: 'block',
        position: 'absolute',
        right: 0,
        width: 100,
        height: '100%',
        boxShadow: `0 0 10px ${themeColor}, 0 0 5px ${themeColor}`,
        opacity: 1,

        WebkitTransform: 'rotate(3deg) translate(0px, -4px)',
        msTransform: 'rotate(3deg) translate(0px, -4px)',
        transform: 'rotate(3deg) translate(0px, -4px)',
      },
      '@media (min-width: 414px)': {
        '#nprogress .spinner': {
          display: 'block',
          position: 'fixed',
          zIndex: 1031,
          top: 15,
          right: 15,
        },
        '#nprogress .spinner-icon': {
          width: 18,
          height: 18,
          boxSizing: 'border-box',

          border: 'solid 2px transparent',
          borderTopColor: themeColor,
          borderLeftColor: themeColor,
          borderRadius: '50%',

          animation: '$nprogress-spinner 400ms linear infinite',
        },
      },
    },
  })
})

const LoadingIndicator: React.FC = () => {
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState(false)
  useStyles()

  useEffect(() => {
    const setLoading = () => setPageLoading(true)
    const setNotLoading = () => setPageLoading(false)

    router.events.on('routeChangeStart', setLoading)
    router.events.on('routeChangeComplete', setNotLoading)
    router.events.on('routeChangeError', setNotLoading)

    return () => {
      router.events.off('routeChangeStart', setLoading)
      router.events.off('routeChangeComplete', setNotLoading)
      router.events.off('routeChangeError', setNotLoading)
    }
  }, [router])

  useEffect(() => {
    if (pageLoading) {
      const timeout = setTimeout(() => NProgress.start(), 100)
      return () => {
        clearTimeout(timeout)
        NProgress.done()
      }
    }
  }, [pageLoading])

  return null
}

export { LoadingIndicator }

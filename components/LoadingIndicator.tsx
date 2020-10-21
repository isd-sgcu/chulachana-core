import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'

const LoadingIndicator: React.FC = () => {
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState(false)

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

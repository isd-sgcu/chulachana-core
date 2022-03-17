import { ServerResponse } from 'http'
import { GetServerSideProps } from 'next'
import { EventInfo } from '../models/prisma/event'
import ErrorPage from '../pages/_error'

export interface ErrorPageProps<P> {
  pageProps?: P & { eventInfo?: EventInfo; errorCode?: number }
  errorCode?: number
}

interface ErrorPageOptions {
  ensureEventExists?: boolean
}

export function withErrorPage<P>(
  Page: React.ComponentType<P>,
  options?: {
    ensureEventExists?: boolean
  }
): React.ComponentType<ErrorPageProps<P>> & ErrorPageOptions {
  function withErrorPage(props: ErrorPageProps<P>) {
    if (props.pageProps.errorCode) {
      return <ErrorPage statusCode={props.pageProps.errorCode} />
    }

    if (props.errorCode) {
      return <ErrorPage statusCode={props.errorCode} />
    }
    if (options?.ensureEventExists && !props.pageProps.eventInfo) {
      return <ErrorPage message="ไม่พบงานที่ระบุ" />
    }

    return <Page {...props.pageProps} />
  }

  return withErrorPage
}

export function getErrorPageProps<P>(
  pageGetServerSideProps: GetServerSideProps<P>
) {
  const getServerSideProps: GetServerSideProps<ErrorPageProps<P>> = async (
    context
  ) => {
    try {
      const { props, ...rest } = await pageGetServerSideProps(context)
      return {
        ...rest,
        props: {
          pageProps: props,
        },
      }
    } catch (err) {
      return checkHttpError(context.res, err)
    }
  }
  return getServerSideProps
}

export function checkHttpError(res: ServerResponse, err: any) {
  if (err.statusCode || err.response?.status) {
    const status = err.statusCode || err.response.status
    res.statusCode = status
    return {
      props: {
        errorCode: status,
      },
    }
  } else {
    throw err
  }
}

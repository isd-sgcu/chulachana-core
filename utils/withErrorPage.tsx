import { ServerResponse } from 'http'
import { GetServerSideProps } from 'next'
import ErrorPage from '../pages/_error'

export interface ErrorPageProps<P> {
  pageProps?: P
  errorCode?: number
}

export function withErrorPage<P>(
  Page: React.ComponentType<P>
): React.ComponentType<ErrorPageProps<P>> {
  function withErrorPage(props: ErrorPageProps<P>) {
    if (props.errorCode) {
      return <ErrorPage statusCode={props.errorCode} />
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

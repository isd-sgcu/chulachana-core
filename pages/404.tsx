import ErrorPage from './_error'

function NotFound() {
  return <ErrorPage statusCode={404} />
}

export default NotFound

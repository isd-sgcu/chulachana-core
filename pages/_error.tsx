import Head from 'next/head'
import Link from 'next/link'

interface ErrorPageProps {
  statusCode?: number
  message?: string
}

function ErrorPage({ statusCode, message }: ErrorPageProps) {
  const displayMessage =
    message || statusCode === 404
      ? `ไม่พบหน้านี้`
      : `เกิดข้อผิดพลาด ${statusCode}`
  return (
    <div>
      <Head>
        <title>{displayMessage}</title>
      </Head>
      <h1>{displayMessage}</h1>
      <div>
        <Link href="/" passHref>
          <a>กลับหน้าหลัก</a>
        </Link>
      </div>
    </div>
  )
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default ErrorPage

import { Button } from '@material-ui/core'
import Head from 'next/head'
import Link from 'next/link'
import { PageLayout } from '../components/PageLayout'

interface ErrorPageProps {
  statusCode?: number
  message?: string
}

function ErrorPage({ statusCode, message }: ErrorPageProps) {
  const displayMessage =
    message || statusCode === 404
      ? `ไม่พบหน้านี้`
      : `เกิดข้อผิดพลาด ${statusCode || 500}`
  return (
    <>
      <Head>
        <title>{displayMessage}</title>
      </Head>
      <PageLayout style={{ padding: 16 }}>
        <h1 style={{ marginTop: 0, marginBottom: 4 }}>{displayMessage}</h1>
        <div>
          <Link href="/" passHref>
            <Button variant="outlined" color="primary">
              กลับหน้าหลัก
            </Button>
          </Link>
        </div>
      </PageLayout>
    </>
  )
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default ErrorPage

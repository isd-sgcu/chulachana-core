import { Button, makeStyles } from '@material-ui/core'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import Head from 'next/head'
import Link from 'next/link'
import { useMemo } from 'react'
import Check from '../../components/Check'
import { EventProvider } from '../../components/EventProvider'
import { EventTitle } from '../../components/EventTitle'
import { PageLayout } from '../../components/PageLayout'
import { SuccessPageWaves } from '../../components/SuccessPageWaves'
import { EventInfo, getEventInfo } from '../../models/redis/event'
import { Config } from '../../utils/config'
import { useEventType } from '../../utils/frontend-utils'
import { parseEventId } from '../../utils/types'
import { getErrorPageProps, withErrorPage } from '../../utils/withErrorPage'

export interface SuccessPageProps {
  phone: string
  checkInDate: number
  checkOutDate: number
  eventIdAndType: string
  eventInfo: EventInfo
}

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: 72,
  },
  successMessage: {
    fontWeight: 'normal',
    fontSize: 18,
    margin: 0,
    paddingTop: 8,
  },
  eventTitle: {
    marginTop: 50,
  },
  timestamp: {
    fontWeight: 'lighter',
    fontSize: 14,
    marginTop: 24,
  },
  button: {
    marginTop: 14,
  },
})

function SuccessPage({
  phone,
  checkInDate,
  checkOutDate,
  eventIdAndType,
  eventInfo,
}: SuccessPageProps) {
  const classes = useStyles()
  const type = useEventType(eventIdAndType)
  const isCheckOut = !!checkOutDate

  const checkInTime = useMemo(() => {
    const dm = format(checkInDate, 'd LLLL', { locale: th })
    const y = `${parseInt(format(checkInDate, 'yyyy')) + 543}`
    const hhmm = format(checkInDate, 'kk:mm')
    return `${dm} ${y} เวลา ${hhmm} น.`
  }, [checkInDate])

  const checkInDuration = useMemo(() => {
    if (!checkInDate || !checkOutDate) {
      return null
    }
    const seconds = (checkOutDate - checkInDate) / 1000
    const totalMinutes = Math.ceil(seconds / 60)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    const res = []
    if (hours > 0) {
      res.push(`${hours} ชั่วโมง`)
    }
    if (minutes > 0) {
      res.push(`${minutes} นาที`)
    }
    return res.join(' ')
  }, [checkInDate, checkOutDate])

  return (
    <EventProvider eventInfo={eventInfo}>
      <Head>
        <title>
          {isCheckOut ? 'เช็คเอาท์ออกจากงานสำเร็จ' : 'เช็คอินเข้างานสำเร็จ'}
        </title>
      </Head>
      <PageLayout wavesComponent={SuccessPageWaves}>
        <div className={classes.container}>
          <Check isCheckOut={isCheckOut} />
          <h3 className={classes.successMessage}>
            {isCheckOut ? 'เช็คเอาท์ออกจากงานสำเร็จ' : 'เช็คอินเข้างานสำเร็จ'}!
          </h3>
          <EventTitle
            className={classes.eventTitle}
            eventInfo={eventInfo}
            type={type}
          />
          <p className={classes.timestamp}>
            หมายเลขโทรศัพท์: {phone}
            <br />
            {isCheckOut && 'เช็คอินเมื่อ: '}
            {checkInTime}
            {isCheckOut && checkInDuration && (
              <>
                <br />
                ระยะเวลาที่อยู่ในงาน: {checkInDuration}
              </>
            )}
          </p>
          <Link
            href={`/[eventIdAndType]?action=${
              isCheckOut ? 'checkin' : 'checkout'
            }`}
            as={`/${eventIdAndType}?action=${
              isCheckOut ? 'checkin' : 'checkout'
            }`}
            passHref
          >
            <Button
              className={classes.button}
              type="submit"
              variant="contained"
              color="primary"
              disableElevation
            >
              {isCheckOut ? 'เช็คอินอีกครั้ง' : 'เช็คเอาท์'}
            </Button>
          </Link>
        </div>
      </PageLayout>
    </EventProvider>
  )
}

export default withErrorPage(SuccessPage, { ensureEventExists: true })

export const getServerSideProps = getErrorPageProps<SuccessPageProps>(
  async ({ query, req, res }) => {
    const eventIdAndType = query.eventIdAndType as string
    const { eventId } = parseEventId(eventIdAndType)
    const eventInfo = await getEventInfo(eventId)
    const config = new Config(req, res)
    const phone = config.get('core', 'phone')
    const checkInDate = config.get(eventId, 'checkInDate')
    const checkOutDate = config.get(eventId, 'checkOutDate')
    if (!phone || !checkInDate) {
      return {
        unstable_redirect: {
          permanent: false,
          destination: `/${eventIdAndType}`,
        },
      }
    }
    return {
      props: { phone, checkInDate, checkOutDate, eventIdAndType, eventInfo },
    }
  }
)

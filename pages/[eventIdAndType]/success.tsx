import { getErrorPageProps, withErrorPage } from '../../utils/withErrorPage'
import { EventProvider } from '../../components/EventProvider'
import { PageLayout } from '../../components/PageLayout'
import { SuccessPageWaves } from '../../components/SuccessPageWaves'
import Check from '../../components/Check'
import { makeStyles, Button } from '@material-ui/core'
import { EventTitle } from '../../components/EventTitle'
import { useEventType } from '../../utils/frontend-utils'
import { useMemo } from 'react'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import Link from 'next/link'
import { EventInfoDto, parseEventId } from '../../utils/types'
import Cookies from 'cookies'
import { getInfo } from '../../api/getinfo'

export interface SuccessPageProps {
  checkInDate: number
  checkOutDate: number
  eventIdAndType: string
  eventInfo: EventInfoDto
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
      <PageLayout wavesComponent={SuccessPageWaves}>
        <div className={classes.container}>
          <Check />
          <h3 className={classes.successMessage}>
            {isCheckOut ? 'เช็คเอาท์ออกจากงานสำเร็จ' : 'เช็คอินเข้างานสำเร็จ'}!
          </h3>
          <EventTitle
            className={classes.eventTitle}
            eventInfo={eventInfo}
            type={type}
          />
          <p className={classes.timestamp}>
            {isCheckOut && 'เช็คอินเมื่อ: '}
            {checkInTime}
            {isCheckOut && checkInDuration && (
              <>
                <br />
                ระยะเวลาเช็คอิน: {checkInDuration}
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

export default withErrorPage(SuccessPage)

export const getServerSideProps = getErrorPageProps<SuccessPageProps>(
  async ({ query, req, res }) => {
    const eventIdAndType = query.eventIdAndType as string
    const { eventId } = parseEventId(eventIdAndType)
    const eventInfo = await getInfo(eventId)
    const cookies = new Cookies(req, res)
    const checkInDate = parseInt(cookies.get('checkInDate'))
    const checkOutDate = parseInt(cookies.get('checkOutDate'))
    if (!checkInDate) {
      return {
        unstable_redirect: {
          permanent: false,
          destination: `/${eventIdAndType}`,
        },
      }
    }
    return { props: { checkInDate, checkOutDate, eventIdAndType, eventInfo } }
  }
)

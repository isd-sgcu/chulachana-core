import { Button, makeStyles } from '@material-ui/core'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import Head from 'next/head'
import Router from 'next/router'
import { useMemo } from 'react'
import { apiClient } from '../../../axios/client'
import Check from '../../../components/Check'
import { EventProvider } from '../../../components/EventProvider'
import { EventTitle } from '../../../components/EventTitle'
import { PageLayout } from '../../../components/PageLayout'
import { SuccessPageWaves } from '../../../components/SuccessPageWaves'
import { EventInfo, getEventInfo } from '../../../models/prisma/event'
import { Config } from '../../../utils/config'
import { getErrorPageProps, withErrorPage } from '../../../utils/withErrorPage'

export interface SuccessPageProps {
  phone: string
  checkInTimestamp: number
  checkOutTimestamp: number
  eventId: string
  role: string
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

function useCheckInTime(checkInTimestamp: number) {
  return useMemo(() => {
    const dm = format(checkInTimestamp, 'd LLLL', { locale: th })
    const y = `${parseInt(format(checkInTimestamp, 'yyyy')) + 543}`
    const hhmm = format(checkInTimestamp, 'kk:mm')
    return `${dm} ${y} เวลา ${hhmm} น.`
  }, [checkInTimestamp])
}

function useCheckInDuration(
  checkInTimestamp: number,
  checkOutTimestamp: number
) {
  return useMemo(() => {
    if (!checkInTimestamp || !checkOutTimestamp) {
      return null
    }
    const seconds = (checkOutTimestamp - checkInTimestamp) / 1000
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
  }, [checkInTimestamp, checkOutTimestamp])
}

const handleClick = async (phone, role, eventId, isCheckout) => {
  const data = {
    phone,
    eventId,
    role,
  }

  if (isCheckout) {
    await apiClient.checkIn(data)
  } else {
    await apiClient.checkOut(data)
  }

  Router.push(`/[eventId]/[role]/success`, `/${eventId}/${role}/success`)
}

function SuccessPage({
  phone,
  checkInTimestamp,
  checkOutTimestamp,
  eventId,
  role,
  eventInfo,
}: SuccessPageProps) {
  const classes = useStyles()
  const isCheckOut = !!checkOutTimestamp

  const checkInTime = useCheckInTime(checkInTimestamp)
  const checkInDuration = useCheckInDuration(
    checkInTimestamp,
    checkOutTimestamp
  )

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
            role={role}
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
          <Button
            className={classes.button}
            type="submit"
            variant="contained"
            color="primary"
            disableElevation
            onClick={() => handleClick(phone, role, eventId, isCheckOut)}
          >
            {isCheckOut ? 'เช็คอินอีกครั้ง' : 'เช็คเอาท์'}
          </Button>
        </div>
      </PageLayout>
    </EventProvider>
  )
}

export default withErrorPage(SuccessPage, { ensureEventExists: true })

export const getServerSideProps = getErrorPageProps<SuccessPageProps>(
  async ({ query, req, res }) => {
    const { eventId, role } = query as Record<string, string>
    const eventInfo = await getEventInfo(eventId)
    const config = new Config(req, res)
    const phone = config.get('core', 'phone')
    const { checkInTimestamp, checkOutTimestamp } = config.getNamespace(eventId)
    if (!phone || !checkInTimestamp) {
      return {
        unstable_redirect: {
          permanent: false,
          destination: `/${eventId}/${role}`,
        },
      }
    }
    return {
      props: {
        phone,
        checkInTimestamp,
        checkOutTimestamp,
        eventId,
        role,
        eventInfo,
      },
    }
  }
)

import { Button, makeStyles } from '@material-ui/core'
import Head from 'next/head'
import Router from 'next/router'
import { useCallback } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { check } from '../api/check'
import { queryLast } from '../api/queryLast'
import { CheckInFormWaves } from '../components/CheckInFormWaves'
import { EventProvider } from '../components/EventProvider'
import { EventTitle } from '../components/EventTitle'
import { PageLayout } from '../components/PageLayout'
import { PhoneField } from '../components/PhoneField'
import { EventInfo, getEventInfo } from '../models/redis/event'
import { Config } from '../utils/config'
import { phoneRegex, useEventType } from '../utils/frontend-utils'
import { parseEventId } from '../utils/types'
import { getErrorPageProps, withErrorPage } from '../utils/withErrorPage'

interface CheckInPageProps {
  initialPhone: string
  eventIdAndType: string
  eventInfo: EventInfo
}

const useStyles = makeStyles({
  checkInHint: {
    paddingTop: 80,
    fontSize: 18,
    fontWeight: 'normal',
    textAlign: 'center',
    margin: 0,
  },
  textField: {
    fontFamily: 'Noto Sans Thai',
  },
  inputContainer: {
    height: 88,
    marginTop: 50,
  },
  buttonContainer: {
    textAlign: 'center',
  },
})

// TODO: use this page for checkin/checkout only, and move the form to another page
function CheckInPage({
  initialPhone,
  eventIdAndType,
  eventInfo,
}: CheckInPageProps) {
  const classes = useStyles()
  const methods = useForm({
    reValidateMode: 'onChange',
  })
  const type = useEventType(eventIdAndType, Object.keys(eventInfo.roles)[0])

  const onSubmit = useCallback(async (data) => {
    Router.push(
      `/[eventIdAndType]?phone=${data.phone}`,
      `/${eventIdAndType}?phone=${data.phone}`
    )
  }, [])

  return (
    <EventProvider eventInfo={eventInfo}>
      <Head>
        <title>เช็คอินเข้างาน {eventInfo.name}</title>
      </Head>
      <PageLayout wavesComponent={CheckInFormWaves}>
        <h3 className={classes.checkInHint}>เช็คอินเข้างาน:</h3>
        <EventTitle eventInfo={eventInfo} type={type} />
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className={classes.inputContainer}>
              <PhoneField
                defaultValue={initialPhone || ''}
                phoneError={!!initialPhone}
              />
            </div>
            <div className={classes.buttonContainer}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disableElevation
              >
                เช็คอิน!
              </Button>
            </div>
          </form>
        </FormProvider>
      </PageLayout>
    </EventProvider>
  )
}

export default withErrorPage(CheckInPage, { ensureEventExists: true })

export const getServerSideProps = getErrorPageProps<CheckInPageProps>(
  async ({ query, req, res }) => {
    const eventIdAndType = query.eventIdAndType as string
    const { eventId, type } = parseEventId(eventIdAndType)
    const eventInfo = await getEventInfo(eventId)
    const inputPhone = query.phone as string | undefined
    const config = new Config(req, res)
    const phone = inputPhone || config.get('core', 'phone')
    let initialPhone: string = null

    if (phone && phone.match(phoneRegex)) {
      const action = query.action as string | undefined
      let searchAction = undefined
      if (action === 'checkout') {
        // only search for check in action if user wants to check out
        searchAction = 1
      } else if (action === 'checkin') {
        searchAction = 0
      }
      const lastResult = await queryLast(eventId, phone, type, searchAction)
      // check out if last action is check in
      const checkIn = lastResult?._value !== 1
      const currentDate = await check(eventId, phone, type, checkIn ? 1 : 0)
      const time = currentDate.getTime()
      config.set('core', 'phone', phone)
      config.set(
        eventId,
        'checkInDate',
        checkIn ? time : lastResult._time.getTime()
      )
      config.set(eventId, 'checkOutDate', checkIn ? null : time)
      return {
        unstable_redirect: {
          permanent: false,
          destination: `/${eventIdAndType}/success`,
        },
      }
    } else if (phone) {
      initialPhone = phone
    }
    config.getNamespace(eventId)
    return {
      props: {
        initialPhone,
        eventIdAndType,
        eventInfo,
      },
    }
  }
)

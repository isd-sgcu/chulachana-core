import { getInfo } from '../api/getinfo'
import { EventProvider } from '../components/EventProvider'
import { EventInfoDto, parseEventId } from '../utils/types'
import { useEventType } from '../utils/frontend-utils'
import { getErrorPageProps, withErrorPage } from '../utils/withErrorPage'
import { PageLayout } from '../components/PageLayout'
import { EventTitle } from '../components/EventTitle'
import { CheckInFormWaves } from '../components/CheckInFormWaves'
import { makeStyles, Button } from '@material-ui/core'
import { Controller, useForm } from 'react-hook-form'
import { useCallback } from 'react'
import { NumberTextField } from '../components/NumberTextField'
import Router from 'next/router'
import Cookies from 'cookies'
import { check } from '../api/check'
import { queryLast } from '../api/queryLast'

const phoneRegex = /^[0-9]{9,10}$/

interface CheckInPageProps {
  eventIdAndType: string
  eventInfo: EventInfoDto
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
    marginTop: 50,
    fontFamily: 'Noto Sans Thai',
  },
  buttonContainer: {
    paddingTop: 48,
    textAlign: 'center',
  },
})

// TODO: use this page for checkin/checkout only, and move the form to another page
function CheckInPage({ eventIdAndType, eventInfo }: CheckInPageProps) {
  const classes = useStyles()
  const { control, errors, handleSubmit } = useForm({
    reValidateMode: 'onChange',
  })
  const type = useEventType(eventIdAndType)

  const phoneError = !!errors.phone

  const onSubmit = useCallback(async (data) => {
    Router.push(
      `/[eventIdAndType]?phone=${data.phone}`,
      `/${eventIdAndType}?phone=${data.phone}`
    )
  }, [])

  return (
    <EventProvider eventInfo={eventInfo}>
      <PageLayout wavesComponent={CheckInFormWaves}>
        <h3 className={classes.checkInHint}>เช็คอินเข้างาน:</h3>
        <EventTitle eventInfo={eventInfo} type={type} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="phone"
            control={control}
            rules={{ required: true, pattern: phoneRegex }}
            defaultValue=""
            render={(controllerProps) => (
              <NumberTextField
                {...controllerProps}
                value={controllerProps.value || ''}
                name="phone"
                className={classes.textField}
                label="หมายเลขโทรศัพท์"
                autoComplete="tel"
                type="tel"
                variant="outlined"
                size="small"
                error={phoneError}
                helperText={
                  phoneError ? 'หมายเลขโทรศัพท์ไม่ถูกต้อง' : undefined
                }
                autoFocus
                fullWidth
              />
            )}
          />
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
      </PageLayout>
    </EventProvider>
  )
}

export default withErrorPage(CheckInPage)

export const getServerSideProps = getErrorPageProps<CheckInPageProps>(
  async ({ query, req, res }) => {
    const eventIdAndType = query.eventIdAndType as string
    const { eventId, type } = parseEventId(eventIdAndType)
    const eventInfo = await getInfo(eventId)
    const inputPhone = query.phone as string | undefined
    const cookies = new Cookies(req, res)
    const phone = inputPhone || cookies.get('phone')

    if (phone && phone.match(phoneRegex)) {
      const action = query.action as string | undefined
      let searchAction = undefined
      if (action === 'checkout') {
        // only search for check in action if user wants to check out
        searchAction = 'checkin'
      } else if (action === 'checkin') {
        searchAction = 'checkout'
      }
      const lastResult = await queryLast(eventId, phone, type, searchAction)
      // check out if last action is check in
      const checkIn = lastResult?.action !== 'checkin'
      const currentDate = await check(eventId, phone, type, checkIn)
      const time = `${currentDate.getTime()}`
      cookies.set('phone', phone)
      cookies.set(
        'checkInDate',
        checkIn ? time : `${lastResult._time.getTime()}`
      )
      cookies.set('checkOutDate', checkIn ? undefined : time)
      return {
        unstable_redirect: {
          permanent: false,
          destination: `/${eventIdAndType}/success`,
        },
      }
    }
    return {
      props: {
        eventIdAndType,
        eventInfo,
      },
    }
  }
)

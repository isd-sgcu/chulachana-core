import {
  Button,
  FormControl,
  FormControlLabel,
  makeStyles,
  Radio,
  RadioGroup,
} from '@material-ui/core'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { getInfo } from '../../api/getinfo'
import { EventProvider } from '../../components/EventProvider'
import { PageLayout } from '../../components/PageLayout'
import { PhoneField } from '../../components/PhoneField'
import { Config } from '../../utils/config'
import { ApiError, EventInfoDto } from '../../utils/types'
import { personTypeNames } from '../../utils/frontend-utils'
import { useCallback, useRef, useState } from 'react'
import Axios from 'axios'
import Head from 'next/head'
import { getErrorPageProps, withErrorPage } from '../../utils/withErrorPage'

const client = Axios.create({ withCredentials: true })

interface StaffCheckInProps {
  eventId: string
  eventInfo: EventInfoDto
}

const useStyles = makeStyles({
  textField: {
    marginTop: 8,
    marginBottom: 16,
  },
})

function StaffCheckIn({ eventId, eventInfo }: StaffCheckInProps) {
  const classes = useStyles()
  const methods = useForm({
    reValidateMode: 'onChange',
  })
  const { setValue } = methods
  const isCheckIn = useRef(true)
  const formRef = useRef(null as HTMLFormElement)
  const [loading, setLoading] = useState(false)

  const onSubmit = useCallback(
    async (data) => {
      if (loading) return
      setLoading(true)
      try {
        const checkIn = isCheckIn.current
        if (checkIn) {
          await client.post('/api/checkin', {
            eventid: eventId,
            ...data,
            checkIn,
          })
        } else {
          await client.post('/api/checkout', {
            eventid: eventId,
            ...data,
            checkIn,
          })
        }
        alert(`Checked ${checkIn ? 'in' : 'out'} ${data.phone} as ${data.type}`)
        setValue('phone', '')
      } catch (err) {
        alert(`error ${err.response?.status}`)
      } finally {
        setLoading(false)
      }
      isCheckIn.current = true
    },
    [loading, setValue, eventId]
  )

  const submit = methods.handleSubmit(onSubmit)

  const checkInClick = () => {
    isCheckIn.current = true
    submit()
  }

  const checkOutClick = () => {
    isCheckIn.current = false
    submit()
  }

  return (
    <EventProvider eventInfo={eventInfo} isStaff>
      <Head>
        <title>Staff {eventInfo.name}</title>
      </Head>
      <PageLayout style={{ padding: 16 }}>
        <h1 style={{ margin: 0 }}>{eventInfo.name}</h1>
        <FormProvider {...methods}>
          <form ref={formRef} onSubmit={submit}>
            <FormControl component="fieldset">
              <Controller
                name="type"
                control={methods.control}
                defaultValue="normal"
                render={(controllerProps) => (
                  <RadioGroup {...controllerProps}>
                    <FormControlLabel
                      value="normal"
                      control={<Radio disabled={loading} />}
                      label={personTypeNames['normal']}
                    />
                    <FormControlLabel
                      value="staff"
                      control={<Radio disabled={loading} />}
                      label={personTypeNames['staff']}
                    />
                    <FormControlLabel
                      value="shop"
                      control={<Radio disabled={loading} />}
                      label={personTypeNames['shop']}
                    />
                  </RadioGroup>
                )}
              />
            </FormControl>
            <PhoneField
              className={classes.textField}
              defaultValue=""
              disabled={loading}
            />
            <Button
              variant="contained"
              color="primary"
              disableElevation
              onClick={checkInClick}
            >
              เช็คอิน
            </Button>
            <div style={{ display: 'inline-block', width: 8 }} />
            <Button variant="outlined" color="primary" onClick={checkOutClick}>
              เช็คเอาท์
            </Button>
          </form>
        </FormProvider>
      </PageLayout>
    </EventProvider>
  )
}

export default withErrorPage(StaffCheckIn)

export const getServerSideProps = getErrorPageProps<StaffCheckInProps>(
  async ({ query, req, res }) => {
    const eventId = query.eventId as string
    const eventInfo = await getInfo(eventId)
    const config = new Config(req, res)
    if (!config.get(eventId, 'isStaff')) {
      throw new ApiError(403, 'not staff')
    }
    return { props: { eventId, eventInfo } }
  }
)

import { Button, makeStyles } from '@material-ui/core'
import { CircularProgress, Divider } from '@mui/material'
import Head from 'next/head'
import Router from 'next/router'
import React, { useCallback, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { apiClient } from '../../../axios/client'
import { CheckInFormWaves } from '../../../components/CheckInFormWaves'
import { EventProvider } from '../../../components/EventProvider'
import { EventTitle } from '../../../components/EventTitle'
import { FacultyField } from '../../../components/FacultyField'
import { NameField } from '../../../components/NameField'
import { PageLayout } from '../../../components/PageLayout'
import { PhoneField } from '../../../components/PhoneField'
import { YearField } from '../../../components/YearField'
import { EventInfo, getEventInfo } from '../../../models/prisma/event'
import { Config } from '../../../utils/config'
import { CheckInData } from '../../../utils/types'
import { getErrorPageProps, withErrorPage } from '../../../utils/withErrorPage'

interface CheckInPageProps {
  eventId: string
  role: string
  eventInfo: EventInfo
  phone: string
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
  container: {
    height: '100%',
  },
  inputContainer: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'column',
    rowGap: 10,
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'row',
    columnGap: 10,
  },
  buttonContainer: {
    marginTop: 15,
    textAlign: 'center',
  },
  spinner: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: 80,
  },
})

// TODO: use this page for checkin/checkout only, and move the form to another page
function CheckInPage({ eventId, role, eventInfo, phone }: CheckInPageProps) {
  const classes = useStyles()
  const methods = useForm({
    reValidateMode: 'onChange',
  })

  const [isReady, setIsReady] = React.useState<boolean>(false)

  //FIXME: component render before response complete validate
  useEffect(() => {
    const checkIn = async () => {
      const res = await apiClient.checkIn({
        eventId,
        role,
        phone,
      })

      if (res.data.checkIn || res.status === 403) {
        Router.push('/[eventId]/[role]/success', `/${eventId}/${role}/success`)
      } else {
        setIsReady(true)
      }
    }
    checkIn()
  }, [])

  const onSubmit = useCallback(async (data: CheckInData) => {
    const res = await apiClient.checkIn({
      eventId,
      role,
      phone: data.phone,
      name: data.name,
      faculty: data.faculty,
      year: data.year,
    })
    if (!res.data.checkIn) {
      //TODO: Display the error message on UI
      console.log(res.data)
    }

    Router.push('/[eventId]/[role]/success', `/${eventId}/${role}/success`)
  }, [])

  return (
    <EventProvider eventInfo={eventInfo}>
      <Head>
        <title>เช็คอินเข้างาน {eventInfo.name}</title>
      </Head>
      <PageLayout wavesComponent={CheckInFormWaves}>
        <h3 className={classes.checkInHint}>เช็คอินเข้างาน</h3>
        <EventTitle eventInfo={eventInfo} role={role} />
        {isReady ? (
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className={classes.inputContainer}>
                <PhoneField />
                <NameField />
                <Divider textAlign="left">เฉพาะนิสิต</Divider>
                <div className={classes.subContainer}>
                  <FacultyField />
                  <YearField />
                </div>
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
        ) : (
          <div className={classes.spinner}>
            <CircularProgress />
          </div>
        )}
      </PageLayout>
    </EventProvider>
  )
}

export default withErrorPage(CheckInPage, { ensureEventExists: true })

export const getServerSideProps = getErrorPageProps<CheckInPageProps>(
  async ({ query, req, res }) => {
    const { eventId, role } = query as Record<string, string>
    const eventInfo = await getEventInfo(eventId)
    const config = new Config(req, res)
    let phone = config.get('core', 'phone') || null

    const check = eventInfo.roles.find((item) => item.slug === role)

    if (!check) {
      return {
        unstable_redirect: {
          permanent: false,
          destination: `/notfound`,
        },
      }
    }

    return {
      props: {
        eventId,
        role,
        eventInfo,
        phone,
      },
    }
  }
)

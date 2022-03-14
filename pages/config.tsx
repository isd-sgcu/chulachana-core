import { TextField } from '@material-ui/core'
import Head from 'next/head'
import { PageLayout } from '../components/PageLayout'
import { ensureEventExists } from '../models/prisma/event'
import { Config, CoreConfig, EventConfig } from '../utils/config'
import { ApiError } from '../utils/types'
import { getErrorPageProps, withErrorPage } from '../utils/withErrorPage'

interface ConfigPageProps {
  coreConfig: Partial<CoreConfig>
  eventConfigs: Record<string, Partial<EventConfig>>
}

function EventConfigSection({
  eventId,
  eventConfig,
}: {
  eventId: string
  eventConfig: Partial<EventConfig>
}) {
  return (
    <>
      <hr />
      <h1 style={{ margin: 0 }}>{eventId}</h1>
      <pre>{JSON.stringify(eventConfig, null, 2)}</pre>
      <form>
        <input name="eventId" value={eventId} type="hidden" />
        <TextField
          name="staffKey"
          variant="outlined"
          size="small"
          label="Staff key"
          fullWidth
        />
      </form>
    </>
  )
}

function ConfigPage({ coreConfig, eventConfigs }: ConfigPageProps) {
  return (
    <>
      <Head>
        <title>Config</title>
      </Head>
      <PageLayout style={{ padding: 16 }}>
        <h1 style={{ margin: 0 }}>Core config</h1>
        <pre>{JSON.stringify(coreConfig, null, 2)}</pre>
        {Object.keys(eventConfigs).map((eventId) => (
          <EventConfigSection
            key={eventId}
            eventId={eventId}
            eventConfig={eventConfigs[eventId]}
          />
        ))}
      </PageLayout>
    </>
  )
}

export default withErrorPage(ConfigPage)

export const getServerSideProps = getErrorPageProps<ConfigPageProps>(
  async ({ query, req, res }) => {
    const config = new Config(req, res)
    const eventId = query.eventId as string
    if (eventId) {
      try {
        ensureEventExists(eventId)
      } catch {
        return {
          unstable_redirect: {
            permanent: false,
            destination: `/config`,
          },
        }
      }
      if (query.staffKey !== `staff ${eventId}`) {
        throw new ApiError(403, 'Wrong staff key')
      }
      const isStaff = config.get(eventId, 'isStaff') === true
      config.set(eventId, 'isStaff', !isStaff)
      return {
        unstable_redirect: {
          permanent: false,
          destination: `/config`,
        },
      }
    }
    const coreConfig = { ...config.getNamespace('core') }
    const events = coreConfig.events || []
    const eventConfigs = {}
    events.forEach((event) => {
      eventConfigs[event] = config.getNamespace(event)
    })
    delete coreConfig['events']
    return { props: { coreConfig, eventConfigs } }
  }
)

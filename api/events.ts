import { organization, bucketPrefix, client } from '../utils/db_env'
import { EventEntry } from '../utils/types'
import { getInfo } from './getinfo'
import pMemoize from 'p-memoize'

async function getAllEventsInternal(): Promise<EventEntry[]> {
  const queryApi = client.getQueryApi(organization)
  const query = `
  buckets()
    |> filter(fn: (r) => r.name =~ /^${bucketPrefix}/)
  `
  const rows: any[] = await queryApi.collectRows(query)
  const infos = await Promise.all(
    rows
      .map((row) => row.name.substring(bucketPrefix.length))
      .map(async (name) => ({ name, info: await getInfo(name) }))
  )
  return infos
}

export const getAllEvents = pMemoize(getAllEventsInternal, { maxAge: 3600000 })

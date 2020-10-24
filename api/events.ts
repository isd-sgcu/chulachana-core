import { organization, bucketPrefix, client } from '../utils/db_env'
import { EventEntry } from '../utils/types'
import { getInfo } from './getinfo'

async function getAllEventsInternal(): Promise<EventEntry[]> {
  const queryApi = client.getQueryApi(organization)
  const query = `
  buckets()
    |> filter(fn: (r) => r.name =~ /^${bucketPrefix}/)
  `
  try {
    const rows: any[] = await queryApi.collectRows(query)
    const infos = await Promise.all(
      rows
        .map((row) => row.name.substring(bucketPrefix.length))
        .map(async (name) => ({ name, info: await getInfo(name) }))
    )
    return infos
  } catch (err) {
    return null
  }
}

let promise: Promise<EventEntry[]> = null

export async function getAllEvents(): Promise<EventEntry[]> {
  if (promise == null) {
    promise = getAllEventsInternal()
  }
  return promise
}

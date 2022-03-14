import pMemoize from 'p-memoize'
import { influxClient } from '../models/clients'
import { config } from '../utils/env'
import { EventEntry } from '../utils/types'
import { getInfo } from './getinfo'

async function getAllEventsInternal(): Promise<EventEntry[]> {
  const queryApi = influxClient.getQueryApi(config.influx.organization)
  const query = `
  buckets()
    |> filter(fn: (r) => r.name =~ /^${config.influx.bucketPrefix}/)
  `
  const rows: any[] = await queryApi.collectRows(query)
  const infos = await Promise.all(
    rows
      .map((row) => row.name.substring(config.influx.bucketPrefix.length))
      .map(async (name) => ({ name, info: await getInfo(name) }))
  )
  return infos
}

export const getAllEvents = pMemoize(getAllEventsInternal, { maxAge: 3600000 })

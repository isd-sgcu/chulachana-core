import { parseISO } from 'date-fns'
import { influxClient } from '../models/clients'
import { config } from '../utils/env'
import { PointUserDto } from '../utils/types'

export async function queryLast(
  eventid: string,
  phone: string,
  type: string,
  inEvent?: 0 | 1
): Promise<PointUserDto> {
  const queryApi = influxClient.getQueryApi(config.influx.organization)
  const inEventQuery =
    inEvent !== undefined
      ? `and r["_field"] == "in_event" and r["_value"] == ${inEvent}`
      : ''
  const query = `
  from(bucket: "${config.influx.bucketPrefix + eventid}")
    |> range(start: 0, stop: now())
    |> filter(fn: (r) => r["_measurement"] == "user" and r["phone"] == "${phone}" and r["type"] == "${type}" ${inEventQuery})
    |> group()
    |> last()
    |> yield()
  `
  try {
    const rows = await queryApi.collectRows(query)
    const res = rows[rows.length - 1] as PointUserDto
    res._time = parseISO(res._time as unknown as string)
    return res
  } catch (err) {
    return null
  }
}

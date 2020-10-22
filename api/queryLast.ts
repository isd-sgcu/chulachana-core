import { PointUserDto } from '../utils/types'
import { organization, bucketPrefix, client } from '../utils/db_env'
import { parseISO } from 'date-fns'

export async function queryLast(
  eventid: string,
  phone: string,
  type: string,
  action: string
): Promise<PointUserDto> {
  const queryApi = client.getQueryApi(organization)
  const query = `
  from(bucket: "${bucketPrefix + eventid}")
    |> range(start: 0, stop: now())
    |> filter(fn: (r) => r["_measurement"] == "user" and r["phone"] == "${phone}" and r["type"] == "${type}" and r["action"] == "${action}")
    |> group()
    |> last()
    |> yield()
  `
  try {
    const rows = await queryApi.collectRows(query)
    const res = rows[rows.length - 1] as PointUserDto
    res._time = parseISO((res._time as unknown) as string)
    return res
  } catch (err) {
    return null
  }
}

export async function queryLastWithoutCheckAction(
  eventid: string,
  phone: string,
  type: string
): Promise<PointUserDto> {
  const queryApi = client.getQueryApi(organization)
  const query = `
  from(bucket: "${bucketPrefix + eventid}")
    |> range(start: 0, stop: now())
    |> filter(fn: (r) => r["_measurement"] == "user" and r["phone"] == "${phone}" and r["type"] == "${type}")
    |> group()
    |> top(columns: ["_time"], n: 1)
    |> yield()
  `
  try {
    const rows = await queryApi.collectRows(query)
    const res = rows[rows.length - 1] as PointUserDto
    res._time = parseISO((res._time as unknown) as string)
    return res
  } catch (err) {
    return null
  }
}

import { PointUserDto } from '../utils/types'
import { organization, bucketPrefix, client } from '../utils/db_env'
import { parseISO } from 'date-fns'

export async function queryLast(
  eventid: string,
  phone: string,
  type: string,
  action?: string
): Promise<PointUserDto> {
  const queryApi = client.getQueryApi(organization)
  const optionalFilter = action ? `and r["action"] == "${action}"` : ``
  const query = `
  from(bucket: "${bucketPrefix + eventid}")
    |> range(start: 0, stop: now())
    |> filter(fn: (r) => r["_measurement"] == "user" and r["phone"] == "${phone}" and r["type"] == "${type}" ${optionalFilter})
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

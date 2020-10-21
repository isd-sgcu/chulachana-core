import { ApiError, PointUserDto } from '../utils/types'
import { organization, bucketPrefix, client } from '../utils/db_env'
import { HttpError } from '@influxdata/influxdb-client'

export async function queryLast(
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
    |> last()
    |> yield()
  `
  try {
    const rows = await queryApi.collectRows(query)
    const res = rows[rows.length - 1] as PointUserDto
    return res
  } catch (err) {
    return null
  }
}

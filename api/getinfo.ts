import { ApiError, PointInfoDto } from '../utils/types'
import { organization, bucketPrefix, client } from '../utils/db_env'
import { HttpError } from '@influxdata/influxdb-client'

export async function getInfo(eventid: string): Promise<unknown> {
  const queryApi = client.getQueryApi(organization)
  const query = `
  from(bucket: "${bucketPrefix + eventid}")
    |> range(start: 0, stop: now())
    |> filter(fn: (r) => r["_measurement"] == "info")
    |> group()
    |> yield()
  `
  const map = new Map()
  try {
    const rows = (await queryApi.collectRows(query)) as PointInfoDto[]
    rows.forEach((row) => {
      map.set(row._field, row._value)
    })
  } catch (e) {
    if (e instanceof HttpError && e.statusCode === 404) {
      throw new ApiError(404, 'EventID Not Found')
    }
    console.log(e)
    throw new ApiError(500, 'Internal Error')
  }
  return Object.fromEntries(map)
}

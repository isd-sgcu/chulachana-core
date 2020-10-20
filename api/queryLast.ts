import { ApiError, PointDto } from '../utils/types'
import { organization, bucketPrefix, client } from '../utils/db_env'
import { HttpError } from '@influxdata/influxdb-client'

export async function queryLast(
  eventid: string,
  phone: string,
  type: string
): Promise<PointDto> {
  const queryApi = client.getQueryApi(organization)
  const query = `
  from(bucket: "${bucketPrefix + eventid}")
    |> range(start: 0, stop: now())
    |> filter(fn: (r) => r["_measurement"] == "user" and r["phone"] == "${phone}" and r["type"] == "${type}")
    |> group()
    |> last()
    |> yield()
  `
  let res: PointDto
  queryApi.queryRows(query, {
    next(row, tableMeta) {
      res = tableMeta.toObject(row) as PointDto
    },
    error(e) {
      console.log(e)
      if (e instanceof HttpError && e.statusCode === 404) {
        console.log('EventID, Phone, or Type Not Found')
      }
    },
    complete() {
      console.log(res)
      return res
    },
  })
  console.log(res)
  return null
}

import { ApiError, EventInfoDto, PointInfoDto } from '../utils/types'
import { HttpError } from '@influxdata/influxdb-client'
import pMemoize from 'p-memoize'
import { influxClient } from '../utils/database'
import { config } from '../utils/env'

async function getInfoInternal(eventid: string): Promise<EventInfoDto> {
  const queryApi = influxClient.getQueryApi(config.influx.organization)
  const query = `
  from(bucket: "${config.influx.bucketPrefix + eventid}")
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
    console.log(`failed to get event ${eventid}: `, e)
    throw new ApiError(500, 'Internal Error')
  }
  return {
    name: map.get('name'),
    primaryColor: map.get('primary-color'),
    secondaryColor: map.get('secondary-color'),
  }
}

export const getInfo = pMemoize(getInfoInternal, { maxAge: 3600000 })

import { HttpError, Point } from '@influxdata/influxdb-client'
import { influxClient } from '../models/clients'
import { config } from '../utils/env'
import { ApiError, PointUserDto } from '../utils/types'

export async function check(
  eventid: string,
  phone: string,
  type: string,
  isCheckin: 0 | 1
): Promise<Date> {
  // Initialize
  const writeApi = influxClient.getWriteApi(
    config.influx.organization,
    config.influx.bucketPrefix + eventid,
    'ns'
  )

  // Data Assigning
  const pointDto = <PointUserDto>{
    _time: new Date(),
    _measurement: 'user',
    eventid: eventid,
    phone: phone,
    type: type,
    _field: 'in_event',
    _value: isCheckin,
  }

  const point = new Point(pointDto._measurement)
    .tag('phone', pointDto.phone)
    .tag('type', pointDto.type)
    .intField(pointDto._field, pointDto._value)
    .timestamp(pointDto._time)

  // Database Writing
  writeApi.writePoint(point)
  try {
    await writeApi.close()
  } catch (e) {
    if (e instanceof HttpError && e.statusCode === 404) {
      throw new ApiError(404, 'EventID Not Found')
    }
    throw new ApiError(500, 'Internal Error')
  }
  return pointDto._time
}

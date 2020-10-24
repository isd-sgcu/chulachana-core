import { ApiError, CheckDto, PointUserDto } from '../utils/types'
import { Point, HttpError } from '@influxdata/influxdb-client'
import { organization, bucketPrefix, client } from '../utils/db_env'

export async function check(
  eventid: string,
  phone: string,
  type: string,
  isCheckin: boolean
): Promise<Date> {
  // Initialize
  const writeApi = client.getWriteApi(
    organization,
    bucketPrefix + eventid,
    'ns'
  )

  // Data Assigning
  const pointDto = <PointUserDto>{
    _time: new Date(),
    _measurement: 'user',
    eventid: eventid,
    phone: phone,
    type: type,
    action: isCheckin ? 'checkin' : 'checkout',
    _field: 'in_event',
    _value: isCheckin ? 1 : 0,
  }

  const point = new Point(pointDto._measurement)
    .tag('action', pointDto.action)
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

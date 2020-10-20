import { ApiError, CheckDto, PointDto } from '../utils/types'
import { Point, HttpError } from '@influxdata/influxdb-client'
import { organization, bucketPrefix, client } from '../utils/db_env'
import { hostname } from 'os'

export async function check(body: CheckDto, isCheckin: boolean): Promise<Date> {
  const { eventid, phone, type } = body

  // Input Validation
  // TODO: Phone Number Validate
  // TODO: use a validation library
  if (!eventid || !phone || !type || !(type === 'normal' || type === 'staff')) {
    throw new ApiError(400, 'Invalid eventid, type, or phone number')
  }

  // Initialize
  const writeApi = client.getWriteApi(
    organization,
    bucketPrefix + eventid,
    'ns'
  )

  // Data Assigning
  const pointDto = <PointDto>{
    _time: new Date(),
    _measurement: 'user',
    _host: hostname(),
    _location: 'API',
    action: isCheckin ? 'checkin' : 'checkout',
    _field: 'in_event',
    _value: isCheckin,
  }

  writeApi.useDefaultTags({
    _host: pointDto._host,
    _location: pointDto._location,
    action: pointDto.action,
  })
  const point = new Point(pointDto._measurement)
    .tag('phone', pointDto.phone)
    .tag('type', pointDto.type)
    .booleanField(pointDto._field, pointDto._value)
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

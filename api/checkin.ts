import { ApiError, CheckInDto } from '../utils/types'
import { InfluxDB, Point, HttpError } from '@influxdata/influxdb-client'
import { databaseURL, organization, token, bucketPrefix } from '../utils/db_env'
import { hostname } from 'os'

export async function checkin(body: CheckInDto): Promise<Date> {
  const { eventid, phone, type } = body

  // Input Validation
  // TODO: Phone Number Validate
  // TODO: use a validation library
  if (!eventid || !phone || !type || !(type === 'normal' || type === 'staff')) {
    throw new ApiError(400, 'Invalid eventid, type, or phone number')
  }

  // Initialize
  const client = new InfluxDB({ url: databaseURL, token: token })
  const writeApi = client.getWriteApi(
    organization,
    bucketPrefix + eventid,
    'ns'
  )
  writeApi.useDefaultTags({
    _host: hostname(),
    _location: 'API',
    action: 'checkin',
  }) // Not sure if host & location tags should be included

  // Data Assigning
  const now = new Date()
  const point = new Point('user')
    .tag('phone', phone)
    .tag('type', type)
    .booleanField('in_event', true)
    .timestamp(now)

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
  return now
}

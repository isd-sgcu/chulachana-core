import { ApiError, CheckInDto } from '../utils/types'
import { Point } from '@influxdata/influxdb-client'
import { client, org, bucket } from '../utils/db_env'
import { hostname } from 'os'

export async function checkin(body: CheckInDto) {
  const { phone, type } = body
  // Input Validation
  // TODO: Phone Number Validate
  // TODO: use a validation library
  if (!phone || !type || !(type === 'normal' || type === 'staff')) {
    throw new ApiError(400, 'Invalid type or phone number')
  }

  // Initialize
  const writeApi = client.getWriteApi(org, bucket, 'ns')
  writeApi.useDefaultTags({
    host: hostname(),
    location: 'API',
    action: 'checkin',
  }) // Not sure if host & location tags should be included

  // Data Assigning
  const point = new Point('user')
    .tag('phone', phone)
    .tag('type', type)
    .booleanField('checked_in', true)
    .timestamp(new Date())

  // Database Writing
  writeApi.writePoint(point)
  try {
    await writeApi.close()
  } catch (e) {
    throw new ApiError(500, 'Internal Error')
  }
}

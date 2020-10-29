import pMemoize from 'p-memoize'
import { bucketPrefix, client, organization } from '../utils/env'
import {
  AllPersonType,
  ApiError,
  parseEventIdAllowAll,
  UserCountDto,
} from '../utils/types'

export async function countUsersInternal(eventIdAndType: string) {
  const { eventId, type } = parseEventIdAllowAll(eventIdAndType as string)
  const queryApi = client.getQueryApi(organization)
  const query = `
  from(bucket: "${bucketPrefix + eventId}")
    |> range(start: 0, stop: now())
    |> filter(fn: (r) => r["_measurement"] == "user")
    ${type !== 'all' ? `|> filter(fn: (r) => r["type"] == "${type}")` : ''}
    |> group(columns: ["host", "_measurement", "phone"], mode:"by")
    |> sort(columns: ["_time"], desc: false)
    |> last()
    |> group(columns: ["host", "_measurement"], mode:"by")
    |> sum(column: "_value")
    |> yield()
  `
  try {
    const rows = await queryApi.collectRows(query)
    const { _value: userCount } = rows[rows.length - 1] as UserCountDto
    return userCount
  } catch (err) {
    throw new ApiError(500, 'Error reading from database')
  }
}

export const countUsers = pMemoize(countUsersInternal, { maxAge: 5000})
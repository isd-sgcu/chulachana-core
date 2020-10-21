import { ApiError } from 'next/dist/next-server/server/api-utils'
export { ApiError }

export type PersonType = 'normal' | 'staff' | 'shop'

export interface CheckDto {
  eventid: string
  phone: string
  type: PersonType
}

export interface PointUserDto {
  _time: Date
  _measurement: 'user'
  eventid: string
  phone: string
  type: PersonType
  action: 'checkin' | 'checkout'
  _field: 'in_event'
  _value: boolean // Same as action, but functions as a field-value
}

export interface PointInfoDto {
  _time: Date
  _measurement: 'info'
  _field: string
  _value: string
}

export interface EventInfoDto {
  name: string
  primaryColor: string
  secondaryColor: string
}

export function parseEventId(eventIdAndType: string) {
  const parts = eventIdAndType.split('-')
  let type = 'normal'
  if (parts.length > 1) {
    type = parts[parts.length - 1]
    parts.pop()
  }
  const eventId = parts.join('-')
  if (!['normal', 'staff', 'shop'].includes(type)) {
    throw new ApiError(404, 'Unknown type')
  }
  return {
    eventId,
    type: type as PersonType,
  }
}

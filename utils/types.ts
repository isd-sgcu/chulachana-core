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
  _field: 'in_event'
  _value: 0 | 1 // 0 for checkin, 1 for checkout
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

export interface EventEntry {
  name: string
  info: EventInfoDto
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

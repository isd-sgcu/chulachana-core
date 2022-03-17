import { Role, Year } from '@prisma/client'
import { ApiError } from 'next/dist/next-server/server/api-utils'
import { FacultyID } from './enum'
export { ApiError }

export interface ErrorResponse {
  content: string
  statusCode: number
}

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

export interface UserInfo {
  phone: string
  name: string
  faculty?: FacultyID
  year?: Year
}

export interface Entry {
  _time: Date
  eventid: string
  phone: string
  name: string
  faculty: string
  role: Role
}

export interface CheckInData {
  phone: string
  name: string
  faculty: FacultyID
  year: Year
}

export interface UserCountDto {
  _measurement: 'user'
  _value: number
}

export type AllPersonType = 'all' | PersonType

export function parseEventId(
  eventIdAndType: string,
  defaultType: PersonType = 'normal'
) {
  const parts = eventIdAndType.split('-')
  let type = defaultType
  if (parts.length > 1) {
    type = parts[parts.length - 1] as PersonType
    parts.pop()
  }
  const eventId = parts.join('-')
  if (!['normal', 'staff', 'shop'].includes(type)) {
    throw new ApiError(404, 'Unknown type')
  }
  return {
    eventId,
    type,
  }
}

export function parseEventIdAllowAll(
  eventIdAndType: string,
  defaultType: AllPersonType = 'all'
) {
  const parts = eventIdAndType.split('-')
  let type = defaultType
  if (parts.length > 1) {
    type = parts[parts.length - 1] as AllPersonType
    parts.pop()
  }
  const eventId = parts.join('-')
  if (!['all', 'normal', 'staff', 'shop'].includes(type)) {
    throw new ApiError(404, 'Unknown type')
  }
  return {
    eventId,
    type,
  }
}

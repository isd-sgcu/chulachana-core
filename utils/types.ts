export { ApiError } from 'next/dist/next-server/server/api-utils'

export interface CheckDto {
  eventid: string
  phone: string
  type: 'normal' | 'staff' | 'shop'
}

export interface PointUserDto {
  _time: Date
  _measurement: 'user'
  eventid: string
  phone: string
  type: 'normal' | 'staff' | 'shop'
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

export { ApiError } from 'next/dist/next-server/server/api-utils'

export interface CheckDto {
  eventid: string
  phone: string
  type: 'normal' | 'staff'
}

export interface PointDto extends CheckDto {
  _time: Date
  _measurement: string
  _host: string
  _location: string
  action: 'checkin' | 'checkout'
  _field: 'in_event'
  _value: boolean // Same as action, but functions as a field-value
}

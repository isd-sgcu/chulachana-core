export { ApiError } from 'next/dist/next-server/server/api-utils'

export interface CheckInDto {
  eventid: string
  phone: string
  type: 'normal' | 'staff'
}

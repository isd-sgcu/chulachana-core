export { ApiError } from 'next/dist/next-server/server/api-utils'

export interface CheckInDto {
  phone: string
  type: 'normal' | 'staff'
}

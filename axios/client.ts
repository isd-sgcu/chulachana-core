import axios, { AxiosResponse } from 'axios'
import { CheckinDTO } from '../pages/api/checkin'
import { CheckOutDto } from '../pages/[eventId]/[role]/success'

const client = axios.create({ withCredentials: true })

export interface CheckInResponse {
  checkIn: Date
}

export interface CheckOutResponse {
  checkIn: Date
  checkOut: Date
}

const checkIn = async (
  checkInDto: CheckinDTO
): Promise<AxiosResponse<CheckInResponse>> => {
  const res = await client.post('/api/checkin', checkInDto)
  return res
}

const checkOut = async (
  checkOutDto: CheckOutDto
): Promise<AxiosResponse<CheckInResponse>> => {
  const res = await client.post('/api/checkout', checkOutDto)
  return res
}

export const apiClient = {
  checkIn,
  checkOut,
}

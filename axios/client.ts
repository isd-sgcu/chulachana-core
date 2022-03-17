import axios, { AxiosResponse } from 'axios'
import { CheckInDto } from '../pages/api/checkin'
import { CheckOutDto } from '../pages/api/checkout'

const client = axios.create({ withCredentials: true })

export interface CheckInResponse {
  checkIn: Date
}

export interface CheckOutResponse {
  checkIn: Date
  checkOut: Date
}

const checkIn = async (
  checkInDto: CheckInDto
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

const check = async (
  checkInDto: CheckInDto
): Promise<AxiosResponse<CheckOutResponse>> => {
  const res = await client.post('/api/check', checkInDto)
  return res
}

export const apiClient = {
  checkIn,
  checkOut,
  check,
}

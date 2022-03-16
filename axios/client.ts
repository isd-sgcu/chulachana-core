import axios, { AxiosResponse } from 'axios'
import { CheckinDTO } from '../pages/api/checkin'
import { CheckOutDto } from '../pages/[eventId]/[role]/success'
import { ErrorResponse } from '../utils/types'

const client = axios.create({ withCredentials: true })

export interface CheckInResponse {
  checkin: Date
}

export interface CheckOutResponse {
  checkin: Date
  checkout: Date
}

const checkIn = async (
  checkInDto: CheckinDTO
): Promise<CheckInResponse | ErrorResponse> => {
  try {
    const res: AxiosResponse<CheckInResponse> = await client.post(
      '/api/checkin',
      checkInDto
    )
    return res.data
  } catch (err) {
    return {
      content: err.response.data,
      statusCode: err.response.status,
    }
  }
}

const checkOut = async (
  checkOutDto: CheckOutDto
): Promise<CheckOutResponse | ErrorResponse> => {
  try {
    const res: AxiosResponse<CheckOutResponse> = await client.post(
      '/api/checkout',
      checkOutDto
    )
    return res.data
  } catch (err) {
    return {
      content: err.response.data,
      statusCode: err.response.status,
    }
  }
}

export const apiClient = {
  checkIn,
  checkOut,
}

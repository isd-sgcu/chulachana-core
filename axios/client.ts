import axios, { AxiosResponse } from 'axios'
import { CheckinDTO } from '../pages/api/checkin'
import { ErrorResponse } from '../utils/types'

const client = axios.create({ withCredentials: true })

export interface CheckInResponse {
  checkin: Date
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
      conent: err.response.data,
      statusCode: err.response.status,
    }
  }
}

export const apiClient = {
  checkIn,
}

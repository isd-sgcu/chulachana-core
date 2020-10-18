// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// InfluxDB Client Documentation: https://docs.influxdata.com/influxdb/v2.0/tools/client-libraries/js/
// InfluxDB Client Examples: https://github.com/influxdata/influxdb-client-js/tree/master/examples

import { ApiError, CheckInDto } from '../../utils/types'
import { checkin } from '../../api/checkin'
import { NextApiRequest, NextApiResponse } from 'next'

/*
 * Check In API
 * POST /api/checkin
 *
 * <--Request-->
 * Content-Type: application/json
 * Body: {
 *  phone: string
 *  type: string ("normal" / "staff")
 * }
 *
 * <--Response-->
 * Content-Type: application/json
 * Body: {
 *  message: string
 * }
 *
 * <--Status Code-->
 * 200: Success
 * 400: Bad Request
 * 404: Invalid Method
 * 500: Internal Server (When writing into database)
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const body = req.body as CheckInDto
    await checkin(body)
    res.send('Success')
  } else {
    // Other than POST Method
    throw new ApiError(404, 'Not Found')
  }
}

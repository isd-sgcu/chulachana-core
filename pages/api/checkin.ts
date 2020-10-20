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
 *  eventid: string
 *  phone: string
 *  type: string ("normal" / "staff")
 * }
 *
 * <--Response-->
 * Content-Type: application/json
 * Body: {
 *  date: Date    // Return Checkin Date&Time in ISO8601 Format (UTC)
 * }
 *
 * <--Status Code-->
 * 200: Success
 * 400: Bad Request
 * 404: Invalid Method, EventID Not Found
 * 500: Internal Server (When writing into database)
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const body = req.body as CheckInDto
    const checkinDate = await checkin(body)
    res.json({ date: checkinDate })
  } else {
    // Other than POST Method
    throw new ApiError(404, 'Not Found')
  }
}

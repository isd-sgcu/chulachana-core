// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// InfluxDB Client Documentation: https://docs.influxdata.com/influxdb/v2.0/tools/client-libraries/js/
// InfluxDB Client Examples: https://github.com/influxdata/influxdb-client-js/tree/master/examples

import { ApiError, CheckDto } from '../../utils/types'
import { check } from '../../api/check'
import { queryLast } from '../../api/queryLast'
import { NextApiRequest, NextApiResponse } from 'next'

/*
 * Check In API
 * POST /api/checkout
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
 *  checkin: Date       // Return Checkin Date&Time in ISO8601 Format (UTC)
 *  checkout: Date      // Return Checkout Date&Time in ISO8601 Format (UTC)
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
    const body = req.body as CheckDto
    let checkinDate: Date
    try {
      checkinDate = (await queryLast(body.eventid, body.phone, body.type))._time
    } catch (e) {
      checkinDate = null
    }
    const checkoutDate = await check(body, false)
    res.json({
      checkin: checkinDate,
      checkout: checkoutDate,
    })
  } else {
    // Other than POST Method
    throw new ApiError(404, 'Not Found')
  }
}

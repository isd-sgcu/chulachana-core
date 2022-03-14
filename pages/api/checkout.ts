// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// InfluxDB Client Documentation: https://docs.influxdata.com/influxdb/v2.0/tools/client-libraries/js/
// InfluxDB Client Examples: https://github.com/influxdata/influxdb-client-js/tree/master/examples

import { NextApiRequest, NextApiResponse } from 'next'
import validator from 'validator'
import { check } from '../../api/check'
import { getInfo } from '../../api/getinfo'
import { queryLast } from '../../api/queryLast'
import { Config } from '../../utils/config'
import { ApiError, CheckDto, PointUserDto } from '../../utils/types'

/*
 * Check In API
 * POST /api/checkout
 *
 * <--Request-->
 * Content-Type: application/json
 * Body: {
 *  eventid: string   // All alpha-numeric
 *  phone: string     // TH Mobile Phone format without dash (0xxxxxxxx)
 *  type: "normal" | "staff" | "shop"
 * }
 *
 * <--Response-->
 * Content-Type: application/json
 * Body: {
 *  checkin: Date | null    // Return Checkin Date&Time in ISO8601 Format (UTC) (null if the phone hadn't checkin once)
 *  checkout: Date          // Return Checkout Date&Time in ISO8601 Format (UTC)
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
    // Input Validation
    if (
      !body.eventid ||
      !validator.isAlphanumeric(body.eventid) ||
      !body.phone ||
      !validator.isMobilePhone(body.phone, 'th-TH', { strictMode: false }) ||
      !body.type ||
      !(body.type === 'normal' || body.type === 'staff' || body.type === 'shop')
    ) {
      throw new ApiError(400, 'Invalid eventid, type, or phone number')
    }

    const eventId = body.eventid
    await getInfo(eventId)
    const config = new Config(req, res)
    if (!config.get(eventId, 'isStaff')) {
      throw new ApiError(403, 'not staff')
    }

    const lastCheckinPoint = (await queryLast(
      body.eventid,
      body.phone,
      body.type,
      1
    )) as PointUserDto
    const checkinDate = lastCheckinPoint ? lastCheckinPoint._time : null
    const checkoutDate = await check(body.eventid, body.phone, body.type, 0)
    res.json({
      checkin: checkinDate,
      checkout: checkoutDate,
    })
  } else {
    // Other than POST Method
    throw new ApiError(404, 'Not Found')
  }
}

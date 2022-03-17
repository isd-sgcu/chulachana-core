// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// InfluxDB Client Documentation: https://docs.influxdata.com/influxdb/v2.0/tools/client-libraries/js/
// InfluxDB Client Examples: https://github.com/influxdata/influxdb-client-js/tree/master/examples

import { Entry } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import validator from 'validator'
import { check } from '../../../api/check'
import { findLatestEntryWithUser } from '../../../models/prisma/entry'
import { Config } from '../../../utils/config'
import { Type } from '../../../utils/enum'
import { ApiError } from '../../../utils/types'
import { CheckinDTO } from '../checkin'

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
    const checkinDto = req.body as CheckinDTO

    // Input Validation
    if (
      !checkinDto.phone ||
      !validator.isMobilePhone(checkinDto.phone, 'th-TH', {
        strictMode: false,
      })
    ) {
      throw new ApiError(400, 'Invalid eventid, type, or phone number')
    }

    const entry: Entry = await findLatestEntryWithUser(
      checkinDto.phone,
      checkinDto.eventId
    )

    if (entry.type === Type.OUT) {
      throw new ApiError(403, 'You have already checked out')
    }

    const checkinDate: Date = entry.timestamp
    const checkoutDate: Date = await check(checkinDto, Type.OUT)

    const config = new Config(req, res)
    const phone = checkinDto.phone || config.get('core', 'phone')

    config.set('core', 'phone', phone)
    config.set(checkinDto.eventId, 'checkOutTimestamp', checkoutDate.getTime())

    res.json({
      checkin: checkinDate,
      checkout: checkoutDate,
    })
  } else {
    // Other than POST Method
    throw new ApiError(404, 'Not Found')
  }
}

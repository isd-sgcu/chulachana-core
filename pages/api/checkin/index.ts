// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// InfluxDB Client Documentation: https://docs.influxdata.com/influxdb/v2.0/tools/client-libraries/js/
// InfluxDB Client Examples: https://github.com/influxdata/influxdb-client-js/tree/master/examples

import { NextApiRequest, NextApiResponse } from 'next'
import validator from 'validator'
import { check } from '../../../api/check'
import { findLatestEntryWithUser } from '../../../models/prisma/entry'
import { facultyList } from '../../../utils/constant'
import { Type } from '../../../utils/enum'
import { ApiError } from '../../../utils/types'

/*
 * Check In API
 * POST /api/checkin
 *
 * <--Request-->
 * Content-Type: application/json
 * Body: {
 *  eventid: string   // All alpha-numeric
 *  phone: string     // TH Mobile Phone format without dash (0xxxxxxxx)
 *  role: "visitor" | "staff" | "shop"
 * }
 *
 * <--Response-->
 * Content-Type: application/json
 * Body: {
 *  checkin: Date    // Return Checkin Date&Time in ISO8601 Format (UTC)
 * }
 *
 * <--Status Code-->
 * 200: Success
 * 400: Bad Request
 * 404: Invalid Method, EventID Not Found
 * 500: Internal Server (When writing into database)
 */

export interface CheckinDTO {
  eventId: string
  role: string
  phone: string
  name?: string
  faculty?: string
  year: number
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const checkinDto = req.body as CheckinDTO

    // Input Validation
    if (
      !checkinDto.eventId ||
      !validator.isAlphanumeric(checkinDto.eventId) ||
      !checkinDto.phone ||
      !validator.isMobilePhone(checkinDto.phone, 'th-TH', {
        strictMode: false,
      }) ||
      !facultyList[checkinDto.faculty] ||
      !(checkinDto.year > 0)
    ) {
      throw new ApiError(
        400,
        'Invalid eventid, role, name, faculty, year, or phone number'
      )
    }

    const entry = await findLatestEntryWithUser(checkinDto.phone)
    if (
      entry &&
      entry.type === Type.IN &&
      entry.eventId === checkinDto.eventId
    ) {
      throw new ApiError(
        403,
        'Cannot login to the event that you are already in'
      )
    }

    const checkinDate: Date = await check(checkinDto, Type.IN)
    res.json({ checkin: checkinDate })
  } else {
    // Other than POST Method
    throw new ApiError(404, 'Not Found')
  }
}
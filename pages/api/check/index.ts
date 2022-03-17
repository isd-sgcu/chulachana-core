// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// InfluxDB Client Documentation: https://docs.influxdata.com/influxdb/v2.0/tools/client-libraries/js/
// InfluxDB Client Examples: https://github.com/influxdata/influxdb-client-js/tree/master/examples

import { Year } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/next-server/server/api-utils'
import validator from 'validator'
import { check } from '../../../api/check'
import { findLatestEntryWithUser } from '../../../models/prisma/entry'
import { Config } from '../../../utils/config'
import { FacultyID, Type } from '../../../utils/enum'

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

export interface CheckInDto {
  eventId: string
  role: string
  phone: string
  name?: string
  faculty?: FacultyID
  year?: Year
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const checkinDto = req.body as CheckInDto

    // Input Validation
    if (
      !checkinDto.eventId ||
      !validator.isAlphanumeric(checkinDto.eventId) ||
      !checkinDto.phone ||
      !validator.isMobilePhone(checkinDto.phone, 'th-TH', {
        strictMode: false,
      })
    ) {
      throw new ApiError(
        400,
        'Invalid eventid, role, name, faculty, year, or phone number'
      )
    }

    const entry = await findLatestEntryWithUser(
      checkinDto.phone,
      checkinDto.eventId
    )

    const data = {
      eventId: checkinDto.eventId,
      role: checkinDto.role,
      phone: checkinDto.phone,
      name: checkinDto.name,
      faculty: checkinDto.faculty,
      year: checkinDto.year,
    }

    let checkInDate: Date = null
    let checkOutDate: Date = null

    if (entry && entry.type === Type.IN) {
      if (entry.role.slug !== checkinDto.role) {
        data.role = entry.role.slug
      }
      checkInDate = entry.timestamp
      checkOutDate = await check(data, Type.OUT)
    } else if (entry && entry.type === Type.OUT) {
      checkInDate = await check(data, Type.IN)
    }

    const config = new Config(req, res)

    config.set('core', 'phone', checkinDto.phone)
    config.set(checkinDto.eventId, 'checkInTimestamp', checkInDate.getTime())
    config.set(
      checkinDto.eventId,
      'checkOutTimestamp',
      checkOutDate ? checkOutDate.getTime() : null
    )

    res.json({ checkIn: checkInDate, checkOut: checkOutDate })
  } else {
    // Other than POST Method
    throw new ApiError(404, 'Not Found')
  }
}

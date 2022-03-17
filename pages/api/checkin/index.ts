// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// InfluxDB Client Documentation: https://docs.influxdata.com/influxdb/v2.0/tools/client-libraries/js/
// InfluxDB Client Examples: https://github.com/influxdata/influxdb-client-js/tree/master/examples

import { Year } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import validator from 'validator'
import { check } from '../../../api/check'
import { findLatestEntryWithUser } from '../../../models/prisma/entry'
import { Config } from '../../../utils/config'
import { FacultyID, Type } from '../../../utils/enum'
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

    if (
      entry &&
      entry.type === Type.IN &&
      entry.eventId === checkinDto.eventId
    ) {
      if (entry.role.slug !== checkinDto.role) {
        const data = {
          eventId: checkinDto.eventId,
          role: entry.role.slug,
          phone: checkinDto.phone,
          name: checkinDto.name,
          faculty: checkinDto.faculty,
          year: checkinDto.year,
        }
        await check(data, Type.OUT)
      } else {
        throw new ApiError(
          409,
          'You already checked in at this event. Please check out first.'
        )
      }
    }

    const checkinDate: Date = await check(checkinDto, Type.IN)

    const config = new Config(req, res)
    const phone = checkinDto.phone || config.get('core', 'phone')

    config.set('core', 'phone', phone)
    config.set(checkinDto.eventId, 'checkInTimestamp', checkinDate.getTime())
    config.set(checkinDto.eventId, 'checkOutTimestamp', null)

    res.json({ checkin: checkinDate })
  } else {
    // Other than POST Method
    throw new ApiError(404, 'Not Found')
  }
}

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

    if (entry && entry.type === Type.IN) {
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

    config.set('core', 'phone', checkinDto.phone)
    config.set(checkinDto.eventId, 'checkInTimestamp', checkinDate.getTime())
    config.set(checkinDto.eventId, 'checkOutTimestamp', null)

    res.json({ checkIn: checkinDate })
  } else {
    // Other than POST Method
    throw new ApiError(404, 'Not Found')
  }
}

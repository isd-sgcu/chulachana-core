import { EntryType, Role, User } from '@prisma/client'
import { ApiError } from 'next/dist/next-server/server/api-utils'
import { createEntry } from '../models/prisma/entry'
import { EventInfo, getEventInfo } from '../models/prisma/event'
import { createUser, findUserByPhone } from '../models/prisma/user'
import { CheckInDto } from '../pages/api/checkin'

export async function check(
  checkinDto: CheckInDto,
  type: EntryType
): Promise<Date> {
  const event: EventInfo = await getEventInfo(checkinDto.eventId)
  if (!event) {
    throw new ApiError(404, 'Event Not Found')
  }

  const role = event.roles.find((role) => role.slug === checkinDto.role)

  // Database Writing
  let user: User = await findUserByPhone(checkinDto.phone)

  if (!user) {
    if (!checkinDto.name) {
      throw new ApiError(400, 'Name is required')
    }
    user = await createUser({
      faculty: checkinDto.faculty,
      name: checkinDto.name,
      phone: checkinDto.phone,
      year: checkinDto.year,
    })
  }

  const entry = await createEntry(checkinDto, user, role as Role, type)

  return entry.timestamp
}

import { Entry, EntryType, Prisma, Role, User } from '@prisma/client'
import { createEntry, dtoToRawEntry } from '../models/prisma/entry'
import { EventInfo, getEventInfo } from '../models/prisma/event'
import { createUser, findUserByPhone } from '../models/prisma/user'
import { CheckinDTO } from '../pages/api/checkin'
import { ApiError, UserInfo } from '../utils/types'

export async function check(
  checkinDto: CheckinDTO,
  type: EntryType
): Promise<Date> {
  // Initialize
  const userInfo: UserInfo = {
    faculty: checkinDto.faculty,
    name: checkinDto.name,
    phone: checkinDto.phone,
    year: checkinDto.year,
  }

  const event: EventInfo = await getEventInfo(checkinDto.eventId)
  if (!event) {
    throw new ApiError(404, 'Event Not Found')
  }

  const role = event.roles.find((role) => role.slug === checkinDto.role)

  // Database Writing
  let user: User
  try {
    user = await createUser(userInfo)
  } catch (err) {
    user = await findUserByPhone(checkinDto.phone)
  }

  const entryInfo: Prisma.EntryCreateInput = await dtoToRawEntry(
    checkinDto,
    user,
    role as Role,
    type
  )

  const entry: Entry = await createEntry(entryInfo)

  return new Date(entry.timestamp * 1000)
}

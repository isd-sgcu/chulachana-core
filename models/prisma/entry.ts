import { Entry, EntryType, Prisma, Role, User } from '@prisma/client'
import { CheckinDTO } from '../../pages/api/checkin'
import { prisma } from '../clients'

export async function createEntry(
  entryInfo: Prisma.EntryCreateInput
): Promise<Entry> {
  const entry: Entry = await prisma.entry.create({ data: entryInfo })
  return entry
}

export async function findLatestEntryWithUser(phone: string) {
  const entry = await prisma.entry.findFirst({
    orderBy: {
      timestamp: 'desc',
    },
    where: {
      user: {
        phone,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          phone: true,
          year: true,
          faculty: true,
        },
      },
    },
  })
  return entry
}

export async function dtoToRawEntry(
  checkInDto: CheckinDTO,
  user: User,
  role: Role,
  type: EntryType
): Promise<Prisma.EntryCreateInput> {
  const entryInfo: Prisma.EntryCreateInput = {
    user: {
      connect: {
        id: user.id,
      },
    },
    event: {
      connect: {
        id: checkInDto.eventId,
      },
    },
    role: {
      connect: {
        id: role.id,
      },
    },
    timestamp: new Date(),
    type: type,
  }
  return entryInfo
}

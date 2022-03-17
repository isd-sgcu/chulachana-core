import { Entry, EntryType, Prisma, Role, User } from '@prisma/client'
import { CheckInDto } from '../../pages/api/checkin'
import { prisma } from '../clients'

export async function createEntry(
  checkInDto: CheckInDto,
  user: User,
  role: Role,
  type: EntryType
): Promise<Entry> {
  const userInEventOperation =
    type === EntryType.IN
      ? prisma.userInEvent.create({
          data: {
            userId: user.id,
            eventId: checkInDto.eventId,
            roleId: role.id,
          },
        })
      : prisma.userInEvent.delete({
          where: {
            userId_eventId: {
              userId: user.id,
              eventId: checkInDto.eventId,
            },
          },
        })

  const [entry, userInEvent] = await prisma.$transaction([
    prisma.entry.create({
      data: {
        userId: user.id,
        eventId: checkInDto.eventId,
        roleId: role.id,
        type,
      },
    }),
    userInEventOperation,
  ])
  return entry
}

export async function findLatestEntryWithUser(phone: string, eventId: string) {
  const entry = await prisma.entry.findFirst({
    orderBy: {
      timestamp: 'desc',
    },
    where: {
      eventId,
      user: {
        phone,
      },
    },
    include: {
      user: true,
      role: {
        select: {
          slug: true,
        },
      },
    },
  })
  return entry
}

export async function dtoToRawEntry(
  checkInDto: CheckInDto,
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
    type,
  }
  return entryInfo
}

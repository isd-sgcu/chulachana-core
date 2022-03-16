import { Event } from '@prisma/client'
import { ApiError } from '../../utils/types'
import { prisma } from '../clients'

export type EventInfo = Event & {
  roles: {
    slug: string
    name: string
  }[]
}

export async function getEvents(): Promise<EventInfo[]> {
  const events = await prisma.event.findMany({
    include: {
      roles: {
        select: {
          slug: true,
          name: true,
        },
      },
    },
  })
  return events
}

export async function getEventInfo(eventId: string): Promise<EventInfo> {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      roles: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
    },
  })
  return event
}

export async function ensureEventExists(eventId: string) {
  const event = await prisma.event.count({
    where: {
      id: eventId,
    },
  })
  if (event == 0) {
    throw new ApiError(404, `Event ${eventId} does not exist`)
  }
}

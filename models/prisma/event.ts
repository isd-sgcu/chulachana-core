import { Event } from '@prisma/client'
import { prisma } from '../clients'

export type EventInfo = Event & {
  roles: {
    id: number
    slug: string
    name: string
  }[]
}

export async function getEvents(): Promise<EventInfo[]> {
  const events = await prisma.event.findMany({
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
    throw new Error(`Event ${eventId} does not exist`)
  }
}

export async function countCurrentUsers(eventId: string, roleId?: number) {
  const count = await prisma.userInEvent.count({
    where: {
      eventId,
      roleId,
    },
  })
  return count
}

import { Entry, EntryType, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function checkOut(
  eventId: string,
  userId: number,
  roleId: number
): Promise<Entry> {
  const [entry, userInEvent] = await prisma.$transaction([
    prisma.entry.create({
      data: {
        userId: userId,
        eventId: eventId,
        roleId: roleId,
        type: EntryType.OUT,
      },
    }),
    prisma.userInEvent.delete({
      where: {
        userId_eventId: {
          userId: userId,
          eventId: eventId,
        },
      },
    }),
  ])
  return entry
}

async function checkOutAll() {
  console.log('Checking out...')
  const UIEs = await prisma.userInEvent.findMany()
  for (const { eventId, userId, roleId } of UIEs) {
    await checkOut(eventId, userId, roleId)
    console.log('Checked out', userId, eventId)
  }
}

checkOutAll()

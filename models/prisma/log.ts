import { prisma } from '../clients'

export interface LogUserCountProps {
  eventId: string
  roleId: number
  count: number
  timestamp: Date
}

export async function createUserCountLog({
  eventId,
  roleId,
  count,
  timestamp,
}: LogUserCountProps) {
  const log = await prisma.userCountLog.create({
    data: {
      event: {
        connect: {
          id: eventId,
        },
      },
      role: {
        connect: {
          id: roleId,
        },
      },
      count,
      timestamp,
    },
  })
  return log
}

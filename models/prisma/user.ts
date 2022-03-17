import { Prisma, User } from '@prisma/client'
import { prisma } from '../clients'

export async function createUser(
  userInfo: Prisma.UserCreateInput
): Promise<User> {
  const user = await prisma.user.create({ data: userInfo })
  return user
}

export async function findUserByPhone(phone: string): Promise<User> {
  const user = await prisma.user.findUnique({ where: { phone } })
  return user
}

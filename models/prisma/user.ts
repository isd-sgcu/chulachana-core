import { User } from '@prisma/client'
import { UserInfo } from '../../utils/types'
import { prisma } from '../clients'

export async function createUser(userInfo: UserInfo): Promise<User> {
  const user = await prisma.user.create({ data: userInfo })
  return user
}

export async function findUserByPhone(phone: string): Promise<User> {
  const user = await prisma.user.findUnique({ where: { phone } })
  return user
}

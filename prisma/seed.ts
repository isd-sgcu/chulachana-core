import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  const event = await prisma.event.upsert({
    where: { id: 'mindmarket' },
    update: {},
    create: {
      id: 'mindmarket',
      name: 'Mind Market',
      primaryColor: '3744AC',
      secondaryColor: 'F2929D',
      roles: {
        create: [
          { slug: 'visitor', name: 'ผู้เข้าร่วมงาน' },
          { slug: 'staff', name: 'ผู้ปฏิบัติงาน' },
        ],
      },
    },
  })
}

seed()

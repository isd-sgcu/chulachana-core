import {
  Entry,
  EntryType,
  Event,
  PrismaClient,
  Role,
  User,
  UserInEvent,
  Year,
} from '@prisma/client'

const prisma = new PrismaClient()

interface CreateRoleProps {
  event: Event
  slug: string
  name: string
}

async function createRole({ event, slug, name }: CreateRoleProps) {
  const role = await prisma.role.create({
    data: {
      slug,
      name,
      event: { connect: { id: event.id } },
    },
  })
  return role
}

interface CreateUserProps {
  phone: string
  name: string
  faculty?: string
  year?: Year
}

async function upsertUser({ phone, name, faculty, year }: CreateUserProps) {
  const user = await prisma.user.upsert({
    where: { phone },
    create: {
      phone,
      name,
      faculty,
      year,
    },
    update: {},
  })
  return user
}

interface CheckProps {
  user: User
  event: Event
  role: Role
  type: EntryType
}

async function check({
  user,
  event,
  role,
  type,
}: CheckProps): Promise<[Entry, UserInEvent]> {
  const [entry, userInEvent] = await prisma.$transaction([
    prisma.entry.create({
      data: {
        user: { connect: { id: user.id } },
        event: { connect: { id: event.id } },
        role: { connect: { id: role.id } },
        type,
      },
    }),
    prisma.userInEvent.upsert({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId: event.id,
        },
      },
      create: {
        user: { connect: { id: user.id } },
        event: { connect: { id: event.id } },
        role: { connect: { id: role.id } },
      },
      update: {
        user: { connect: { id: user.id } },
        event: { connect: { id: event.id } },
        role: { connect: { id: role.id } },
      },
    }),
  ])
  return [entry, userInEvent]
}

async function seed() {
  const event = await prisma.event.upsert({
    where: { id: 'mindmarket' },
    update: {},
    create: {
      id: 'mindmarket',
      name: 'Mind Market',
      primaryColor: '3744AC',
      secondaryColor: 'F2929D',
    },
  })

  const roleVisitor = await createRole({
    event,
    slug: 'visitor',
    name: 'ผู้เข้าร่วมงาน',
  })
  const roleCUStaff = await createRole({
    event,
    slug: 'custaff',
    name: 'นิสิตผู้ปฏิบัติงาน',
  })
  const roleExtStaff = await createRole({
    event,
    slug: 'extstaff',
    name: 'เจ้าหน้าที่ภายนอก',
  })

  const user1 = await upsertUser({
    phone: '0812345678',
    name: 'John Doe',
  })
  const user2 = await upsertUser({
    phone: '0823456789',
    name: 'Jane Doe',
  })
  const user3 = await upsertUser({
    phone: '0834567890',
    name: 'Jack Doe',
  })

  await check({
    user: user1,
    event,
    role: roleVisitor,
    type: EntryType.IN,
  })
  await check({
    user: user2,
    event,
    role: roleCUStaff,
    type: EntryType.IN,
  })
  await check({
    user: user2,
    event,
    role: roleCUStaff,
    type: EntryType.OUT,
  })
  await check({
    user: user1,
    event,
    role: roleVisitor,
    type: EntryType.OUT,
  })
  await check({
    user: user1,
    event,
    role: roleVisitor,
    type: EntryType.IN,
  })
  await check({
    user: user3,
    event,
    role: roleExtStaff,
    type: EntryType.IN,
  })
}

seed()

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// InfluxDB Client Documentation: https://docs.influxdata.com/influxdb/v2.0/tools/client-libraries/js/
// InfluxDB Client Examples: https://github.com/influxdata/influxdb-client-js/tree/master/examples

import { UserCountLog } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { countCurrentUsers, getEvents } from '../../../models/prisma/event'
import { createUserCountLog } from '../../../models/prisma/log'
import { ApiError } from '../../../utils/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const timestamp = new Date()
    const events = await getEvents()

    const promises: Promise<UserCountLog>[] = []

    for (const event of events) {
      for (const role of event.roles) {
        const logPromise = new Promise<UserCountLog>(
          async (resolve, reject) => {
            const userCount = await countCurrentUsers(event.id, role.id)
            const log = await createUserCountLog({
              eventId: event.id,
              roleId: role.id,
              count: userCount,
              timestamp,
            })
            resolve(log)
          }
        )
        promises.push(logPromise)
      }
    }

    const logs = await Promise.all(promises)
    console.log(
      timestamp,
      `Logged user count for ${events.length} events and ${events.reduce(
        (acc, cur) => acc + cur.roles.length,
        0
      )} roles`
    )
    res.json({ logs })
  } else {
    throw new ApiError(405, 'Method Not Allowed')
  }
}

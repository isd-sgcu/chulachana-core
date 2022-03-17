// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// InfluxDB Client Documentation: https://docs.influxdata.com/influxdb/v2.0/tools/client-libraries/js/
// InfluxDB Client Examples: https://github.com/influxdata/influxdb-client-js/tree/master/examples

import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/next-server/server/api-utils'
import { getEvents } from '../../../models/prisma/event'
import { Config } from '../../../utils/config'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const config = new Config(req, res)
    config.clearNamespace('core')

    const events = await getEvents()
    for (const event of events) {
      config.clearNamespace(event.id)
    }

    res.send('OK')
  } else {
    throw new ApiError(405, 'Method Not Allowed')
  }
}

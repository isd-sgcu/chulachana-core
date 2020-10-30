// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// InfluxDB Client Documentation: https://docs.influxdata.com/influxdb/v2.0/tools/client-libraries/js/
// InfluxDB Client Examples: https://github.com/influxdata/influxdb-client-js/tree/master/examples

import { NextApiRequest, NextApiResponse } from 'next'
import { countUsers } from '../../../api/count'
import { ApiError } from '../../../utils/types'
import { cors } from '../../../utils/helper'

/*
 * Count users API
 * GET /api/count/[eventIdAndType]
 *
 * <--Response-->
 * Content-Type: application/json
 * Body: {
 *  count: number
 * }
 *
 * <--Error Response-->
 * Content-Type: application/json
 * Body: {
 *  message: string
 * }
 *
 * <--Status Code-->
 * 200: Success
 * 400: Bad Request
 * 404: Invalid Method, EventID Not Found
 * 500: Internal Server (When read from database)
 */

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res)

  const { eventIdAndType } = req.query
  if (req.method === 'GET') {
    // Input Validation
    if (typeof eventIdAndType === 'undefined') {
      throw new ApiError(400, 'Missing eventId and type')
    }

    const count = await countUsers(eventIdAndType as string)

    res.json({
      count,
    })
  } else {
    // Other than POST Method
    throw new ApiError(404, 'Invalid method')
  }
}

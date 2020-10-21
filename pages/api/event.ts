// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// InfluxDB Client Documentation: https://docs.influxdata.com/influxdb/v2.0/tools/client-libraries/js/
// InfluxDB Client Examples: https://github.com/influxdata/influxdb-client-js/tree/master/examples

import { ApiError } from '../../utils/types'
import { getInfo } from '../../api/getinfo'
import { NextApiRequest, NextApiResponse } from 'next'
import * as url from 'url'

/*
 * Event Info API
 * GET /api/event?eventid=xxx
 * Get all event meta-data inside the database
 *
 * <--Query-->
 * [Required] eventid: string
 *
 * <--Response-->
 * Actually return every info about the event inserted in InfluxDB
 * But for now, only 3 fields are inserted (if the last command in the docker-compose comment section is run)
 * Content-Type: application/json
 * Body: {
 *  name: string                // Return event name (Thai) as UTF-8
 *  primarycolor: string        // Return color in HEX format (xxxxxx)
 *  secondarycolor: string      // Return color in HEX format (xxxxxx)
 * }
 *
 * <--Status Code-->
 * 200: Success
 * 400: Bad Request
 * 404: Invalid Method, EventID Not Found
 * 500: Internal Server (When Querying from database)
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const query = url.parse(req.url, true).query
    if (!query.eventid || typeof query.eventid != 'string') {
      throw new ApiError(400, 'Invalid EventID')
    }
    res.json(await getInfo(query.eventid))
  } else {
    // Other than POST Method
    throw new ApiError(404, 'Not Found')
  }
}

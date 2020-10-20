import { ApiError, CheckDto } from '../../utils/types'
import { queryLast } from '../../api/queryLast'
import { NextApiRequest, NextApiResponse } from 'next'

// Only for testing purpose, should return the last action of the given eventid, phone, and type
// Use POST for quick testing (as the body must be in query string instead if GET)
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const body = req.body as CheckDto
    const o = await queryLast(body.eventid, body.phone, body.type)
    res.json(o)
  } else {
    // Other than POST Method
    throw new ApiError(404, 'Not Found')
  }
}

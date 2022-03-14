import Cors from 'cors'
import { allowedCorsDomains } from './constant'

export default function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
}

export const cors = initMiddleware(
  Cors({
    origin: allowedCorsDomains,
  })
)

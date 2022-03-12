import { InfluxDB } from '@influxdata/influxdb-client'
import * as redis from 'redis'
import { redisDb, redisHost, redisPort } from './env'

export const createRedisClient = async () => {
  const client = redis.createClient({
    socket: {
      host: redisHost,
      port: redisPort,
    },
    database: redisDb,
  })
  await client.connect()
  return client
}

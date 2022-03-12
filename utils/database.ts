import { InfluxDB } from '@influxdata/influxdb-client'
import * as redis from 'redis'
import { config } from './env'

export const createRedisClient = async () => {
  const client = redis.createClient({
    socket: {
      host: config.redis.host,
      port: config.redis.port,
    },
    database: config.redis.database,
  })
  await client.connect()
  return client
}

export const influxClient = new InfluxDB({
  url: config.influx.databaseURL,
  token: config.influx.token,
})

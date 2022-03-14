import { InfluxDB } from '@influxdata/influxdb-client'
import * as redis from 'redis'
import { config } from './env'

let redisClient: redis.RedisClientType

export const getRedisClient = async () => {
  if (redisClient) {
    redisClient = redis.createClient({
      socket: {
        host: config.redis.host,
        port: config.redis.port,
      },
      database: config.redis.database,
    })
    await redisClient.connect()
  }
  return redisClient
}

export const influxClient = new InfluxDB({
  url: config.influx.databaseURL,
  token: config.influx.token,
})

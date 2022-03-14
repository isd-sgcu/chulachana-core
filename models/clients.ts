import { InfluxDB } from '@influxdata/influxdb-client'
import Redis from 'ioredis'
import { config } from '../utils/env'

export const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  db: config.redis.database,
})

export const influxClient = new InfluxDB({
  url: config.influx.databaseURL,
  token: config.influx.token,
})

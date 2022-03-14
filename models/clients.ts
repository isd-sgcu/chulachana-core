import { InfluxDB } from '@influxdata/influxdb-client'
import * as redis from 'redis'
import { config } from '../utils/env'

export const redisClient = redis.createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
  database: config.redis.database,
})
redisClient.on('connect', () => {
  console.log('Connected to Redis!')
})
redisClient.connect()

export const influxClient = new InfluxDB({
  url: config.influx.databaseURL,
  token: config.influx.token,
})

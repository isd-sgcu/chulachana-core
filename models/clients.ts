import { InfluxDB } from '@influxdata/influxdb-client'
import { PrismaClient } from '@prisma/client'
import { config } from '../utils/env'

export const prisma = new PrismaClient()

export const influxClient = new InfluxDB({
  url: config.influx.databaseURL,
  token: config.influx.token,
})

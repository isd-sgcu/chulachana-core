import { InfluxDB } from '@influxdata/influxdb-client'

export const databaseURL = process.env.DB_URL
export const token = process.env.DB_TOKEN
export const organization = process.env.DB_ORG
export const bucketPrefix = process.env.DB_BUCKET_PREFIX
export const cookiesKey = process.env.COOKIES_KEY

export const redisHost = process.env.REDIS_HOST
export const redisPort = parseInt(process.env.REDIS_PORT)
export const redisPassword = process.env.REDIS_PASSWORD
export const redisDb = parseInt(process.env.REDIS_DB)

export const client = new InfluxDB({ url: databaseURL, token: token })

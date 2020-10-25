import { InfluxDB } from '@influxdata/influxdb-client'

export const databaseURL = process.env.DB_URL
export const token = process.env.DB_TOKEN
export const organization = process.env.DB_ORG
export const bucketPrefix = process.env.DB_BUCKET_PREFIX
export const cookiesKey = process.env.COOKIES_KEY

export const client = new InfluxDB({ url: databaseURL, token: token })

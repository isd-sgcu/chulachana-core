import { InfluxDB } from '@influxdata/influxdb-client'

export const config = {
  influx: {
    databaseURL: process.env.DB_URL,
    token: process.env.DB_TOKEN,
    organization: process.env.DB_ORG,
    bucketPrefix: process.env.DB_BUCKET_PREFIX,
    cookiesKey: process.env.COOKIES_KEY,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    database: parseInt(process.env.REDIS_DB),
  },
}

export const config = {
  cookiesKey: process.env.COOKIES_KEY,
  influx: {
    databaseURL: process.env.DB_URL,
    token: process.env.DB_TOKEN,
    organization: process.env.DB_ORG,
    bucketPrefix: process.env.DB_BUCKET_PREFIX,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    database: parseInt(process.env.REDIS_DB),
  },
}

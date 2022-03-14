export const config = {
  cookiesKey: process.env.COOKIES_KEY,
  influx: {
    databaseURL: process.env.DB_URL,
    token: process.env.DB_TOKEN,
    organization: process.env.DB_ORG,
    bucketPrefix: process.env.DB_BUCKET_PREFIX,
  },
  databaseURL: process.env.DATABASE_URL,
}

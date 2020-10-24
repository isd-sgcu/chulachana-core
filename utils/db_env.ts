import { InfluxDB } from '@influxdata/influxdb-client'

const databaseURL = process.env.DB_URL
const token = process.env.DB_TOKEN
const organization = process.env.DB_ORG
const bucketPrefix = process.env.DB_BUCKET_PREFIX

const client = new InfluxDB({ url: databaseURL, token: token })

export { databaseURL, token, organization, bucketPrefix, client }

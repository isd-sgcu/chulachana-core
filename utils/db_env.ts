import { InfluxDB } from '@influxdata/influxdb-client'

const databaseURL = process.env.DB_URL
const token = process.env.DB_TOKEN
const organization = process.env.DB_ORG
const bucketPrefix = process.env.DB_BUCKET_PREFIX

const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD

export { databaseURL, token, organization, bucketPrefix, username, password }

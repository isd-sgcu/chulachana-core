const {InfluxDB} = require('@influxdata/influxdb-client')

// You can generate a Token from the "Tokens Tab" in the UI
// These constants are to be changed (using docker environment variables)

const databaseUrl = process.env['INFLUX_URL'] || 'http://localhost:8086'
const token = process.env['INFLUX_TOKEN'] || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ-1234567890_abcdefghijklmnopqrstuvwxyz'
const organization = process.env['INFLUX_ORG'] || 'isdsgcu'
const bucketPrefix = process.env['INFLUX_BUCKET_PREFIX'] || 'event_'

const username = process.env['INFLUX_USERNAME'] || 'admin'
const password = process.env['INFLUX_PASSWORD'] || 'admin123'

module.exports = {
  databaseUrl,
  token,
  organization,
  bucketPrefix,
  username,
  password
}
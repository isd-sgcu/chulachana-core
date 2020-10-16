const {InfluxDB} = require('@influxdata/influxdb-client')

// You can generate a Token from the "Tokens Tab" in the UI
// These constants are to be changed (using docker environment variables)

const url = process.env['INFLUX_URL'] || 'http://localhost:8086'
const token = process.env['INFLUX_TOKEN'] || 'CBKbU7PwO_E0B259s7rCdMlvdRCDlVvwj1VICKyv6ZxyeJlAvSBOv0zTNzcYcgd5-aqaSUJnqLz3IED6ayfNiw=='
const org = process.env['INFLUX_ORG'] || 'isdcu'
const bucket = process.env['INFLUX_BUCKET'] || 'chula-chana-lkt'

/**InfluxDB user  */
const username = process.env['INFLUX_USERNAME'] || 'admin'
/**InfluxDB password  */
const password = process.env['INFLUX_PASSWORD'] || 'admin123'

const client = new InfluxDB({url: 'http://localhost:8086', token: token})

module.exports = {
  url,
  token,
  org,
  bucket,
  username,
  password,
  client,
}
const {InfluxDB} = require('@influxdata/influxdb-client')

// You can generate a Token from the "Tokens Tab" in the UI
// These constants are to be changed (using docker environment variables)

const url = process.env.INFLUX_URL
const token = process.env.INFLUX_TOKEN
const org = process.env.INFLUX_ORG
const bucket = process.env.INFLUX_BUCKET

/**InfluxDB user  */
const username = process.env.INFLUX_USERNAME
/**InfluxDB password  */
const password = process.env.INFLUX_PASSWORD

const client = new InfluxDB({url, token: token})

module.exports = {
  url,
  token,
  org,
  bucket,
  username,
  password,
  client,
}

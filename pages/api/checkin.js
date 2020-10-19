// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// InfluxDB Client Documentation: https://docs.influxdata.com/influxdb/v2.0/tools/client-libraries/js/
// InfluxDB Client Examples: https://github.com/influxdata/influxdb-client-js/tree/master/examples

const { InfluxDB, Point, HttpError } = require('@influxdata/influxdb-client')
const { databaseUrl, organization, token, bucketPrefix } = require('../../utils/db_env')
const { hostname } = require('os')
const url = require('url');

/*
 * Check In API
 * POST /api/checkin
 * 
 * <--Request-->
 * Content-Type: application/json
 * Body: {
 *  eventid: string
 *  phone: string
 *  type: string ("normal" / "staff")
 * }
 * 
 * <--Response-->
 * Content-Type: application/json
 * Body: {
 *  message: string
 * }
 * 
 * <--Status Code-->
 * 200: Success
 * 400: Bad Request
 * 404: Invalid Method
 * 500: Internal Server (When writing into database)
 */
export default (req, res) => {
    if (req.method === 'POST') {

        const query = url.parse(req.url, true).query

        // Input Validation
        // TODO: Phone Number Validate
        if (!query.eventid || !query.phone || !query.type || !(query.type === "normal" || query.type === "staff")) {
            res.writeHead(400, {'Content-Type': 'text/html'})
            res.end('Bad Request')
            return resolve()
        }

        // Initialize
        const client = new InfluxDB({url: databaseUrl, token: token})
        const writeApi = client.getWriteApi(organization, bucketPrefix + query.eventid, 'ns')
        writeApi.useDefaultTags({_host: hostname(), _location: "API", action: "checkin"})        // Not sure if host & location tags should be included

        // Data Assigning
        const point = new Point('user')
            .tag('phone', query.phone)
            .tag('type', query.type)
            .booleanField('checked_in', true)
            .timestamp(new Date())

        // Database Writing
        writeApi.writePoint(point)
        writeApi
            .close()
            .then(() => {
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.end('Success')
                return resolve()
            })
            .catch(e => {
                console.error(e)
                if (e instanceof HttpError && e.statusCode === 401) {
                    // Needs running setup script
                    console.log('Need to setup a new InfluxDB database.')
                }
                res.writeHead(500, {'Content-Type': 'text/html'})
                res.end('Internal Error')
                return resolve()
            })

    } else {
        // Other than POST Method
        res.writeHead(404, {'Content-Type': 'text/html'})
        res.end('Not Found')
        return resolve()
    }
}

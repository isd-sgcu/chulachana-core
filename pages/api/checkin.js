// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// InfluxDB Client Documentation: https://docs.influxdata.com/influxdb/v2.0/tools/client-libraries/js/
// InfluxDB Client Examples: https://github.com/influxdata/influxdb-client-js/tree/master/examples

const {InfluxDB, Point, HttpError} = require('@influxdata/influxdb-client')
const {client, org, bucket} = require('../../utils/db_env')
const {hostname} = require('os')

/*
 * Check In API
 * POST /api/checkin
 * 
 * <--Request-->
 * Content-Type: application/json
 * Body: {
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

        // Input Validation
        // TODO: Phone Number Validate
        if (!req.body.phone || !req.body.type || !(req.body.type === "normal" || req.body.type === "staff")) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: 'Bad Request' }))
            return
        }

        // Initialize
        const writeApi = client.getWriteApi(org, bucket, 'ns')
        writeApi.useDefaultTags({host: hostname(), location: "API", action: "checkin"})        // Not sure if host & location tags should be included

        // Data Assigning
        const point = new Point('user')
            .tag('phone', req.body.phone)
            .tag('type', req.body.type)
            .booleanField('checked_in', true)
            .timestamp(new Date())

        // Database Writing
        writeApi.writePoint(point)
        writeApi
            .close()
            .then(() => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ message: 'Success' }))
                return
            })
            .catch(e => {
                console.error(e)
                if (e instanceof HttpError && e.statusCode === 401) {
                    // Needs running setup script
                    console.log('Need to setup a new InfluxDB database.')
                }
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ message: 'Internal Error' }))
                return
            })

    } else {
        // Other than POST Method
        res.statusCode = 404
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ message: 'Not Found' }))
        return
    }
}

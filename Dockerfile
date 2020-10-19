FROM quay.io/influxdb/influxdb:2.0.0-rc

RUN influxd run --bolt-path /var/lib/influxdb2/influxd.bolt --engine-path /var/lib/influxdb2/engine --store bolt
RUN influx setup -b ${DB_INIT_BUCKET} -f -o ${DB_ORG} -p ${DB_ADMIN_PASS} -u ${DB_ADMIN_USER} -t ${DB_TOKEN}
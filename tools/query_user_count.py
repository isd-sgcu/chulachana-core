from datetime import datetime
import time
import csv

from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS

# You can generate a Token from the "Tokens Tab" in the UI
token = "H6HpYabBkSL3lnm9qPkITLsGD7oNZmrUB_PKh1WkefBL_UDKCjzWCslqF0zCMbv4eKyQfqiK_IpQbdFG_xJz_w=="
org = "isdsgcu"
bucket = "event_prod_lkt63"

client = InfluxDBClient(url="http://34.101.128.122:8086", token=token)

rows = [['date', 'count_all', 'count_normal', 'count_staff', 'count_shop']]
for timestamp in range(1604134800, 1604156401, 60):
  date_format = datetime.fromtimestamp(timestamp)
  row = [date_format]
  query_all = f"""from(bucket: "event_prod_lkt63")
      |> range(start: 1604134740, stop: {timestamp})
      |> filter(fn: (r) => r["_measurement"] == "user")
      |> group(columns: ["host", "_measurement", "phone"], mode:"by")
      |> sort(columns: ["_time"], desc: false)
      |> last()
      |> group(columns: ["host", "_measurement"], mode:"by")
      |> sum(column: "_value")
      |> yield()"""
  query_normal = f"""from(bucket: "event_prod_lkt63")
      |> range(start: 1604134740, stop: {timestamp})
      |> filter(fn: (r) => r["_measurement"] == "user")
      |> filter(fn: (r) => r["type"] == "normal")
      |> group(columns: ["host", "_measurement", "phone"], mode:"by")
      |> sort(columns: ["_time"], desc: false)
      |> last()
      |> group(columns: ["host", "_measurement"], mode:"by")
      |> sum(column: "_value")
      |> yield()"""
  query_staff = f"""from(bucket: "event_prod_lkt63")
      |> range(start: 1604134740, stop: {timestamp})
      |> filter(fn: (r) => r["_measurement"] == "user")
      |> filter(fn: (r) => r["type"] == "staff")
      |> group(columns: ["host", "_measurement", "phone"], mode:"by")
      |> sort(columns: ["_time"], desc: false)
      |> last()
      |> group(columns: ["host", "_measurement"], mode:"by")
      |> sum(column: "_value")
      |> yield()"""
  query_shop = f"""from(bucket: "event_prod_lkt63")
      |> range(start: 1604134740, stop: {timestamp})
      |> filter(fn: (r) => r["_measurement"] == "user")
      |> filter(fn: (r) => r["type"] == "shop")
      |> group(columns: ["host", "_measurement", "phone"], mode:"by")
      |> sort(columns: ["_time"], desc: false)
      |> last()
      |> group(columns: ["host", "_measurement"], mode:"by")
      |> sum(column: "_value")
      |> yield()"""
      
  start_time = time.time()

  tables = client.query_api().query(query_all, org=org)
  if len(tables) > 0:
    row.append(tables[0].records[0].values['_value'])
  else:
    row.append(0)
  tables = client.query_api().query(query_normal, org=org)
  if len(tables) > 0:
    row.append(tables[0].records[0].values['_value'])
  else:
    row.append(0)
  tables = client.query_api().query(query_staff, org=org)
  if len(tables) > 0:
    row.append(tables[0].records[0].values['_value'])
  else:
    row.append(0)
  tables = client.query_api().query(query_shop, org=org)
  if len(tables) > 0:
    row.append(tables[0].records[0].values['_value'])
  else:
    row.append(0)

  end_time = time.time()

  print(row[0], row[1], row[2], row[3], row[4], '- %.2f seconds' % (end_time-start_time))
  rows.append(row)

with open('./tools/exported_user_count.csv', encoding='utf8', mode='w+') as outFile:
  csvWriter = csv.writer(outFile)
  csvWriter.writerows(rows)
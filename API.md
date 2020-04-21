# COVID-19 Graph - Knowledge Dashboard API Doc

## Epidemic
### 1. Request epidemic data
#### Description
> Request epidemic realtime data (Updated every 5 mins).
#### URL
> [https://covid-dashboard-api.aminer.cn/dist/epidemic.json](https://covid-dashboard-api.aminer.cn/dist/epidemic.json)
#### Request method
> GET
#### Request params
> Empty
#### Response data format
> JSON
#### Response data
```
{
    REGION_NAME: {
        "begin": "YYYY-mm-dd",
        "data": [
            [CONFIRMED,SUSPECTED, CURED, DEAD, SEVERE, RISK]
        ]
    }
}
```
## Events
### 1. Request events data
#### Description
> Request events realtime data (Updated every 5 mins).
#### URL
> [https://covid-dashboard-api.aminer.cn/dist/events.json](https://covid-dashboard-api.aminer.cn/dist/events.json)
#### Request method
> GET
#### Request params
> Empty
#### Response data format
> JSON
#### Response data
```
{
    "tflag",
    "datas": [
        {
            "_id",
            "type",
            "title",
            "category",
            "time",
            "lang",
            "geoInfo: [
                {
                    "originText",
                    "geoName",
                    "latitude",
                    "longitude"
                }
            ]
        }
    ]
}
```
### 2. Update events data
#### Description
> Update events newer than "tflag".
#### URL
> [https://covid-dashboard-api.aminer.cn/events/update](https://covid-dashboard-api.aminer.cn/events/update)
#### Request method
> GET
#### Request params
> tflag: Number
#### Response data format
> JSON
#### Response data
```
{
    "tflag",
    "datas": [
        {
            "_id",
            "type",
            "title",
            "category",
            "time",
            "lang",
            "geoInfo: [
                {
                    "originText",
                    "geoName",
                    "latitude",
                    "longitude"
                }
            ]
        }
    ]
}
```
### 3. Request event details
#### Description
> Request event details by id.
#### URL
> [https://covid-dashboard-api.aminer.cn/event/[id]](https://covid-dashboard-api.aminer.cn/event/[id])
#### Request method
> GET
#### Request params
> id: Event id
#### Response data format
> JSON
#### Response data
```
{
    "_id",
    "type",
    "title",
    "category",
    "time",
    "lang",
    "content",
    "source",
    "urls": [
        "URL"
    ],
    "entities": [
        {
            "label",
            "url"
        }
    ],
    "geoInfo: [
        {
            "originText",
            "geoName",
            "latitude",
            "longitude"
        }
    ]
}
```
## Regions info
### 1. Request Regions info
#### Description
> Request Regions info csv.
#### URL
> [https://covid-dashboard-api.aminer.cn/dist/regions-info.csv](https://covid-dashboard-api.aminer.cn/dist/regions-info.csv)
#### Request method
> GET
#### Request params
> Empty
#### Response data format
> CSV
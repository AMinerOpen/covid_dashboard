# COVID-19 Graph - Knowledge Dashboard API Doc

## Epidemic
### 1. Epidemic datas
#### Description
> Request real-time epidemic data after multi-source integration in all regions (countries/provinces/states/counties).  
> Updated every 5 mins.
#### URL
> [https://covid-dashboard.aminer.cn/api/dist/epidemic.json](https://covid-dashboard.aminer.cn/api/dist/epidemic.json)
#### Request method
> GET
#### Request params
> Empty
#### Response data format
> JSON
#### Response data
```
{
    [COUNTRY|PROVINCE|COUNTY]: {
        "begin": "YYYY-mm-dd",
        "data": [
            [CONFIRMED,SUSPECTED, CURED, DEAD, SEVERE, RISK, inc24]
        ]
    }
}
```
## Events
### 1. Events datas
#### Description
> Request data for all events (news, papers, etc.), including title, type, language, date, geo, entities, risk influence, etc.
> Updated every 5 mins.
#### URL
> [https://covid-dashboard.aminer.cn/api/dist/events.json](https://covid-dashboard.aminer.cn/api/dist/events.json)
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
            ],
            "influence"
        }
    ]
}
```
### 2. Update events data
#### Description
> Update events newer than "tflag".
#### URL
> [https://covid-dashboard.aminer.cn/api/events/update](https://covid-dashboard.aminer.cn/api/events/update)
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
            ],
            "influence"
        }
    ]
}
```
#### Example
> https://covid-dashboard.aminer.cn/api/events/update?tflag=1594290598139
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
    ],
    "influence"
}
```
#### Example
> https://covid-dashboard.aminer.cn/api/event/5f05f3f69fced0a24b2f84ee

## Entity
### 1, Request Entity Details
#### Description
> Request entity details by url.
> Include related events around specified time.
#### URL 
> https://covid-dashboard.aminer.cn/api/entity
#### Request method
> GET
#### Request params
> url: entity url
> time: time flag
#### Response data format 
> JSON
#### Response data
```
{
    "label",
    "url",
    "source",
    "img",
    "hot",
    "abstractInfo": {
        "baidu",
        "enwiki",
        "zhwiki",
        "COVID": {
            "properties",
            "relations"
        }
    },
    "pos": [
        {
            "end",
            "start"
        }
    ],
    "related_events": [
        ...EVENT_ID
    ]
}
```
#### Example
https://covid-dashboard.aminer.cn/api/entity?url=https://covid-19.aminer.cn/kg/class/virus&time=1594137600000

## Regions info
### 1. Request Regions info
#### Description
> Request all regions info csv.
#### URL
> [https://covid-dashboard.aminer.cn/api/dist/regions-info.csv](https://covid-dashboard.aminer.cn/api/dist/regions-info.csv)
#### Request method
> GET
#### Request params
> Empty
#### Response data format
> CSV
#### Response data
```
[name, name_zh, name_en]
```
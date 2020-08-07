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
---
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
---
### 2. Update events data
#### Description
> Update events newer than "tflag".
#### URL
> [https://covid-dashboard.aminer.cn/api/events/update](https://covid-dashboard.aminer.cn/api/events/update)
#### Request method
> GET
#### Request params

| Param | Required | Type | Description |  
|-------------|-------------|-------------|-------------|
| tflag | true | number | Event timeflag (tflag) |

#### Response data format
> JSON
#### Response data
```
{
    "code",
    "msg",
    "data": {
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
}
```
#### Example
Url:
```
https://covid-dashboard.aminer.cn/api/events/update?tflag=1596778751436
```
Response:
```json
{
    "data": {
        "datas": [
            {
                "_id": "5f2cea499fced0a24ba87659",
                "category": "",
                "content": "美国新冠确诊病例和死亡病例仍在迅速增加。",
                "date": "Fri, 07 Aug 2020 05:12:57 GMT",
                "entities": [
                    {
                        "label": "美国",
                        "url": "http://xlore.org/instance/bdi6266305"
                    },
                    {
                        "label": "确诊病例",
                        "url": "https://covid-19.aminer.cn/kg/resource/R26053"
                    },
                    {
                        "label": "新冠",
                        "url": "https://covid-19.aminer.cn/kg/resource/R25833"
                    }
                ],
                "geoInfo": [
                    {
                        "geoName": "United States",
                        "latitude": "39.76",
                        "longitude": "-98.5",
                        "originText": "美国"
                    }
                ],
                "id": "xinhua112633846611150107",
                "lang": "zh",
                "sitename": "XINHUANET_ZH",
                "source": "新华网",
                "tflag": 1596779081074,
                "time": "2020-08-07 13:12:57",
                "title": "约翰斯·霍普金斯大学：美国新冠死亡病例超16万例",
                "type": "news",
                "urls": [
                    "http://m.xinhuanet.com/2020-08/07/c_1126338466.htm"
                ]
            }
            {
                "_id": "5f2cee599fced0a24bab5be3",
                "category": "",
                "content": "WASHINGTON -- U.S. President Donald Trump on Thursday issued an executive order banning any U.S. transactions with Chinese tech firm ByteDance, owner of popular video-sharing app TikTok, starting in 45 days, a controversial move widely criticized by experts.,NEW DELHI -- India's COVID-19 tally crossed 2 million mark on Friday, reaching 2,027,074, the federal health ministry said.,OTTAWA -- Canada has vowed to take countermeasures after U.S. President Donald Trump announced the decision to re-impose a 10-percent tariff on Canadian aluminum imports, citing national security concerns.,\"In response to the American tariffs announced today, Canada will impose countermeasures that will include dollar-for-dollar retaliatory tariffs,\" Canadian Prime Minister Justin Trudeau said Thursday evening.,NEW YORK -- U.S. COVID-19 deaths have surpassed the 160,000 mark to reach 160,090 as of 21:48 p.m. local time on Thursday (0148 GMT Friday), according to the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University.,Meanwhile, the number of COVID-19 cases in the country has risen to 4,881,974, according to the CSSE.",
                "date": "Fri, 07 Aug 2020 05:40:02 GMT",
                "entities": [
                    {
                        "label": "tiktok",
                        "url": "http://xlore.org/instance/eni4368592"
                    },
                    {
                        "label": "u.s. president donald trump",
                        "url": "http://xlore.org/instance/eni925107"
                    },
                    {
                        "label": "systems science",
                        "url": "http://xlore.org/instance/eni238897"
                    },
                    {
                        "label": "xinhua",
                        "url": "http://xlore.org/instance/eni126120"
                    }
                ],
                "geoInfo": [
                    {
                        "geoName": "Comunidad India",
                        "latitude": "20.06944",
                        "longitude": "-75.77389",
                        "originText": "India"
                    },
                    {
                        "geoName": "Canadian County",
                        "latitude": "35.54244",
                        "longitude": "-97.98238",
                        "originText": "Canadian"
                    }
                ],
                "id": "xinhua13927245711110320",
                "lang": "en",
                "source": "XINHUANET",
                "tflag": 1596780118572,
                "time": "2020-08-07 13:40:02",
                "title": "Xinhua world news summary at 0530 GMT, Aug. 7",
                "type": "news",
                "urls": [
                    "http://www.xinhuanet.com/english/2020-08/07/c_139272457.htm"
                ]
            }
        ],
        "tflag": 1596781632728
    },
    "status": true
}
```
---
### 3. Request event details
#### Description
> Request event details by id.
#### URL
> [https://covid-dashboard-api.aminer.cn/event/[id]](https://covid-dashboard-api.aminer.cn/event/[id])
#### Request method
> GET
#### Request params

| Param | Required | Type | Description |  
|-------------|-------------|-------------|-------------|
| id | true | number | Event _id |

#### Response data format
> JSON
#### Example
Url:
```
https://covid-dashboard.aminer.cn/api/event/5f05f3f69fced0a24b2f84ee
```
Response:
```json
{
    "data": {
        "_id": "5f05f3f69fced0a24b2f84ee",
        "category": "",
        "content": "HELSINKI, July 8 (Xinhua) -- Finnish think tank Sitra said on Wednesday a majority of Finns believe that their post-COVID-19 society will attach more importance to science and expertise and will witness heightened social tension and conflicts on economic interests.,Less than 20 percent of respondents said that people would become more interested in personally participating in political activities in the wake of the COVID-19 pandemic.,Antti Kivela, a director at Sitra, noted in a press release on Wednesday that based on the poll's findings, Finns want the decisions about their future to be \"based on researched information.\",Kalle Nieminen, a leading expert at Sitra, told Finnish newspaper Hufvudstadsbladet that Finland should not waste the opportunities offered by the COVID-19 epidemic.,The poll of about 4,000 individuals was conducted in May. Sitra is a leading Finnish think tank operating on a capital initially donated by the state in 1967.",
        "date": "Wed, 08 Jul 2020 15:54:59 GMT",
        "entities": [
            {
                "label": "hufvudstadsbladet",
                "url": "http://xlore.org/instance/eni451410"
            },
            {
                "label": "sitra",
                "url": "http://xlore.org/instance/eni820264"
            },
            {
                "label": "think tank",
                "url": "http://xlore.org/instance/eni18475"
            },
            {
                "label": "xinhua",
                "url": "http://xlore.org/instance/eni126120"
            },
            {
                "label": "finns",
                "url": "http://xlore.org/instance/eni240847"
            },
            {
                "label": "helsinki",
                "url": "http://xlore.org/instance/eni6431"
            },
            {
                "label": "finnish",
                "url": "http://xlore.org/instance/eni4929"
            },
            {
                "label": "epidemic",
                "url": "https://covid-19.aminer.cn/kg/class/epidemic"
            },
            {
                "label": "COVID-19",
                "url": "https://covid-19.aminer.cn/kg/resource/R332"
            }
        ],
        "geoInfo": [
            {
                "geoName": "Snoma Finnish Cemetery",
                "latitude": "44.63303",
                "longitude": "-103.68491",
                "originText": "Finnish"
            },
            {
                "geoName": "Republic of Finland",
                "latitude": "64",
                "longitude": "26",
                "originText": "Finland"
            }
        ],
        "id": "xinhua13919810411110320",
        "influence": 0.2758120058205174,
        "lang": "en",
        "related_events": [
            {
                "id": "5ec2d4809fced0a24b8e6b2d",
                "score": 0.9113580346658512
            },
            {
                "id": "5ee0cd1c9fced0a24b4f42ba",
                "score": 0.899462472807494
            },
            {
                "id": "5e9ded0a9fced0a24b5bc270",
                "score": 0.8976683557998417
            },
            {
                "id": "5ec7cdad9fced0a24bf35d30",
                "score": 0.8971055445251076
            },
            {
                "id": "5eb2d44b9fced0a24b741872",
                "score": 0.8966782151341071
            },
            {
                "id": "5ec57e959fced0a24b5fbc91",
                "score": 0.8949342654876311
            },
            {
                "id": "5ec16df09fced0a24bec32b9",
                "score": 0.894795169443423
            },
            {
                "id": "5e94b3c09fced0a24bf01117",
                "score": 0.8938918557235777
            },
            {
                "id": "5eb964d39fced0a24bd491eb",
                "score": 0.8933007474044586
            },
            {
                "id": "5e95fb919fced0a24b9e9d26",
                "score": 0.8932850056281226
            }
        ],
        "seg_text": "finn believ crisi give boost scienc helsinki , juli 8 ( xinhua ) -- finnish think tank sitra said wednesday major finn believ post - covid - 19 societi attach import scienc expertis wit heighten social tension conflict econom interest . , less 20 percent respond said peopl would becom interest person particip polit activ wake covid - 19 pandem . , antti kivela , director sitra , note press releas wednesday base poll ' find , finn want decis futur `` base research inform . `` , kall nieminen , lead expert sitra , told finnish newspap hufvudstadsbladet finland wast opportun offer covid - 19 epidem . , poll 4 , 000 individu wa conduct may . sitra lead finnish think tank oper capit initi donat state 1967 .",
        "source": "XINHUANET",
        "tflag": 1594225654814,
        "time": "2020-07-08 23:54:59",
        "title": "Finns believe crisis gives boost to science",
        "type": "news",
        "urls": [
            "http://www.xinhuanet.com/english/2020-07/08/c_139198104.htm"
        ]
    },
    "status": true
}
```
---

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

| Param | Required | Type | Description |  
|-------------|-------------|-------------|-------------|  
| url | true | string | Entity url |
| time | true | number | Related events timeflag |

#### Response data format 
> JSON
#### Example
Url:
```
https://covid-dashboard.aminer.cn/api/entity?url=https://covid-19.aminer.cn/kg/class/virus&time=1594137600000
```
Response:
```json
{
    "data": {
        "abstractInfo": {
            "COVID": {
                "properties": {
                    "传播方式": "感染",
                    "包括": "拟病毒、类病毒和病毒粒子",
                    "定义": "1种独特的传染因子",
                    "应用": "疫苗、细胞工程、基因工程",
                    "特征": "自主地复制",
                    "生存条件": "活的宿主细胞"
                },
                "relations": [
                    {
                        "forward": true,
                        "label": "heterotroph",
                        "relation": "subClassOf",
                        "url": "https://covid-19.aminer.cn/kg/class/heterotroph"
                    },
                    {
                        "forward": false,
                        "label": "weijin worm variant go",
                        "relation": "belongTo",
                        "url": "https://covid-19.aminer.cn/kg/resource/R24957"
                    },
                    {
                        "forward": false,
                        "label": "yellow fever virus",
                        "relation": "belongTo",
                        "url": "https://covid-19.aminer.cn/kg/resource/R24929"
                    }
                ]
            },
            "baidu": "病毒是一种个体微小，结构简单，只含一种核酸（DNA或RNA），必须在活细胞内寄生并以复制方式增殖的非细胞型生物。",
            "enwiki": "",
            "zhwiki": ""
        },
        "hot": 0.8576686777650161,
        "img": "https://bkimg.cdn.bcebos.com/pic/2e2eb9389b504fc2b9419de6e4dde71190ef6d32?x-bce-process=image/resize,m_lfit,w_268,limit_1/format,f_jpg",
        "label": "virus",
        "pos": [
            {
                "end": 971,
                "start": 966
            }
        ],
        "related_events": [
            "5f03ec519fced0a24bf92d73",
            "5f08655f9fced0a24b20f285",
            "5f08655f9fced0a24b20f2b9",
            "5f099f029fced0a24b65699a",
            "5f099f039fced0a24b6569aa",
            "5f099f039fced0a24b6569bd",
            "5f099f049fced0a24b6569da",
            "5f0352e89fced0a24bdedc4a",
            "5f03584d9fced0a24be00cd6"
        ],
        "source": "kg",
        "url": "https://covid-19.aminer.cn/kg/class/virus"
    },
    "status": true
}
```
---

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
---
## COVID-19 Knowledge Graph  
### 1. Request entity info  
#### Description
> Request entity details by url  
#### URL  
> [https://innovaapi.aminer.cn/covid/api/v1/pneumonia/entity](https://innovaapi.aminer.cn/covid/api/v1/pneumonia/entity)
#### Request method  
> GET  
#### Request params  
| Param | Required | Type | Description |  
|-------------|-------------|-------------|-------------|  
| url | true | string | Entity url |
| lang | true | string | "zh" or "en" |
#### Response data format  
> JSON  
#### Example  
Url:  
```
https://innovaapi.aminer.cn/covid/api/v1/pneumonia/entity?url=https://covid-19.aminer.cn/kg/resource/R26285&lang=zh
```
Response :  
```json
{
    "code": 0,
    "msg": "success",
    "data": {
        "label": "瑞德西韦",
        "url": "https://covid-19.aminer.cn/kg/resource/R26285",
        "abstractInfo": {
            "enwiki": "",
            "baidu": "Remdesivir（瑞德西韦）是吉利德科学公司在研药品。",
            "zhwiki": "",
            "COVID": {
                "properties": {
                    "分子式": "C27H35N6O8P"
                },
                "relations": [
                    {
                        "relation": "属于",
                        "url": "https://covid-19.aminer.cn/kg/class/western_medicine",
                        "label": "西药",
                        "forward": true
                    },
                    {
                        "relation": "治疗",
                        "url": "https://covid-19.aminer.cn/kg/resource/R429",
                        "label": "非典",
                        "forward": true
                    },
                    {
                        "relation": "治疗",
                        "url": "https://covid-19.aminer.cn/kg/resource/R332",
                        "label": "新型冠状病毒肺炎",
                        "forward": true
                    },
                    {
                        "relation": "常用药物",
                        "url": "https://covid-19.aminer.cn/kg/resource/R26285",
                        "label": "瑞德西韦",
                        "forward": true
                    },
                    {
                        "relation": "常用药物",
                        "url": "https://covid-19.aminer.cn/kg/resource/R26285",
                        "label": "瑞德西韦",
                        "forward": true
                    }
                ]
            }
        },
        "img": "https://bkimg.cdn.bcebos.com/pic/55e736d12f2eb938f58049a5da628535e4dd6ff3?x-bce-process=image/resize,m_lfit,w_268,limit_1/format,f_jpg",
        "hot": 0.5265170828683173
    }
}
```
---
### 2. Request entity search  
#### Description
> Search entities by name.
#### URL  
> [https://innovaapi.aminer.cn/covid/api/v1/pneumonia/entityquery](https://innovaapi.aminer.cn/covid/api/v1/pneumonia/entityquery)
#### Request method  
> GET  
#### Request params  
| Param | Required | Type | Description |  
|-------------|-------------|-------------|-------------|  
| entity | true | string | Search name |
#### Response data format  
> JSON  
#### Example  
Url:  
```
https://innovaapi.aminer.cn/covid/api/v1/pneumonia/entityquery?entity=病毒
```
Response :  
```json
{
    "code": 0,
    "msg": "success",
    "data": [
        {
            "hot": 0.8565082756257479,
            "label": "病毒",
            "url": "https://covid-19.aminer.cn/kg/class/virus",
            "abstractInfo": {
                "enwiki": "",
                "baidu": "病毒是一种个体微小，结构简单，只含一种核酸（DNA或RNA），必须在活细胞内寄生并以复制方式增殖的非细胞型生物。",
                "zhwiki": "",
                "COVID": {
                    "properties": {
                        "定义": "1种独特的传染因子",
                        "特征": "自主地复制",
                        "包括": "拟病毒、类病毒和病毒粒子",
                        "生存条件": "活的宿主细胞",
                        "传播方式": "感染",
                        "应用": "疫苗、细胞工程、基因工程"
                    },
                    "relations": [
                        {
                            "relation": "父类",
                            "url": "https://covid-19.aminer.cn/kg/class/heterotroph",
                            "label": "异养生物",
                            "forward": true
                        },
                        {
                            "relation": "属于",
                            "url": "https://covid-19.aminer.cn/kg/resource/R24957",
                            "label": "威金蠕虫变种go",
                            "forward": false
                        },
                        {
                            "relation": "属于",
                            "url": "https://covid-19.aminer.cn/kg/resource/R24929",
                            "label": "黄热病病毒",
                            "forward": false
                        }
                    ]
                }
            },
            "img": "https://bkimg.cdn.bcebos.com/pic/2e2eb9389b504fc2b9419de6e4dde71190ef6d32?x-bce-process=image/resize,m_lfit,w_268,limit_1/format,f_jpg"
        },
        {
            "hot": 0.9006935163127712,
            "label": "新型冠状病毒",
            "url": "https://covid-19.aminer.cn/kg/resource/R25833",
            "abstractInfo": {
                "enwiki": "",
                "baidu": "",
                "zhwiki": "",
                "COVID": {
                    "properties": {
                        "潜伏期": "1-14天，多为3-7天",
                        "鉴别诊断": "主要与流感病毒、副流感病毒、腺病毒、呼吸道合胞病毒、鼻病毒、人偏肺病毒、SARS冠状病毒等其他已知病毒性肺炎鉴别，与肺炎支原体、衣原体肺炎及细菌性肺炎等鉴别。此外，还要与非感染性疾病，如血管炎、皮肌炎和机化性肺炎等鉴别。",
                        "实验室检查": "发病早期外周血白细胞总数正常，淋巴细胞计数减少，部分患者可出现肝酶、乳酸脱氢酶（LDH）、肌酶和肌红蛋白增高；部分危重者可见肌钙蛋白增高。多数患者C反应蛋白（CRP）和血沉升高，降钙素原正常。严重者D-二聚体升高、外周血淋巴细胞进行性减少。 在鼻咽拭子、痰、下呼吸道分泌物、血液、粪便等标本中可检测出新型冠状病毒核酸。",
                        "基本传染指数": "2.2",
                        "胸部影像学": "早期呈现多发小斑片影及间质改变，以肺外带明显。进而发展为双肺多发磨玻璃影、浸润影、严重者可出现肺实变，胸腔积液少见。",
                        "生理机能": "体外分离培养时，2019-nCoV 96个小时左右即可在人呼吸道上皮细胞内发现，而在Vero E6 和Huh-7细胞系中分离培养需约6天。病毒对紫外线和热敏感，56℃ 30分钟、乙醚、75%乙醇、含氯消毒剂、过氧乙酸和氯仿等脂溶剂均可有效灭活病毒，氯已定不能有效灭火病毒。",
                        "死亡率": "14",
                        "基因特征": "其基因特征与SARSr-CoV和MERSr-CoV有明显区别。目前研究显示与蝙蝠SARS样冠状病毒（bat-SL-CoVZC45）同源性达85%以上。",
                        "结构": "有包膜，颗粒呈圆形或者椭圆形，常为多形性，直径60-140nm。"
                    },
                    "relations": [
                        {
                            "relation": "疑似宿主",
                            "url": "https://covid-19.aminer.cn/kg/resource/R250",
                            "label": "中华菊头蝠",
                            "forward": true
                        },
                        {
                            "relation": "导致",
                            "url": "https://covid-19.aminer.cn/kg/resource/R332",
                            "label": "新型冠状病毒肺炎",
                            "forward": true
                        },
                        {
                            "relation": "疑似传播途径",
                            "url": "https://covid-19.aminer.cn/kg/resource/R25867",
                            "label": "气溶胶传播",
                            "forward": true
                        }
                    ]
                }
            },
            "img": null
        },
        {
            "hot": 0.8477689919705503,
            "label": "冠状病毒",
            "url": "https://covid-19.aminer.cn/kg/class/coronavirus",
            "abstractInfo": {
                "enwiki": "",
                "baidu": "冠状病毒在系统分类上属套式病毒目（Nidovirales）冠状病毒科（Coronaviridae）冠状病毒属（Coronavirus）。冠状病毒属的病毒是具囊膜（envelope）、基因组为线性单股正链的RNA病毒，是自然界广泛存在的一大类病毒。",
                "zhwiki": "",
                "COVID": {
                    "properties": {},
                    "relations": [
                        {
                            "relation": "父类",
                            "url": "https://covid-19.aminer.cn/kg/resource/R5636",
                            "label": "RNA病毒",
                            "forward": true
                        },
                        {
                            "relation": "属于",
                            "url": "https://covid-19.aminer.cn/kg/resource/R26286",
                            "label": "mers病毒",
                            "forward": false
                        }
                    ]
                }
            },
            "img": "https://bkimg.cdn.bcebos.com/pic/94cad1c8a786c9175889eec0c23d70cf3ac75744?x-bce-process=image/resize,m_lfit,w_268,limit_1/format,f_jpg"
        },
        {
            "hot": 0.5465496393744452,
            "label": "病毒性感染",
            "url": "https://covid-19.aminer.cn/kg/resource/R5612",
            "abstractInfo": {
                "enwiki": "",
                "baidu": "能在人体寄生繁殖，并能致病的病毒引起的传染病。主要表现有发热、头痛、全身不适等全身中毒症状及病毒寄主和侵袭组织器官导致炎症损伤而引起的局部症状。人体的病毒性感染分为隐性感染、显性感染、慢病毒感染。多数情况下的感染呈隐性感染（指人体感染病毒后，不出现症状，但可产生特异性抗体）。少数为显性感染（指人体感染病毒后，出现症状）。显性感染中多数病毒性感染表现为急性感染，发病急、病程短，多在1～2周内自愈，少数表现为潜伏性感染（如疱疹病毒感染等）和慢性感染（如乙型肝炎病毒感染等）。",
                "zhwiki": "",
                "COVID": {
                    "properties": {
                        "传染性": "有",
                        "常见病因": "病毒感染",
                        "临床表现": "发热、头痛、全身不适等中毒症状及局部症状"
                    },
                    "relations": [
                        {
                            "relation": "医学专科",
                            "url": "https://covid-19.aminer.cn/kg/resource/R980",
                            "label": "感染科",
                            "forward": true
                        },
                        {
                            "relation": "属于",
                            "url": "https://covid-19.aminer.cn/kg/class/virus",
                            "label": "病毒",
                            "forward": true
                        },
                        {
                            "relation": "常见病因",
                            "url": "https://covid-19.aminer.cn/kg/resource/R9292",
                            "label": "猪水疱性口炎",
                            "forward": false
                        }
                    ]
                }
            },
            "img": null
        },
        {
            "hot": 0.40852213226701445,
            "label": "病毒疫苗",
            "url": "https://covid-19.aminer.cn/kg/resource/R15076",
            "abstractInfo": {
                "enwiki": "",
                "baidu": "",
                "zhwiki": "",
                "COVID": {
                    "properties": {},
                    "relations": [
                        {
                            "relation": "属于",
                            "url": "https://covid-19.aminer.cn/kg/class/drug",
                            "label": "药物",
                            "forward": true
                        }
                    ]
                }
            },
            "img": null
        }
    ]
}
```
---
### 3. Entity link
#### Description
> Analyze the user text, identify the entities in it, and return information about the associated entity nodes in the map.  
#### URL  
> [https://innovaapi.aminer.cn/covid/api/v1/pneumonia/entitylink](https://innovaapi.aminer.cn/covid/api/v1/pneumonia/entitylink)
#### Request method  
> GET  
#### Request params  
| Param | Required | Type | Description |  
|-------------|-------------|-------------|-------------|  
| news | true | string | User text |
#### Response data format  
> JSON  
#### Example  
Url:  
```
https://innovaapi.aminer.cn/covid/api/v1/pneumonia/entitylink?news=Abe told a press briefing that the public needed to reduce the amount of contact they are having with other people, two weeks after he declared an initial state of emergency for Tokyo and six other prefectures that was extended on April 16 to cover the entire country.,While praising those who had been cooperating with central and local governments requests and staying and working from home as much as possible, he said people from Tokyo, the epicenter of the nation's COVID-19 outbreak accounting for more than one-third of the country's COVID-19 cases, had left the capital in large numbers over the weekend to take overnight trips.,The Japanese leader said that a large number of people from Tokyo headed to rural areas last weekend despite his repeated calls for people to refrain from leaving home or make unnecessary trips and try to achieve the goal of reducing contact between people by 80 percent.,People leaving Tokyo where 123 new daily cases were confirmed as of Tuesday evening, bringing the total number of infections in the capital to 3,307 from a nationwide total of 11,543 recorded COVID-19 cases, could see the virus spread to rural areas in Japan.,In order to ease the strain on the healthcare system and save people's lives, Abe said that he would like more cooperation to achieve the goal of people significantly reducing contact to contain the spread of the virus that has taken the lives of a total of 294 people in Japan.,With both central and prefectural governments gearing up to face Golden Week and the possibility that groups may leave urban areas en masse and head to rural ones for a vacation, a recent survey has revealed that Japanese people have also been continuing to commute to work.
```
Response :  
```json
{
    "code": 0,
    "msg": "success",
    "data": [
        {
            "label": "emergency",
            "url": "https://covid-19.aminer.cn/kg/resource/R636",
            "abstractInfo": {
                "enwiki": "",
                "baidu": "",
                "zhwiki": "",
                "COVID": {
                    "properties": {},
                    "relations": [
                        {
                            "relation": "department",
                            "url": "https://covid-19.aminer.cn/kg/resource/R138",
                            "label": "acute altitude sickness",
                            "forward": false
                        }
                    ]
                }
            },
            "img": null,
            "pos": [
                {
                    "start": 164,
                    "end": 173
                }
            ],
            "hot": 0.649021172461182
        },
        {
            "label": "confirmed",
            "url": "https://covid-19.aminer.cn/kg/class/confirmed",
            "abstractInfo": {
                "enwiki": "",
                "baidu": "确诊，拼音què zhěn，即做出明确的诊断。",
                "zhwiki": "",
                "COVID": {
                    "properties": {},
                    "relations": [
                        {
                            "relation": "subClassOf",
                            "url": "http://www.openkg.cn/COVID-19/class/state_types_of_individuals_investigated",
                            "label": "state types of individuals investigated",
                            "forward": true
                        }
                    ]
                }
            },
            "img": "https://bkimg.cdn.bcebos.com/pic/32fa828ba61ea8d388c96e0e990a304e241f58d4?x-bce-process=image/resize,m_lfit,w_268,limit_1/format,f_jpg",
            "pos": [
                {
                    "start": 961,
                    "end": 970
                }
            ],
            "hot": 0.8899230082201446
        },
        {
            "label": "virus",
            "url": "https://covid-19.aminer.cn/kg/class/virus",
            "abstractInfo": {
                "enwiki": "",
                "baidu": "病毒是一种个体微小，结构简单，只含一种核酸（DNA或RNA），必须在活细胞内寄生并以复制方式增殖的非细胞型生物。",
                "zhwiki": "",
                "COVID": {
                    "properties": {
                        "定义": "1种独特的传染因子",
                        "特征": "自主地复制",
                        "包括": "拟病毒、类病毒和病毒粒子",
                        "生存条件": "活的宿主细胞",
                        "传播方式": "感染",
                        "应用": "疫苗、细胞工程、基因工程"
                    },
                    "relations": [
                        {
                            "relation": "subClassOf",
                            "url": "https://covid-19.aminer.cn/kg/class/heterotroph",
                            "label": "heterotroph",
                            "forward": true
                        },
                        {
                            "relation": "belongTo",
                            "url": "https://covid-19.aminer.cn/kg/resource/R24957",
                            "label": "weijin worm variant go",
                            "forward": false
                        },
                        {
                            "relation": "belongTo",
                            "url": "https://covid-19.aminer.cn/kg/resource/R24929",
                            "label": "yellow fever virus",
                            "forward": false
                        }
                    ]
                }
            },
            "img": "https://bkimg.cdn.bcebos.com/pic/2e2eb9389b504fc2b9419de6e4dde71190ef6d32?x-bce-process=image/resize,m_lfit,w_268,limit_1/format,f_jpg",
            "pos": [
                {
                    "start": 1131,
                    "end": 1136
                },
                {
                    "start": 1382,
                    "end": 1387
                }
            ],
            "hot": 0.8565311560298766
        },
        {
            "label": "order",
            "url": "https://covid-19.aminer.cn/kg/class/order",
            "abstractInfo": {
                "enwiki": "",
                "baidu": "",
                "zhwiki": "",
                "COVID": {
                    "properties": {},
                    "relations": [
                        {
                            "relation": "subClassOf",
                            "url": "https://covid-19.aminer.cn/kg/class/class",
                            "label": "class",
                            "forward": true
                        },
                        {
                            "relation": "subClassOf",
                            "url": "https://covid-19.aminer.cn/kg/class/sub_order",
                            "label": "sub order",
                            "forward": false
                        }
                    ]
                }
            },
            "img": null,
            "pos": [
                {
                    "start": 1172,
                    "end": 1177
                }
            ],
            "hot": 0.6619969047867998
        }
    ]
}
```
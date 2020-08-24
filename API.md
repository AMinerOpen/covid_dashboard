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
### 4. List events
#### Description
> List events with type and pagination.
#### URL
> [https://covid-dashboard.aminer.cn/api/events/list](https://covid-dashboard.aminer.cn/api/events/list)
#### Request method
> GET
#### Request params

| Param | Required | Type | Default | Description |  
|-------------|-------------|-------------|-------------|-------------|
| type | false | 'all'\|'event'\|'points'\|'news'\|'paper' | 'all' | Event type |
| page | false | number | 1 | Page index(start from 1) |
| size | false | number | 20 | Page size |

#### Response data format
> JSON
#### Example
Url:
```
https://covid-dashboard.aminer.cn/api/events/list?type=paper&page=1&size=10
```
Response:
```json
{
    "data": [
        {
            "_id": "5e8d92fa7ac1f2cf57f7b46c",
            "aminer_id": "5e836c2c9e795e24e0ea7e54",
            "authors": [
                {
                    "name": "Robert Verity"
                },
                {
                    "name": "Lucy C Okell"
                }
            ],
            "category": "",
            "content": "Background：In the face of rapidly changing data, a range of case fatality ratio estimates for coronavirus disease 2019 (COVID-19) have been produced that differ substantially in magnitude. We aimed to provide robust estimates, accounting for censoring and ascertainment biases.\nMethods：We collected individual-case data for patients who died from COVID-19 in Hubei, mainland China (reported by national and provincial health commissions to Feb 8, 2020), and for cases outside of mainland China (from government or ministry of health websites and media reports for 37 countries, as well as Hong Kong and Macau, until Feb 25, 2020). These individual-case data were used to estimate the time between onset of symptoms and outcome (death or discharge from hospital). We next obtained age-stratified estimates of the case fatality ratio by relating the aggregate distribution of cases to the observed cumulative deaths in China, assuming a constant attack rate by age and adjusting for demography and age-based and location-based under-ascertainment. We also estimated the case fatality ratio from individual line-list data on 1334 cases identified outside of mainland China. Using data on the prevalence of PCR-confirmed cases in international residents repatriated from China, we obtained age-stratified estimates of the infection fatality ratio. Furthermore, data on age-stratified severity in a subset of 3665 cases from China were used to estimate the proportion of infected individuals who are likely to require hospitalisation.\nFindings：Using data on 24 deaths that occurred in mainland China and 165 recoveries outside of China, we estimated the mean duration from onset of symptoms to death to be 17·8 days (95% credible interval [CrI] 16·9–19·2) and to hospital discharge to be 24·7 days (22·9–28·1). In all laboratory confirmed and clinically diagnosed cases from mainland China (n=70 117), we estimated a crude case fatality ratio (adjusted for censoring) of 3·67% (95% CrI 3·56–3·80). However, after further adjusting for demography and under-ascertainment, we obtained a best estimate of the case fatality ratio in China of 1·38% (1·23–1·53), with substantially higher ratios in older age groups (0·32% [0·27–0·38] in those aged <60 years vs 6·4% [5·7–7·2] in those aged ≥60 years), up to 13·4% (11·2–15·9) in those aged 80 years or older. Estimates of case fatality ratio from international cases stratified by age were consistent with those from China (parametric estimate 1·4% [0·4–3·5] in those aged <60 years [n=360] and 4·5% [1·8–11·1] in those aged ≥60 years [n=151]). Our estimated overall infection fatality ratio for China was 0·66% (0·39–1·33), with an increasing profile with age. Similarly, estimates of the proportion of infected individuals likely to be hospitalised increased with age up to a maximum of 18·4% (11·0–7·6) in those aged 80 years or older.\nInterpretation：These early estimates give an indication of the fatality ratio across the spectrum of COVID-19 disease and show a strong age gradient in risk of death.",
            "date": "Mon, 30 Mar 2020 16:00:00 GMT",
            "doi": "10.1016/S1473-3099(20)30243-7",
            "entities": [
                {
                    "label": "attack rate",
                    "url": "http://xlore.org/instance/eni1182928"
                }
            ],
            "geoInfo": [],
            "id": "5e836c2c9e795e24e0ea7e54",
            "influence": 0.34799035161011355,
            "lang": "",
            "pdf": "https://static.aminer.cn/upload/pdf/1681/13/222/5e836c2c9e795e24e0ea7e54_0.pdf",
            "regionIDs": [
                "China|Hong Kong",
                "China|Hubei",
                "China|Macao"
            ],
            "related_events": [
                {
                    "id": "5e8d92fa7ac1f2cf57f7b5a5",
                    "score": 0.9608107588780214
                }
            ],
            "seg_text": "estim sever coronaviru diseas 2019 : model - base analysi background ： In face rapidli chang data , rang case fatal ratio estim coronaviru diseas 2019 ( covid - 19 ) produc differ substanti magnitud . We aim provid robust estim , account censor ascertain bias . method ： We collect individu - case data patient die covid - 19 hubei , mainland china ( report nation provinci health commiss feb 8 , 2020 ) , case outsid mainland china ( govern ministri health websit media report 37 countri , well hong kong macau , feb 25 , 2020 ) . individu - case data use estim time onset symptom outcom ( death discharg hospit ) . We next obtain age - stratifi estim case fatal ratio relat aggreg distribut case observ cumul death china , assum constant attack rate age adjust demographi age - base locat - base - ascertain . We also estim case fatal ratio individu line - list data 1334 case identifi outsid mainland china . use data preval pcr - confirm case intern resid repatri china , obtain age - stratifi estim infect fatal ratio . furthermor , data age - stratifi sever subset 3665 case china use estim proport infect individu like requir hospitalis . find ： use data 24 death occur mainland china 165 recoveri outsid china , estim mean durat onset symptom death 17 · 8 day ( 95 % credibl interv [ cri ] 16 · 9 – 19 · 2 ) hospit discharg 24 · 7 day ( 22 · 9 – 28 · 1 ) . In laboratori confirm clinic diagnos case mainland china ( n = 70 117 ) , estim crude case fatal ratio ( adjust censor ) 3 · 67 % ( 95 % cri 3 · 56 – 3 · 80 ) . howev , adjust demographi - ascertain , obtain best estim case fatal ratio china 1 · 38 % ( 1 · 23 – 1 · 53 ) , substanti higher ratio older age group ( 0 · 32 % [ 0 · 27 – 0 · 38 ] age < 60 year vs 6 · 4 % [ 5 · 7 – 7 · 2 ] age ≥ 60 year ) , 13 · 4 % ( 11 · 2 – 15 · 9 ) age 80 year older . estim case fatal ratio intern case stratifi age consist china ( parametr estim 1 · 4 % [ 0 · 4 – 3 · 5 ] age < 60 year [ n = 360 ] 4 · 5 % [ 1 · 8 – 11 · 1 ] age ≥ 60 year [ n = 151 ] ) . estim overal infect fatal ratio china wa 0 · 66 % ( 0 · 39 – 1 · 33 ) , increas profil age . similarli , estim proport infect individu like hospitalis increas age maximum 18 · 4 % ( 11 · 0 – 7 · 6 ) age 80 year older . interpret ： earli estim give indic fatal ratio across spectrum covid - 19 diseas show strong age gradient risk death .",
            "source": "",
            "tflag": 1585584000000,
            "time": "2020/03/31",
            "title": "Estimates of the severity of coronavirus disease 2019: a model-based analysis",
            "type": "paper",
            "urls": [
                "https://www.thelancet.com/journals/laninf/article/PIIS1473-3099(20)30243-7/fulltext"
            ],
            "year": 2020
        },
        {
            "_id": "5e8d92fa7ac1f2cf57f7b46d",
            "aminer_id": "5e836c2e9e795e24e0ea7e55",
            "authors": [
                {
                    "name": "Lei Zhang"
                },
                {
                    "name": "Mingwang Shen"
                }
            ],
            "category": "",
            "content": "Background: The Chinese government implemented a metropolitan-wide quarantine of Wuhan city on 23rd January 2020 to curb the epidemic of the coronavirus COVID-19. Lifting of this quarantine is imminent. We modelled the effects of two key health interventions on the epidemic when the quarantine is lifted. Method: We constructed a compartmental dynamic model to forecast the trend of the COVID-19 epidemic at different quarantine lifting dates and investigated the impact of different rates of public contact and facial mask usage on the epidemic. Results: We estimated that at the end of the epidemic, a total of 65,572 (46,156-95,264) individuals would be infected by the virus, among which 16,144 (14,422-23,447, 24.6%) would be infected through public contacts, 45,795 (32,390-66,395, 69.7%) through household contact, 3,633 (2,344-5,865, 5.5%) through hospital contacts (including 783 (553-1,134) non-COVID-19 patients and 2,850 (1,801-4,981) medical staff members). A total of 3,262 (1,592-6,470) would die of COVID-19 related pneumonia in Wuhan. For an early lifting date (21st March), facial mask needed to be sustained at a relatively high rate (≥85%) if public contacts were to recover to 100% of the pre-quarantine level. In contrast, lifting the quarantine on 18th April allowed public person-to-person contact adjusted back to the pre-quarantine level with a substantially lower level of facial mask usage (75%). However, a low facial mask usage (<50%) combined with an increased public contact (>100%) would always lead a significant second outbreak in most quarantine lifting scenarios. Lifting the quarantine on 25th April would ensure a smooth decline of the epidemics regardless of the combinations of public contact rates and facial mask usage. Conclusion: The prevention of a second epidemic is viable after the metropolitan-wide quarantine is lifted but requires a sustaining high facial mask usage and a low public contact rate.",
            "date": "Mon, 30 Mar 2020 16:00:00 GMT",
            "doi": "10.1101/2020.03.24.20042374",
            "entities": [
                {
                    "label": "coronavirus",
                    "url": "http://xlore.org/instance/eni105371"
                },
                {
                    "label": "sars-cov",
                    "url": "http://xlore.org/instance/eni108593"
                },
                {
                    "label": "pneumonia",
                    "url": "http://xlore.org/instance/eni25943"
                },
                {
                    "label": "curb",
                    "url": "http://xlore.org/instance/eni238902"
                },
                {
                    "label": "chinese government",
                    "url": "http://xlore.org/instance/eni710360"
                },
                {
                    "label": "wuhan",
                    "url": "http://xlore.org/instance/eni38298"
                },
                {
                    "label": "china",
                    "url": "http://xlore.org/instance/eni2353"
                }
            ],
            "geoInfo": [],
            "id": "5e836c2e9e795e24e0ea7e55",
            "influence": 0.17131730881702315,
            "lang": "",
            "pdf": "https://static.aminer.cn/upload/pdf/659/1040/229/5e836c2e9e795e24e0ea7e55_0.pdf",
            "regionIDs": [
                "United States of America"
            ],
            "related_events": [
                {
                    "id": "5e9d959c9fced0a24b140be4",
                    "score": 0.9549474361311677
                },
                {
                    "id": "5f18388d9fced0a24be306dd",
                    "score": 0.9548406917129985
                },
                {
                    "id": "5e8d92fa7ac1f2cf57f7b6ee",
                    "score": 0.9521664237600389
                },
                {
                    "id": "5e8d92fa7ac1f2cf57f7b64e",
                    "score": 0.9509389301231966
                },
                {
                    "id": "5e8d92fa7ac1f2cf57f7b672",
                    "score": 0.9505325911634351
                },
                {
                    "id": "5e8d92fa7ac1f2cf57f7b5bf",
                    "score": 0.9500121338748987
                },
                {
                    "id": "5e8d92fa7ac1f2cf57f7b5b7",
                    "score": 0.949993566066841
                },
                {
                    "id": "5eb952609fced0a24bd050ea",
                    "score": 0.9495773631813429
                },
                {
                    "id": "5e8d92fa7ac1f2cf57f7b50c",
                    "score": 0.9471230063297039
                },
                {
                    "id": "5eeb6a1c9fced0a24bdcf6a3",
                    "score": 0.9466449195875789
                }
            ],
            "seg_text": "requir prevent second major outbreak novel coronaviru sar - cov - 2 upon lift metropolitan - wide quarantin wuhan citi , china background : chines govern implement metropolitan - wide quarantin wuhan citi 23rd januari 2020 curb epidem coronaviru covid - 19 . lift thi quarantin immin . We model effect two key health intervent epidem quarantin lift . method : We construct compartment dynam model forecast trend covid - 19 epidem differ quarantin lift date investig impact differ rate public contact facial mask usag epidem . result : We estim end epidem , total 65 , 572 ( 46 , 156 - 95 , 264 ) individu would infect viru , among 16 , 144 ( 14 , 422 - 23 , 447 , 24.6 % ) would infect public contact , 45 , 795 ( 32 , 390 - 66 , 395 , 69.7 % ) household contact , 3 , 633 ( 2 , 344 - 5 , 865 , 5.5 % ) hospit contact ( includ 783 ( 553 - 1 , 134 ) non - covid - 19 patient 2 , 850 ( 1 , 801 - 4 , 981 ) medic staff member ) . A total 3 , 262 ( 1 , 592 - 6 , 470 ) would die covid - 19 relat pneumonia wuhan . earli lift date ( 21st march ) , facial mask need sustain rel high rate ( ≥ 85 % ) public contact recov 100 % pre - quarantin level . In contrast , lift quarantin 18th april allow public person - - person contact adjust back pre - quarantin level substanti lower level facial mask usag ( 75 % ) . howev , low facial mask usag ( < 50 % ) combin increas public contact ( > 100 % ) would alway lead signific second outbreak quarantin lift scenario . lift quarantin 25th april would ensur smooth declin epidem regardless combin public contact rate facial mask usag . conclus : prevent second epidem viabl metropolitan - wide quarantin lift requir sustain high facial mask usag low public contact rate .",
            "source": "",
            "tflag": 1585584000000,
            "time": "2020/03/31",
            "title": "What is required to prevent a second major outbreak of the novel coronavirus SARS-CoV-2 upon lifting the metropolitan-wide quarantine of Wuhan city, China",
            "type": "paper",
            "urls": [
                "https://www.medrxiv.org/content/10.1101/2020.03.24.20042374v1"
            ],
            "year": 2020
        },
        {
            "_id": "5e8d92fa7ac1f2cf57f7b46e",
            "aminer_id": "5e836c309e795e24e0ea7e57",
            "authors": [
                {
                    "name": "Gang Li"
                },
                {
                    "name": "Rui Hu"
                }
            ],
            "category": "",
            "content": "Currently, the novel coronavirus (COVID-19) has spread to many countries around the world. Due to the increasing number of confirmed cases and public hazards, COVID-19 has become a public health emergency of international concern and has received much attention from health organizations worldwide.At present, the pathogenesis of COVID-19 has not been elucidated [1]. However, a preliminary study speculated that it might enter the human body via angiotensin-converting enzyme 2 (ACE2) on the surfaces of type II alveolar cells[2]. Analysis of the clinical characteristics of patients with COVID-19 suggested that patients with hypertension comprised 20–30% of all patients and up to 58.3% of patients in the intensive care unit and have been responsible for 60.9%of deaths caused by COVID-19. The renin-angiotensin system (RAS) plays an important role in the occurrence and development of hypertension, and ACE inhibitors (ACEIs) and angiotensin receptor antagonists (ARBs) are the main antihypertensive drugs recommended by the current guidelines. Therefore, what should be done in regard to ACEI/ARB for the antihypertensive treatment of patients with COVID-19 complicated by hypertension? We will conduct a specific analysis as follows.",
            "date": "Mon, 30 Mar 2020 16:00:00 GMT",
            "doi": "10.1038/s41440-020-0433-1",
            "entities": [
                {
                    "label": "antihypertensive",
                    "url": "http://xlore.org/instance/eni232223"
                },
                {
                    "label": "angiotensin",
                    "url": "http://xlore.org/instance/eni127946"
                },
                {
                    "label": "public health emergency of international concern",
                    "url": "http://xlore.org/instance/eni4232931"
                },
                {
                    "label": "pathogenesis",
                    "url": "http://xlore.org/instance/eni203109"
                },
                {
                    "label": "angiotensin-converting enzyme",
                    "url": "http://xlore.org/instance/eni235008"
                },
                {
                    "label": "coronavirus",
                    "url": "http://xlore.org/instance/eni105371"
                },
                {
                    "label": "hypertension",
                    "url": "http://xlore.org/instance/eni36431"
                },
                {
                    "label": "antagonists",
                    "url": "http://xlore.org/instance/eni237396"
                }
            ],
            "geoInfo": [],
            "id": "5e836c309e795e24e0ea7e57",
            "influence": 0.44794808109294526,
            "lang": "",
            "pdf": "https://static.aminer.cn/upload/pdf/1685/19/237/5e836c309e795e24e0ea7e57_0.pdf",
            "regionIDs": [
                "World"
            ],
            "related_events": [
                {
                    "id": "5ea9517f9fced0a24b19ef44",
                    "score": 0.9581634679163794
                },
                {
                    "id": "5e8d92fa7ac1f2cf57f7b6f7",
                    "score": 0.9541799522525648
                },
                {
                    "id": "5ebd46f29fced0a24bdd612f",
                    "score": 0.9514218520633548
                },
                {
                    "id": "5ebe95b99fced0a24b397487",
                    "score": 0.9492009653671173
                },
                {
                    "id": "5e8d92fa7ac1f2cf57f7b736",
                    "score": 0.9460798445346094
                },
                {
                    "id": "5eb4194e9fced0a24be46b58",
                    "score": 0.9456122387423929
                },
                {
                    "id": "5e8d92fa7ac1f2cf57f7be07",
                    "score": 0.944446458406871
                },
                {
                    "id": "5e8d92fa7ac1f2cf57f7b6b9",
                    "score": 0.9433456147919019
                },
                {
                    "id": "5ea5884f9fced0a24b6281b0",
                    "score": 0.9426945517966296
                },
                {
                    "id": "5eeb6a149fced0a24bdcf193",
                    "score": 0.942277981761977
                }
            ],
            "seg_text": "antihypertens treatment acei current , novel coronaviru ( covid - 19 ) ha spread mani countri around world . due increas number confirm case public hazard , covid - 19 ha becom public health emerg intern concern ha receiv much attent health organ worldwid . At present , pathogenesi covid - 19 ha elucid [ 1 ] . howev , preliminari studi specul might enter human bodi via angiotensin - convert enzym 2 ( ace2 ) surfac type II alveolar cell [ 2 ] . analysi clinic characterist patient covid - 19 suggest patient hypertens compris 20 – 30 % patient 58.3 % patient intens care unit respons 60.9 % death caus covid - 19 . renin - angiotensin system ( ra ) play import role occurr develop hypertens , ace inhibitor ( acei ) angiotensin receptor antagonist ( arb ) main antihypertens drug recommend current guidelin . therefor , done regard acei / arb antihypertens treatment patient covid - 19 complic hypertens ? We conduct specif analysi follow .",
            "source": "",
            "tflag": 1585584000000,
            "time": "2020/03/31",
            "title": "Antihypertensive treatment with ACEI",
            "type": "paper",
            "urls": [
                "https://www.nature.com/articles/s41440-020-0433-1"
            ],
            "year": 2020
        },
        {
            "_id": "5e8d92fa7ac1f2cf57f7b46f",
            "aminer_id": "5e836c319e795e24e0ea7e58",
            "authors": [
                {
                    "name": "Jun Lan"
                },
                {
                    "name": "Jiwan Ge"
                }
            ],
            "category": "",
            "content": "A novel and highly pathogenic coronavirus (SARS-CoV-2) has caused an outbreak in Wuhan city, Hubei province of China since December 2019, and soon spread nationwide and spilled over to other countries around the world1–3. To better understand the initial step of infection at an atomic level, we determined the crystal structure of the SARS-CoV-2 spike receptor-binding domain (RBD) bound to the cell receptor ACE2 at 2.45 Å resolution. The overall ACE2-binding mode of the SARS-CoV-2 RBD is nearly identical to that of the SARS-CoV RBD, which also utilizes ACE2 as the cell receptor4. Structural analysis identified residues in the SARS-CoV-2 RBD that are critical for ACE2 binding, the majority of which either are highly conserved or share similar side chain properties with those in the SARS-CoV RBD. Such similarity in structure and sequence strongly argue for convergent evolution between the SARS-CoV-2 and SARS-CoV RBDs for improved binding to ACE2, although SARS-CoV-2 does not cluster within SARS and SARS-related coronaviruses1–3,5. The epitopes of two SARS-CoV antibodies targeting the RBD are also analysed with the SARS-CoV-2 RBD, providing insights into the future identification of cross-reactive antibodies.",
            "date": "Mon, 30 Mar 2020 16:00:00 GMT",
            "doi": "10.1038/s41586-020-2180-5",
            "entities": [
                {
                    "label": "epitopes",
                    "url": "http://xlore.org/instance/eni195157"
                }
            ],
            "geoInfo": [],
            "id": "5e836c319e795e24e0ea7e58",
            "influence": 0.2953032552800498,
            "lang": "",
            "pdf": "https://static.aminer.cn/upload/pdf/151/533/1264/5e836c319e795e24e0ea7e58_0.pdf",
            "regionIDs": [
                "World",
                "China|Hubei"
            ],
            "related_events": [
                {
                    "id": "5e8d92fa7ac1f2cf57f7b69e",
                    "score": 0.9955520810339851
                }
            ],
            "seg_text": "structur sar - cov - 2 spike receptor - bind domain bound ace2 receptor A novel highli pathogen coronaviru ( sar - cov - 2 ) ha caus outbreak wuhan citi , hubei provinc china sinc decemb 2019 , soon spread nationwid spill countri around world1 – 3 . To better understand initi step infect atom level , determin crystal structur sar - cov - 2 spike receptor - bind domain ( rbd ) bound cell receptor ace2 2.45 Å resolut . overal ace2 - bind mode sar - cov - 2 rbd nearli ident sar - cov rbd , also util ace2 cell receptor4 . structur analysi identifi residu sar - cov - 2 rbd critic ace2 bind , major either highli conserv share similar side chain properti sar - cov rbd . similar structur sequenc strongli argu converg evolut sar - cov - 2 sar - cov rbd improv bind ace2 , although sar - cov - 2 doe cluster within sar sar - relat coronaviruses1 – 3 , 5 . epitop two sar - cov antibodi target rbd also analys sar - cov - 2 rbd , provid insight futur identif cross - reactiv antibodi .",
            "source": "",
            "tflag": 1585584000000,
            "time": "2020/03/31",
            "title": "Structure of the SARS-CoV-2 spike receptor-binding domain bound to the ACE2 receptor",
            "type": "paper",
            "urls": [
                "https://www.nature.com/articles/s41586-020-2180-5"
            ],
            "year": 2020
        },
        {
            "_id": "5e8d92fa7ac1f2cf57f7b470",
            "aminer_id": "5e836c329e795e24e0ea7e59",
            "authors": [
                {
                    "name": "Jian Shang"
                },
                {
                    "name": "Gang Ye"
                }
            ],
            "category": "",
            "content": "A novel SARS-like coronavirus (SARS-CoV-2) recently emerged and is rapidly spreading in humans1,2. A key to tackling this epidemic is to understand the virus’s receptor recognition mechanism, which regulates its infectivity, pathogenesis and host range. SARS-CoV-2 and SARS-CoV recognize the same receptor - human ACE2 (hACE2)3,4. Here we determined the crystal structure of the SARS-CoV-2 receptor-binding domain (RBD) (engineered to facilitate crystallization) in complex with hACE2. Compared with the SARS-CoV RBD, a hACE2-binding ridge in SARS-CoV-2 RBD takes a more compact conformation; moreover, several residue changes in SARS-CoV-2 RBD stabilize two virus-binding hotspots at the RBD/hACE2 interface. These structural features of SARS-CoV-2 RBD enhance its hACE2-binding affinity. Additionally, we show that RaTG13, a bat coronavirus closely related to SARS-CoV-2, also uses hACE2 as its receptor. The differences among SARS-CoV-2, SARS-CoV and RaTG13 in hACE2 recognition shed light on potential animal-to-human transmission of SARS-CoV-2. This study provides guidance for intervention strategies targeting receptor recognition by SARS-CoV-2.",
            "date": "Mon, 30 Mar 2020 16:00:00 GMT",
            "doi": "10.1038/ s41586-020-2179-y",
            "entities": [
                {
                    "label": "pathogenesis",
                    "url": "http://xlore.org/instance/eni203109"
                }
            ],
            "geoInfo": [],
            "id": "5e836c329e795e24e0ea7e59",
            "influence": 0.39028281640080564,
            "lang": "",
            "pdf": "https://static.aminer.cn/upload/pdf/664/1046/244/5e836c329e795e24e0ea7e59_0.pdf",
            "regionIDs": [],
            "related_events": [
                {
                    "id": "5e8d92fa7ac1f2cf57f7b51c",
                    "score": 0.9748234458545468
                }
            ],
            "seg_text": "structur basi receptor recognit sar - cov - 2 A novel sar - like coronaviru ( sar - cov - 2 ) recent emerg rapidli spread humans1 , 2 . A key tackl thi epidem understand viru ’ receptor recognit mechan , regul infect , pathogenesi host rang . sar - cov - 2 sar - cov recogn receptor - human ace2 ( hace2 ) 3 , 4 . determin crystal structur sar - cov - 2 receptor - bind domain ( rbd ) ( engin facilit crystal ) complex hace2 . compar sar - cov rbd , hace2 - bind ridg sar - cov - 2 rbd take compact conform ; moreov , sever residu chang sar - cov - 2 rbd stabil two viru - bind hotspot rbd / hace2 interfac . structur featur sar - cov - 2 rbd enhanc hace2 - bind affin . addit , show ratg13 , bat coronaviru close relat sar - cov - 2 , also use hace2 receptor . differ among sar - cov - 2 , sar - cov ratg13 hace2 recognit shed light potenti anim - - human transmiss sar - cov - 2 . thi studi provid guidanc intervent strategi target receptor recognit sar - cov - 2 .",
            "source": "",
            "tflag": 1585584000000,
            "time": "2020/03/31",
            "title": "Structural basis of receptor recognition by SARS-CoV-2",
            "type": "paper",
            "urls": [
                "https://www.nature.com/articles/s41586-020-2179-y"
            ],
            "year": 2020
        },
        {
            "_id": "5e8d92fa7ac1f2cf57f7b471",
            "aminer_id": "5e81c3fc9fced0a24b8fbcd4",
            "authors": [
                {
                    "name": "Yong-Zhen Zhang"
                },
                {
                    "name": "Edward C Holmes"
                }
            ],
            "category": "",
            "content": "The ongoing pandemic of a new human coronavirus, SARS-CoV-2, has generated enormous global concern. We and others in China were involved in the initial genome sequencing of the virus. Herein, we describe what genomic data reveal about the emergence SARS-CoV-2 and discuss the gaps in our understanding of its origins.",
            "date": "Mon, 30 Mar 2020 16:00:00 GMT",
            "doi": "10.1016/j.cell.2020.03.035",
            "entities": [
                {
                    "label": "sars-cov",
                    "url": "http://xlore.org/instance/eni108593"
                },
                {
                    "label": "genome sequencing",
                    "url": "http://xlore.org/instance/eni2449118"
                },
                {
                    "label": "coronavirus",
                    "url": "http://xlore.org/instance/eni105371"
                }
            ],
            "geoInfo": [],
            "id": "5e81c3fc9fced0a24b8fbcd4",
            "influence": 0.27965447992286924,
            "lang": "",
            "pdf": "https://static.aminer.cn/upload/pdf/995/1163/671/5e81c3fc9fced0a24b8fbcd4_0.pdf",
            "regionIDs": [],
            "related_events": [
                {
                    "id": "5e8d92fa7ac1f2cf57f7b698",
                    "score": 0.9366684437660829
                }
            ],
            "seg_text": "A genom perspect origin emerg sar - cov - 2 . ongo pandem new human coronaviru , sar - cov - 2 , ha gener enorm global concern . We china involv initi genom sequenc viru . herein , describ genom data reveal emerg sar - cov - 2 discuss gap understand origin .",
            "source": "",
            "tflag": 1585584000000,
            "time": "2020/03/31",
            "title": "A Genomic Perspective on the Origin and Emergence of SARS-CoV-2.",
            "type": "paper",
            "urls": [
                "https://www.ncbi.nlm.nih.gov/pubmed/32220310"
            ],
            "year": 2020
        },
        {
            "_id": "5e8d92fa7ac1f2cf57f7b472",
            "aminer_id": "5e836c329e795e24e0ea7e5a",
            "authors": [
                {
                    "name": "Eugenia Ziying Ong"
                },
                {
                    "name": "Yvonne Fu Zi Chan"
                }
            ],
            "category": "",
            "content": "The inflammatory response to SARS-coronavirus-2 (SARS-CoV-2) infection is thought to underpin COVID-19 pathogenesis. We conducted daily transcriptomic profiling of three COVID-19 cases and found that the early immune response in COVID-19 patients is highly dynamic. Patient throat swabs were tested daily for SARS-CoV-2 with the virus persisting for 3-4 weeks in all three patients. Cytokine analyses of whole blood revealed increased cytokine expression in the single more severe case. However, most inflammatory gene expression peaked after respiratory function nadir, except those in the IL1 pathway. Parallel analyses of CD4 and CD8 expression suggested that the pro-inflammatory response may be intertwined with T-cell activation that could exacerbate disease or prolong the infection. Collectively,these findings hint at the possibility that IL1 and related pro-inflammatory pathways may be prognostic and serve as therapeutic targets for COVID-19. This work may also guide future studies to illuminate COVID-19 pathogenesis and develop host-directed therapies.",
            "date": "Mon, 30 Mar 2020 16:00:00 GMT",
            "doi": "10.1016/j.chom.2020.03.021",
            "entities": [
                {
                    "label": "whole blood",
                    "url": "http://xlore.org/instance/eni108819"
                }
            ],
            "geoInfo": [],
            "id": "5e836c329e795e24e0ea7e5a",
            "influence": 0.2771733979940302,
            "lang": "",
            "pdf": "https://static.aminer.cn/upload/pdf/665/1046/244/5e836c329e795e24e0ea7e5a_0.pdf",
            "regionIDs": [],
            "related_events": [
                {
                    "id": "5f18388c9fced0a24be30676",
                    "score": 0.969735223445712
                }
            ],
            "seg_text": "A dynam immun respons shape covid - 19 progress inflammatori respons sar - coronaviru - 2 ( sar - cov - 2 ) infect thought underpin covid - 19 pathogenesi . We conduct daili transcriptom profil three covid - 19 case found earli immun respons covid - 19 patient highli dynam . patient throat swab test daili sar - cov - 2 viru persist 3 - 4 week three patient . cytokin analys whole blood reveal increas cytokin express singl sever case . howev , inflammatori gene express peak respiratori function nadir , except il1 pathway . parallel analys cd4 cd8 express suggest pro - inflammatori respons may intertwin T - cell activ could exacerb diseas prolong infect . collect , find hint possibl il1 relat pro - inflammatori pathway may prognost serv therapeut target covid - 19 . thi work may also guid futur studi illumin covid - 19 pathogenesi develop host - direct therapi .",
            "source": "",
            "tflag": 1585584000000,
            "time": "2020/03/31",
            "title": "A dynamic immune response shapes COVID-19 progression",
            "type": "paper",
            "urls": [
                "https://marlin-prod.literatumonline.com/pb-assets/journals/research/cell-host-microbe/chom_2283_s5.pdf"
            ],
            "year": 2020
        },
        {
            "_id": "5e8d92fa7ac1f2cf57f7b473",
            "aminer_id": "5e836c339e795e24e0ea7e5b",
            "authors": [
                {
                    "name": "Fatima Amanat"
                },
                {
                    "name": "Florian Krammer"
                }
            ],
            "category": "",
            "content": "SARS-CoV-2, the causal agent of COVID-19, first emerged in late 2019 in China. It has since infected more than 170,000 individuals and caused more than 6500 deaths globally. Here we discuss therapeutic and prophylactic interventions for SARS-CoV-2 with a focus on vaccine development and its challenges. Vaccines are being rapidly developed but will likely come too late to have an impact on the first wave of a potential pandemic. Nevertheless, important lessons can be learned for the development of vaccines against rapidly emerging viruses. Importantly, SARS-CoV-2 vaccines will be essential to reducing morbidity and mortality if the virus establishes itself in the population.",
            "date": "Mon, 30 Mar 2020 16:00:00 GMT",
            "doi": "10.1016/j.immuni.2020.03.007",
            "entities": [
                {
                    "label": "sars-cov",
                    "url": "http://xlore.org/instance/eni108593"
                }
            ],
            "geoInfo": [],
            "id": "5e836c339e795e24e0ea7e5b",
            "influence": 0.392350591278413,
            "lang": "",
            "pdf": "https://static.aminer.cn/upload/pdf/1178/1559/1271/5e836c339e795e24e0ea7e5b_0.pdf",
            "regionIDs": [
                "United States of America"
            ],
            "related_events": [
                {
                    "id": "5eb6bb2e9fced0a24bf85abf",
                    "score": 0.9396894480642667
                }
            ],
            "seg_text": "sar - cov - 2 vaccin : statu report sar - cov - 2 , causal agent covid - 19 , first emerg late 2019 china . It ha sinc infect 170 , 000 individu caus 6500 death global . discuss therapeut prophylact intervent sar - cov - 2 focu vaccin develop challeng . vaccin rapidli develop like come late impact first wave potenti pandem . nevertheless , import lesson learn develop vaccin rapidli emerg virus . importantli , sar - cov - 2 vaccin essenti reduc morbid mortal viru establish popul .",
            "source": "",
            "tflag": 1585584000000,
            "time": "2020/03/31",
            "title": "SARS-CoV-2 vaccines: status report",
            "type": "paper",
            "urls": [
                "https://marlin-prod.literatumonline.com/pb-assets/journals/research/immunity/SARS-CoV-2%20vaccines%20status%20report.pdf"
            ],
            "year": 2020
        },
        {
            "_id": "5e8d92fa7ac1f2cf57f7b483",
            "aminer_id": "5e81ffab9e795e62584c3e6c",
            "authors": [
                {
                    "name": "Qinghe Liu"
                },
                {
                    "name": "Zhicheng Liu"
                }
            ],
            "category": "",
            "content": "COVID-19 is now widely spreading around the world as a global pandemic, whereas it had been effecitvely under control in China by March 15. In this report, we estimate the global tendency of COVID-19 and analyze the associated global epidemic risk, given that the status quo is continued without further measures being taken. The results show that the global R_0, excluding China, is estimated to be 2.48 (95% CI: 1.60 -4.33). The United States, Germany, Italy, Spain, have peak values over 50,000. And the peak arrival time of all these countries is after Apr. 15, 2020. We predict that there are four regional clusters of the outbreak: Southeast Asia extending southward to Oceania, the Middle East, Western Europe and North America. Among them, Western Europe will become the major center of the outbreak. The peak values in Germany, Italy and Spain are estimated to be 98,893, 156,857 and 65,082, respectively. The U.S. is the country with the most serious outbreak trend. Based on the current situation of intervention measures, the peak value in the U.S. will reach 267,324. Above all, if the current policy environment is maintained, the cumulative number of patients worldwide will be 1,225,059 (95% CI: 486,934 -4,533,392).",
            "date": "Sun, 29 Mar 2020 16:00:00 GMT",
            "doi": "10.1101/2020.03.18.20038224",
            "entities": [
                {
                    "label": "europe and north america",
                    "url": "http://xlore.org/instance/eni4160819"
                }
            ],
            "geoInfo": [],
            "id": "5e81ffab9e795e62584c3e6c",
            "influence": -0.10119774259124892,
            "lang": "",
            "pdf": "https://static.aminer.cn/upload/pdf/946/843/836/5e81ffab9e795e62584c3e6c_4.pdf",
            "regionIDs": [
                "Germany",
                "World",
                "Spain",
                "Italy",
                "United States of America"
            ],
            "related_events": [
                {
                    "id": "5eb952609fced0a24bd050ea",
                    "score": 0.9293618861767163
                }
            ],
            "seg_text": "assess global tendenc covid - 19 outbreak covid - 19 wide spread around world global pandem , wherea effecitv control china march 15 . In thi report , estim global tendenc covid - 19 analyz associ global epidem risk , given statu quo continu without measur taken . result show global R _ 0 , exclud china , estim 2.48 ( 95 % CI : 1.60 - 4.33 ) . unit state , germani , itali , spain , peak valu 50 , 000 . peak arriv time countri apr . 15 , 2020 . We predict four region cluster outbreak : southeast asia extend southward oceania , middl east , western europ north america . among , western europ becom major center outbreak . peak valu germani , itali spain estim 98 , 893 , 156 , 857 65 , 082 , respect . U . S . countri seriou outbreak trend . base current situat intervent measur , peak valu U . S . reach 267 , 324 . abov , current polici environ maintain , cumul number patient worldwid 1 , 225 , 059 ( 95 % CI : 486 , 934 - 4 , 533 , 392 ) .",
            "source": "",
            "tflag": 1585497600000,
            "time": "2020/03/30",
            "title": "Assessing the Global Tendency of COVID-19 Outbreak",
            "type": "paper",
            "urls": [
                "https://www.medrxiv.org/content/10.1101/2020.03.18.20038224v2"
            ],
            "year": 2020
        },
        {
            "_id": "5e8d92fa7ac1f2cf57f7b484",
            "aminer_id": "5e81ffad9e795e62584c3e6d",
            "authors": [
                {
                    "name": "Dan Yan"
                },
                {
                    "name": "Xiao-yan Liu"
                }
            ],
            "category": "",
            "content": "Background: The duration of viral shedding is central to guide decisions around isolation precautions and antiviral treatment. However, studies about risk factors associated with prolonged SARS-CoV-2 shedding and the potential impact of Lopinavir/Ritonavir (LPV/r) treatment remain scarce. Methods: In this retrospective study, data were collected from all SARS-CoV-2 infected patients who were admitted to isolation wards and had RT-PCR conversion at the NO.3 People's hospital of Hubei province between 31 January and 09 March 2020. We compared clinical features and SARS-CoV-2 RNA shedding between patients with LPV/r treatment and those without. Logistic regression analysis was employed to evaluate risk factors associated with prolonged viral shedding. Results: Of 120 patients, the median age was 52 years, 54 (45%) were male and 78 (65%) received LPV/r treatment. The median duration of SARS-CoV-2 RNA detection from symptom onset was 23 days (IQR, 18-32 days). Older age (odd ratio [OR] 1.03, 95% confidence interval [CI] 1.00-1.05, p=0.03) and lack of LPV/r treatment (OR 2.42, 95% CI 1.10-5.36, p=0.029) were independent risk factors for prolonged SARS-CoV-2 RNA shedding in multivariate logistic regression analysis. The median duration of viral shedding was shorter in the LPV/r treatment group (n=78) than that in no LPV/r treatment group (n=42) (median, 22 days vs. 28.5 days, p=0.02). Only earlier administration of LPV/r treatment (≤10 days from symptom onset) could shorten the duration of viral shedding. Conclusions: Older age and lack of LPV/r treatment were independently associated with prolonged SARS-CoV-2 RNA shedding in patients with COVID-19. Earlier administration of LPV/r treatment could shorten viral shedding.",
            "date": "Sun, 29 Mar 2020 16:00:00 GMT",
            "doi": "10.1101/2020.03.22.20040832",
            "entities": [
                {
                    "label": "viral shedding",
                    "url": "http://xlore.org/instance/eni1820923"
                }
            ],
            "geoInfo": [],
            "id": "5e81ffad9e795e62584c3e6d",
            "influence": 0.27383376716184143,
            "lang": "",
            "pdf": "https://static.aminer.cn/upload/pdf/1971/1869/843/5e81ffad9e795e62584c3e6d_4.pdf",
            "regionIDs": [
                "China|Hubei"
            ],
            "related_events": [
                {
                    "id": "5ebbe3e89fced0a24b65f32c",
                    "score": 0.972530917292428
                }
            ],
            "seg_text": "factor associ prolong viral shed impact lopinavir background : durat viral shed central guid decis around isol precaut antivir treatment . howev , studi risk factor associ prolong sar - cov - 2 shed potenti impact lopinavir / ritonavir ( lpv / r ) treatment remain scarc . method : In thi retrospect studi , data collect sar - cov - 2 infect patient admit isol ward RT - pcr convers no.3 peopl ' hospit hubei provinc 31 januari 09 march 2020 . We compar clinic featur sar - cov - 2 rna shed patient lpv / r treatment without . logist regress analysi wa employ evalu risk factor associ prolong viral shed . result : Of 120 patient , median age wa 52 year , 54 ( 45 % ) male 78 ( 65 % ) receiv lpv / r treatment . median durat sar - cov - 2 rna detect symptom onset wa 23 day ( iqr , 18 - 32 day ) . older age ( odd ratio [ OR ] 1.03 , 95 % confid interv [ CI ] 1.00 - 1.05 , p = 0.03 ) lack lpv / r treatment ( OR 2.42 , 95 % CI 1.10 - 5.36 , p = 0.029 ) independ risk factor prolong sar - cov - 2 rna shed multivari logist regress analysi . median durat viral shed wa shorter lpv / r treatment group ( n = 78 ) lpv / r treatment group ( n = 42 ) ( median , 22 day vs . 28.5 day , p = 0.02 ) . onli earlier administr lpv / r treatment ( ≤ 10 day symptom onset ) could shorten durat viral shed . conclus : older age lack lpv / r treatment independ associ prolong sar - cov - 2 rna shed patient covid - 19 . earlier administr lpv / r treatment could shorten viral shed .",
            "source": "",
            "tflag": 1585497600000,
            "time": "2020/03/30",
            "title": "Factors associated with prolonged viral shedding and impact of Lopinavir",
            "type": "paper",
            "urls": [
                "https://www.medrxiv.org/content/10.1101/2020.03.22.20040832v1"
            ],
            "year": 2020
        }
    ],
    "pagination": {
        "page": 1,
        "size": 10,
        "total": 3136
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
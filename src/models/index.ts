import { Position, BBox } from 'geojson'

export interface IGeoPosition {
    lng: number
    lat: number
}

export interface IRegionData {
    _id: string
    name: string
    fullName: string
    enName?: string
    // enFullName: string
    // geometry: Geometry
    // paths: string[]
    // geo: GeoJSON.GeoJSON
    centroid: Position
    timeline: ITimeline
    bbox: BBox
}

export interface ITimeline<T = any> {
    [date: string]: T
}

export interface ITimelineData {
    total?: IEpidemicData
}

export interface IEpidemicData {
    confirmed: number
    confirmed_delta: number
    suspected: number
    suspected_delta: number
    cured: number
    cured_delta: number
    dead: number
    dead_delta: number
    remain: number
    remain_delta: number
    risk?: number
    risk_delta?: number
    incr24?: number
}

export interface IBubbleData {
    title: string
    href?: string
}

export interface IPolicyData extends IBubbleData {
    area: string
    weight?: number
    tags?: string[]
    type: string
}

export interface IEventData {
    id: string
    type: string
    date: string
    title: string
    href?: string
    locs: string[]
    geos: IGeoPosition[]
}

export interface IGeoInfo {
    originText: string
    geoName: string
    latitude: string
    longitude: string
}

export interface INews {
    lang: string
    locs: string[]
    title: string
    content: string
    time: string
    url: string
    type: string
    category: string
    geoInfo: IGeoInfo[]
}

// confired, suspected, cured, dead, severe
export type IEpidemicCompressedData = [number | null, number | null, number | null, number | null, number | null, number | null, number | null]

export interface IEpidemicSeries {
    begin: string
    data: IEpidemicCompressedData[]
}

export interface IRegionEpidemicDayData {
    confirmed?: number
    confirmed_delta?: number
    suspected?: number
    suspected_delta?: number
    cured?: number
    cured_delta?: number
    dead?: number
    dead_delta?: number
    remain?: number
    remain_delta?: number
    risk?: number
    risk_delta?: number
    incr24?: number
    display: boolean
    childDisplay: boolean
    colors: {[mode: string]: string}
}

export interface IRegionEpidemicData {
    level: number,
    offset: number,
    data: IRegionEpidemicDayData[]
}

export interface IRegionInfo {
    name: string
    name_en: string
    name_zh: string
    bbox: [number, number, number, number]
}
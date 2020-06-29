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

export interface IGeoInfo {
    originText: string
    geoName: string
    latitude: string
    longitude: string
}

export interface INews {
    _id: string;
    lang: string
    locs: string[]
    title: string
    content: string
    time: string
    url: string
    type: string
    category: string
    geoInfo: IGeoInfo[]
    influence: number
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

export interface ISearchRegion {
    code: string;
    full: string[];
    level: number;
    region: string;
    risk_level: string;
    _id: string;
    geo: IGeoInfo;
}

export interface IEntityRelation {
    label: string;
    relation: string;
    url: string;
    forward: boolean;
}

export interface IEntityAbstractInfoCOVID {
    properties: {[index: string]: string};
    relations: IEntityRelation[];
}

export interface IEntityAbstractInfo {
    baidu: string | null;
    enwiki: string | null;
    zhwiki: string | null;
    COVID?: IEntityAbstractInfoCOVID;
}

export interface IEntity {
    url: string;
    label: string;
    img?: string;
    hot: number;
    abstractInfo: IEntityAbstractInfo;
}

export interface ISearchResult {
    regions?: ISearchRegion[];
    entities?: IEntity[];
    events?: INews[];
}

export interface IHotRegion {
    name: string; 
    zoomMin: number; 
    zoom: number;
    bound: [number, number, number, number];
    center: [number, number];
}
import React from 'react'
import ReactDOM from 'react-dom'
import './container.scss'
import * as mapboxgl from 'mapbox-gl'
import _ from 'lodash'
import { ITimeline, IEpidemicData, IRegionEpidemicDayData, INews, IRegionEpidemicData, IRegionInfo, IGeoInfo, IHotRegion, ISearchRegion } from '../../../models'
import { setMapLanguage, preprocessRenderData } from './utils'
import dateformat from 'dateformat'
import EventMarker, { IEventMarkerProp } from './event-marker'
import { IDefaultProps } from '../../../global'
import axios from 'axios'
import { getLastDate } from '../../../utils/epidemic'
import { DAYMILLS } from '../../../utils/date'
import { initMapbox, DEFAULT_STYLE } from './mapbox.js';
import { requestRegionsInfo, requestEpidemic, requestHotRegions } from '../../../utils/requests'
import HotMarker, { IHotMarkerProps } from './hot-marker'

const PROVINCE_MIN_ZOOM = 2.8
const COUNTY_MIN_ZOOM = 4.5

const COUNTRY_SOURCE_LAYER = 'countries'
const REGIONE_SOURCE_LAYER = 'regione-0411'
const PROVINCE_SOURCE_LAYER = 'provinces'
const COUNTY_SOURCE_LAYER = 'counties-0417'

const HOT_REGIONS:IHotRegion[] = [
    {
        name: "beijing",
        zoomMin: 8.6,
        zoom: 9.4,
        bound: [116.04880884325848, 39.63258933028658, 116.96873450242674, 40.31091353808489],
        center: [116.407526, 39.90403]
    }
]

function get_source_layer_priority(source_layer: string): number {
    if (source_layer === COUNTRY_SOURCE_LAYER) return 0
    if (source_layer === REGIONE_SOURCE_LAYER) return 1
    if (source_layer === PROVINCE_SOURCE_LAYER) return 2
    return 3
}

interface IProp extends IDefaultProps {
    date: string
    theme: string
    langAll: boolean
    markerVisible: boolean
    onHover: (info: IRegionInfo, dayEp: Partial<IRegionEpidemicDayData>) => void
    onLoadGlobalEpData: (epData:  {[id: string]: ITimeline<IEpidemicData>}) => void
    onLoadGlobalTranslateData: (transData: {[id: string]: {[lang: string]: string}}) => void
    onChangeEndDate: (date: Date) => void
    news: {date: Date, data: INews[]}[]
    onEventClick: (data: any) => void
    mapMode: string
    hotRegion: string
}

interface IState {}

export default class MapContainer extends React.Component<IProp, IState> {
    private container: HTMLDivElement | null = null
    private map?: mapboxgl.Map

    private langAll: boolean;
    private lang: string = ''
    private theme: string = ''
    private date: string = ''
    private news: {date: Date, data: INews[]}[] = []
    private dailyNews: {[date: string]: {[loc: string]: INews[]}} = {}
    private mapMode: string = ''

    private regionEpidemicData: {[id: string]: IRegionEpidemicData} = {}

    private regionsInfo: {[id: string]: IRegionInfo} = {}

    private curHotRegion: IHotRegion | null = null

    constructor(props: IProp) {
        super(props)
        this.langAll = props.langAll;
        this.handle_epidemic_resp = this.handle_epidemic_resp.bind(this);
        this.mapMode = this.props.mapMode
    }

    __getDayEp(ep: IRegionEpidemicData, globalOffset: number, fallback: Partial<IRegionEpidemicDayData>): Partial<IRegionEpidemicDayData> {
        const idx = globalOffset - ep.offset
        if (idx < 0 || ep.data.length === 0) return fallback
        if (idx >= ep.data.length) return ep.data[ep.data.length - 1]
        return ep.data[idx]
    }

    __getDecayFactor() {
        const zoomLevel = this.map?.getZoom() || 0
        const decayFactor = (zoomLevel < 8) ? 1.0 : (zoomLevel < 9 ? 0.6 : (zoomLevel < 10 ? 0.2 : 0.1))
        return decayFactor
    }

    private _hover_feature?: mapboxgl.MapboxGeoJSONFeature
    private _click_feature?: mapboxgl.MapboxGeoJSONFeature
    private hover_feature?: mapboxgl.MapboxGeoJSONFeature
    private _hover_date: string = ''
    private _hover_update = _.debounce(() => {
        if (this.hover_feature) this.map?.setFeatureState(this.hover_feature, { hover_opacity: undefined, hover_stroke_opacity: undefined })
        this.hover_feature = this._hover_feature
        const decayFactor = this.__getDecayFactor()
        if (this.hover_feature) this.map?.setFeatureState(this.hover_feature, { hover_opacity: 0.9 * decayFactor, hover_stroke_opacity: 0.5 * decayFactor })
    })

    onClick(feature?: mapboxgl.MapboxGeoJSONFeature) {
        const name = feature === undefined ? 'World' : feature.properties!.name
        this._click_feature = feature;
        const globalOffset = new Date(this.props.date).getTime() / DAYMILLS
        let ep = this.regionEpidemicData[name]
        if (!ep && name.indexOf('|') >= 0) return
        const dayEp = ep ? this.__getDayEp(ep, globalOffset, {}) : {}
        this.props.onHover(this.regionsInfo[name], dayEp)
    }

    onHover(feature?: mapboxgl.MapboxGeoJSONFeature, forceUpdate=false) {
        const update = forceUpdate || (feature && !this._hover_feature) || (!feature && this._hover_feature) || ((feature && this._hover_feature && feature.id !== this._hover_feature.id))
        if (update || (this.props.date !== this._hover_date)) {
            this._hover_feature = feature
            this._hover_date = this.props.date
            this._hover_update()
        }
    }

    private reloadEpidemicMap = _.debounce(() => {
        if (!this.map) return
        this.handleMapMove()
        const globalOffset = new Date(this.props.date).getTime() / DAYMILLS
        const forceDisplayMinZoom = [0, PROVINCE_MIN_ZOOM, COUNTY_MIN_ZOOM, 16];
        [COUNTRY_SOURCE_LAYER, REGIONE_SOURCE_LAYER, PROVINCE_SOURCE_LAYER, COUNTY_SOURCE_LAYER].forEach(sourceLayer => {
            this.map!.querySourceFeatures('composite', { sourceLayer }).forEach((feature) => {
                const decayFactor = this.__getDecayFactor()
                const ep = this.regionEpidemicData[feature.properties!.name]
                if (ep) {
                    const dayEp = this.__getDayEp(ep, globalOffset, {display: false})
                    // current need display and (either next level not displayed or no child display)
                    const opacity = (dayEp.display && ((this.map!.getZoom() <= forceDisplayMinZoom[ep.level]) || (!dayEp.childDisplay))) ? 0.7 : 0
                    const stroke_opacity = (opacity > 0) ? (
                        sourceLayer === COUNTRY_SOURCE_LAYER ? 0.1 : (
                            sourceLayer === COUNTY_SOURCE_LAYER ? 0.03 : 0.06
                        )
                    ) : 0
                    const color = (opacity > 0 && dayEp.colors) ? (dayEp.colors[this.mapMode] || '#ffffff') : '#ffffff'
                    this.map!.setFeatureState({source: 'composite', sourceLayer, id: feature.id}, { color, opacity: opacity * decayFactor, stroke_opacity: stroke_opacity * decayFactor })
                } else if (sourceLayer === COUNTRY_SOURCE_LAYER) {
                    this.map!.setFeatureState({source: 'composite', sourceLayer, id: feature.id}, { color: '#dddddd', opacity: 1 * decayFactor, stroke_opacity: 0.1 * decayFactor})
                }
            })
        })
    }, 50, {'trailing': true})

    _selectTargetFeature(features: mapboxgl.MapboxGeoJSONFeature[]) {
        const availableLayers = [COUNTRY_SOURCE_LAYER]
        if (this.map!.getZoom() > PROVINCE_MIN_ZOOM) {
            availableLayers.push(PROVINCE_SOURCE_LAYER)
            availableLayers.push(REGIONE_SOURCE_LAYER)
        }
        if (this.map!.getZoom() > COUNTY_MIN_ZOOM) availableLayers.push(COUNTY_SOURCE_LAYER)
        features = features.filter(feature => availableLayers.indexOf(feature.sourceLayer) >= 0 && feature.state.opacity)
        features.sort((a, b) => get_source_layer_priority(b.sourceLayer) - get_source_layer_priority(a.sourceLayer))
        return features.length > 0 ? features[0] : undefined
    }

    handle_epidemic_resp(data: any) {
        const regionEpidemicSeries = data
        this.regionEpidemicData = preprocessRenderData(regionEpidemicSeries)
        const lastDate = _.max(_.map(regionEpidemicSeries, (series, _) => getLastDate(series)))
        const dateStr = lastDate ? dateformat(lastDate, 'yyyy-mm-dd') : this.props.date
        if (dateStr < this.props.date) this.props.onChangeEndDate(lastDate!)
        else this.reloadEpidemicMap()
        // TODO: current use pipe out; later could consider change data format
        const globalEpData: {[id: string]: ITimeline<IEpidemicData>} = {}
        _.forEach(this.regionEpidemicData, (ep, id) => {
            if (ep.level > 1) return undefined
            if (id === 'World') id = ''
            globalEpData[id] = {}
            ep.data.map((dayEp, index) => {
                const date = dateformat(new Date((ep.offset + index) * DAYMILLS), 'yyyy-mm-dd')
                globalEpData[id][date] = {
                    confirmed: dayEp.confirmed || 0,
                    confirmed_delta: dayEp.confirmed_delta || 0,
                    suspected: dayEp.suspected || 0,
                    suspected_delta: dayEp.suspected_delta || 0,
                    cured: dayEp.cured || 0,
                    cured_delta: dayEp.cured_delta || 0,
                    dead: dayEp.dead || 0,
                    dead_delta: dayEp.dead_delta || 0,
                    remain: dayEp.remain || 0,
                    remain_delta: dayEp.remain_delta || 0,
                    risk: dayEp.risk || 0,
                    incr24: dayEp.incr24 || 0
                }
            })
        })
        this.props.onLoadGlobalEpData(globalEpData)
        this.onClick(this._click_feature || undefined);
    }

    updateEpidemic() {
        requestEpidemic().then(this.handle_epidemic_resp);
    }

    handleLocate(geo: {longitude: string, latitude: string}, zoom?: number) {
        let lonlat: mapboxgl.LngLatLike = {
            lon: Number(geo.longitude),
            lat: Number(geo.latitude)
        }
        let option: mapboxgl.EaseToOptions = {
            center: lonlat,
            zoom: zoom || 6
        };
        this.map?.easeTo(option);
    }

    init() {
        if (!this.container) {
            setTimeout(this.init.bind(this), 50)
            return
        }
        this.map = initMapbox(this.props.env.isMobile, this.handleLocate.bind(this));

        requestEpidemic().then(this.handle_epidemic_resp)
            .catch(err => {
                console.log('epidemic api failed, switch to fallback', err)
                axios.get(process.env.PUBLIC_URL + '/data/epidemic/epidemic.json')
                    .then(resp => this.handle_epidemic_resp(resp.data))
                    .catch(e => console.log('epidemic fallback failed', e))
            })

        requestRegionsInfo().then(csvdata => {
                csvdata.forEach(value => {
                    const [name, name_zh, name_en, x0, y0, x1, y1] = value
                    this.regionsInfo[name] = {name, name_en, name_zh, bbox: [parseFloat(x0), parseFloat(y0), parseFloat(x1), parseFloat(y1)]}
                    if (name === 'Russia') this.regionsInfo[name].bbox = [7, 37, -163, 78]
                    else if (name === 'United States of America') this.regionsInfo[name].bbox = [-170, 26, -60, 72]
                    else if (name === 'France') this.regionsInfo[name].bbox = [-6, 42, 10, 51]
                })
                // TODO: current use pipe out; later could consider change data format
                const translateData: {[id: string]: {[lang: string]: string}} = {}
                _.forEach(this.regionsInfo, (info, name) => {
                    if (name.split('|').length > 1) return
                    if (name === 'World') name = ''
                    translateData[name] = {zh: info.name_zh, en: info.name_en}
                })
                this.props.onLoadGlobalTranslateData(translateData)
                this.onClick(undefined)
            })
            .catch(err => console.log('regions info failed', err))

        this.map.on('zoomend', () => this.reloadEpidemicMap())
        this.map.on('moveend', () => this.handleMapMove())
        this.map.on('sourcedata', () => this.reloadEpidemicMap())

        this.map.on('mousemove', (e) => this.onHover(this._selectTargetFeature(this.map!.queryRenderedFeatures(e.point))))
        this.map.on('mousedown', (e) => this.onClick(this._selectTargetFeature(this.map!.queryRenderedFeatures(e.point))))
    }

    handleMapMove() {
        if(this.map) {
            let zoom: number = this.map.getZoom();
            let lnglat: mapboxgl.LngLat = this.map.getCenter();
            let region: IHotRegion | undefined = HOT_REGIONS.find(region => {
                return zoom >= region.zoomMin &&
                    lnglat.lng >= region.bound[0] && lnglat.lng <= region.bound[2] && 
                    lnglat.lat >= region.bound[1] && lnglat.lat <= region.bound[3];
            })
            if(region && region != this.curHotRegion) {
                this.curHotRegion = region;
                this.drawHotRegion();
            }else if(!region && this.curHotRegion) {
                this.curHotRegion = null;
                this.clearHotRegion();
            }
        }
    }

    private hotMarkers: {[loc: string]: mapboxgl.Marker} = {}
    private hotEvents: IHotMarkerProps[] = []
    drawHotRegion() {
        this.clearHotRegion();
        if(this.curHotRegion) {
            requestHotRegions(this.curHotRegion.name).then(data => {
                if(this.curHotRegion && data && data.status) {
                    let regions: ISearchRegion[] = data.data;
                    regions.forEach(region => {
                        let risk: number = Number(region.risk_level || "1");
                        if(risk > 1) {
                            let lnglat: mapboxgl.LngLatLike = {
                                lng: Number(region.geo.longitude),
                                lat: Number(region.geo.latitude)
                            }
                            if(!this.hotMarkers[region.code]) {
                                this.hotMarkers[region.code] = new mapboxgl.Marker(document.createElement('div')).setLngLat(lnglat).addTo(this.map!);
                            }
                            this.hotEvents.push({ code: region.code, risk_level: Number(region.risk_level || "1"), label: region.region, lang: this.props.env.lang, onClick: () => {}});
                        }
                    })
                }
            })
        }
    }

    clearHotRegion() {
        Object.keys(this.hotMarkers).forEach(loc => {
            this.hotMarkers[loc].remove()
            delete this.hotMarkers[loc]
        })
        this.hotEvents = []
    }

    componentDidMount() {
        this.init()
        setInterval(() => {
            if(!this.props.env.speed) {
                this.updateEpidemic();
            }
        }, 180000);
    }

    private markers: {[loc: string]: mapboxgl.Marker} = {}
    private events: IEventMarkerProp[] = []
    updateMarkers() {
        if (this.map && this.map.getSource('composite') && this.map.isSourceLoaded('composite')) {
            const dailyNews = this.dailyNews[this.props.date] || {}
            // const mappings: {[name_zh: string]: Position} = {}
            // const translations: {[name_zh: string]: string} = {}
            // this.map.querySourceFeatures('composite', { sourceLayer: 'place_label' }).forEach(feature => {
            //     mappings[feature.properties!['name_zh-Hans']] = (feature.geometry as Point).coordinates
            //     translations[feature.properties!['name_zh-Hans']] = feature.properties!['name_en']
            // })
            const mappedNews: {[date: string]: INews[]} = {}
            if(this.props.markerVisible) {
                _.forEach(dailyNews, (news: INews[], loc: string) => {
                    // const _loc = _.reverse(loc.split('.')).find(l => mappings[l])
                    // if (!_loc) return
                    if (!mappedNews[loc]) mappedNews[loc] = []
                    news.forEach(n => mappedNews[loc].push(n))
                })
            }
            // remove outdated markers
            _.forEach(Object.keys(this.markers), loc => {
                if (!mappedNews[loc]) {
                    this.markers[loc].remove()
                    delete this.markers[loc]
                }
            })
            if(this.props.markerVisible) {
                // update new markers
                this.events = _.map(mappedNews, (news: INews[], loc: string) => {
                    let lonlat: mapboxgl.LngLatLike = {
                        lon: Number(news[0].geoInfo[0].longitude),
                        lat: Number(news[0].geoInfo[0].latitude)
                    }
                    if (!this.markers[loc]) {
                        this.markers[loc] = new mapboxgl.Marker(document.createElement('div')).setLngLat(lonlat).addTo(this.map!)
                    }
                    return { news, loc_zh: loc, loc_en : loc, lang: this.props.env.lang, onClick: this.props.onEventClick }
                }) //.sort((a, b) => (a.pos[0] - b.pos[0]))
            }
        } else if (this.map) {
            this.map.once('sourcedata', (e) => {
                this.updateMarkers()
                this.componentDidUpdate(this.props)
            })
        }
    }

    componentDidUpdate(preProps: IProp) {
        if (this.map) {
            this.events.forEach(prop => {
                if (this.markers[prop.loc_zh]) {
                    ReactDOM.render(<EventMarker onClick={prop.onClick} news={prop.news} loc_zh={prop.loc_zh} loc_en={prop.loc_en} lang={prop.lang}/>, this.markers[prop.loc_zh].getElement())
                    // this.markers[prop.loc_zh].addTo(this.map!)
                }
            })
            this.hotEvents.forEach(prop => {
                if (this.hotMarkers[prop.code]) {
                    ReactDOM.render(<HotMarker onClick={prop.onClick} risk_level={prop.risk_level} code={prop.code} label={prop.label} lang={prop.lang}/>, this.hotMarkers[prop.code].getElement())
                }
            })
            if(this.props.hotRegion && this.props.hotRegion != preProps.hotRegion) {
                let region: IHotRegion | undefined = HOT_REGIONS.find(region => region.name == this.props.hotRegion);
                if(region) {
                    this.handleLocate({longitude: region.center[0].toString(), latitude: region.center[1].toString()}, region.zoom);
                }
            }
            if(preProps.date != this.props.date) {
                this.onClick(this._click_feature)
            }
        }
    }

    _syncNews() {
        if (this.map && (this.news !== this.props.news) || (this.langAll != this.props.langAll)) {
            this.langAll = this.props.langAll;
            this.news = this.props.news
            this.dailyNews = {};
            this.news.forEach(obj => {
                const date: string = dateformat(obj.date, 'yyyy-mm-dd')
                if (!this.dailyNews[date]) this.dailyNews[date] = {}
                obj.data.forEach(event => {
                    if (event.geoInfo.length < 1) return
                    if (!this.langAll && (event.lang && event.lang != this.props.env.lang)) return;
                    const loc = event.geoInfo[0].geoName
                    if (this.dailyNews[date][loc] === undefined) this.dailyNews[date][loc] = []
                    this.dailyNews[date][loc].push(event)
                })
            })
        }
    }

    // onThemeChange will trigger reload map
    // TODO: Add alternative style
    // current not working
    onThemeChange() {
        this.theme = this.props.theme
        // TODO add dark theme
        this.map?.setStyle(DEFAULT_STYLE)
        this.map?.once('styledata', () => this.forceUpdate())
    }

    onLanguageChange() {
        if (this.map && this.map.isStyleLoaded() && this.lang !== this.props.env.lang) {
            this.lang = this.props.env.lang
            setMapLanguage(this.map, this.lang)
        }
    }

    render() {
        if (this.theme !== this.props.theme) this.onThemeChange()
        else {
            if (this.lang !== this.props.env.lang) this.onLanguageChange()
            this._syncNews()
            if (this.map && (this.date !== this.props.date || this.mapMode !== this.props.mapMode)) {
                this.date = this.props.date
                this.mapMode = this.props.mapMode
                this.reloadEpidemicMap()
            }
            this.updateMarkers()
        }
        return <div className="mapbox-layout">
            <div id="mapbox-container" ref={e => this.container = e}/>
            {/* {this.events.map(prop =>
                <EventMarker key={prop.loc_zh} loc_en={prop.loc_en} loc_zh={prop.loc_zh} pos={prop.pos} lang={prop.lang} news={prop.news}/>
            )} */}
        </div>
    }
}
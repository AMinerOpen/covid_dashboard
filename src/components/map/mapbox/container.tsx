import React from 'react'
import ReactDOM from 'react-dom'
import './container.scss'
import * as mapboxgl from 'mapbox-gl'
import _ from 'lodash'
import { ITimeline, IEpidemicData, IRegionEpidemicDayData, INews, IEpidemicSeries, IRegionEpidemicData, IEpidemicCompressedData, IRegionInfo } from '../../../models'
import { Position } from 'geojson'
import { setMapLanguage, preprocessRenderData } from './utils'
import dateformat from 'dateformat'
import EventMarker, { IEventMarkerProp } from './event-marker'
import { IDefaultProps } from '../../../global'
import axios from 'axios'
import { getLastDate } from '../../../utils/epidemic'
import { DAYMILLS } from '../../../utils/date'
import { initMapbox } from './mapbox.js';
import { requestRegionsInfo, requestEpidemic } from '../../../utils/requests'

const PROVINCE_MIN_ZOOM = 2.8
const COUNTY_MIN_ZOOM = 4.5

const COUNTRY_SOURCE_LAYER = 'countries'
const REGIONE_SOURCE_LAYER = 'regione-0411'
const PROVINCE_SOURCE_LAYER = 'provinces'
const COUNTY_SOURCE_LAYER = 'China-counties'

function get_source_layer_priority(source_layer: string): number {
    if (source_layer === COUNTRY_SOURCE_LAYER) return 0
    if (source_layer === REGIONE_SOURCE_LAYER) return 1
    if (source_layer === PROVINCE_SOURCE_LAYER) return 2
    return 3
}

const DEFAULT_STYLE = 'mapbox://styles/somefive/ck842alxl33y01ipj9342t85s'

interface IProp extends IDefaultProps {
    date: string
    theme: string
    langAll: boolean
    onHover: (info: IRegionInfo, dayEp: Partial<IRegionEpidemicDayData>) => void
    onLoadGlobalEpData: (epData:  {[id: string]: ITimeline<IEpidemicData>}) => void
    onLoadGlobalTranslateData: (transData: {[id: string]: {[lang: string]: string}}) => void
    onChangeEndDate: (date: Date) => void
    news: {date: Date, data: INews[]}[]
    onEventClick: (data: any) => void
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

    private regionEpidemicData: {[id: string]: IRegionEpidemicData} = {}

    private regionsInfo: {[id: string]: IRegionInfo} = {}

    constructor(props: IProp) {
        super(props)
        this.langAll = props.langAll;
        this.handle_epidemic_resp = this.handle_epidemic_resp.bind(this);
    }

    __getDayEp(ep: IRegionEpidemicData, globalOffset: number, fallback: Partial<IRegionEpidemicDayData>): Partial<IRegionEpidemicDayData> {
        const idx = globalOffset - ep.offset
        if (idx < 0 || ep.data.length === 0) return fallback
        if (idx >= ep.data.length) return ep.data[ep.data.length - 1]
        return ep.data[idx]
    }

    private _hover_feature?: mapboxgl.MapboxGeoJSONFeature
    private hover_feature?: mapboxgl.MapboxGeoJSONFeature
    private _hover_date: string = ''
    private _hover_update = _.debounce(() => {
        if (this.hover_feature) this.map?.setFeatureState(this.hover_feature, { hover_opacity: undefined, hover_stroke_opacity: undefined })
        this.hover_feature = this._hover_feature
        if (this.hover_feature) this.map?.setFeatureState(this.hover_feature, { hover_opacity: 0.9, hover_stroke_opacity: 0.5 })
        const name = this.hover_feature === undefined ? 'World' : this.hover_feature.properties!.name
        const globalOffset = new Date(this.props.date).getTime() / DAYMILLS
        const ep = this.regionEpidemicData[name]
        if (!ep) return
        const dayEp = this.__getDayEp(ep, globalOffset, {})
        this.props.onHover(this.regionsInfo[name], dayEp)
    })

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
        const globalOffset = new Date(this.props.date).getTime() / DAYMILLS
        const forceDisplayMinZoom = [0, PROVINCE_MIN_ZOOM, COUNTY_MIN_ZOOM, 16];
        [COUNTRY_SOURCE_LAYER, REGIONE_SOURCE_LAYER, PROVINCE_SOURCE_LAYER, COUNTY_SOURCE_LAYER].forEach(sourceLayer => {
            this.map!.querySourceFeatures('composite', { sourceLayer }).forEach((feature) => {
                const ep = this.regionEpidemicData[feature.properties!.name]
                if (ep) {
                    const dayEp = this.__getDayEp(ep, globalOffset, {display: false, color: '#ffffff'})
                    // current need display and (either next level not displayed or no child display)
                    const opacity = (dayEp.display && ((this.map!.getZoom() <= forceDisplayMinZoom[ep.level]) || (!dayEp.childDisplay))) ? 0.7 : 0
                    const stroke_opacity = (opacity > 0) ? (
                        sourceLayer === COUNTRY_SOURCE_LAYER ? 0.1 : (
                            sourceLayer === COUNTY_SOURCE_LAYER ? 0.03 : 0.06
                        )
                    ) : 0
                    const color = (opacity > 0) ? dayEp.color : '#ffffff'
                    this.map!.setFeatureState({source: 'composite', sourceLayer, id: feature.id}, { color, opacity, stroke_opacity })
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
                    remain_delta: dayEp.remain_delta || 0
                }
            })
        })
        console.log('load ep data')
        this.props.onLoadGlobalEpData(globalEpData)
        this.onHover(undefined, true)
    }

    updateEpidemic() {
        requestEpidemic().then(this.handle_epidemic_resp);
    }

    init() {
        if (!this.container) {
            setTimeout(this.init.bind(this), 50)
            return
        }
        let isMobile: boolean = this.props.env.isMobile;
        initMapbox();
        this.map = new mapboxgl.Map({
            container: 'mapbox-container',
            style: DEFAULT_STYLE,
            center: isMobile ? [70, 20] : [200, 70],
            zoom: isMobile ? 0.5 : 1,
            minZoom: 0,
            maxZoom: 9
        })

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
                console.log('load regions info')
                this.props.onLoadGlobalTranslateData(translateData)
                this.onHover(undefined, true)
            })
            .catch(err => console.log('regions info failed', err))

        this.map.on('zoomend', () => this.reloadEpidemicMap())
        this.map.on('sourcedata', () => this.reloadEpidemicMap())

        this.map.on('mousemove', (e) => this.onHover(this._selectTargetFeature(this.map!.queryRenderedFeatures(e.point))))
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
            _.forEach(dailyNews, (news: INews[], loc: string) => {
                // const _loc = _.reverse(loc.split('.')).find(l => mappings[l])
                // if (!_loc) return
                if (!mappedNews[loc]) mappedNews[loc] = []
                news.forEach(n => mappedNews[loc].push(n))
            })
            // remove outdated markers
            _.forEach(Object.keys(this.markers), loc => {
                if (!mappedNews[loc]) {
                    this.markers[loc].remove()
                    delete this.markers[loc]
                }
            })
            // update new markers
            this.events = _.map(mappedNews, (news: INews[], loc: string) => {
                let pos: Position = [ Number(news[0].geoInfo[0].longitude), Number(news[0].geoInfo[0].latitude)]
                let lonlat: mapboxgl.LngLatLike = {
                    lon: Number(news[0].geoInfo[0].longitude),
                    lat: Number(news[0].geoInfo[0].latitude)
                }
                if (!this.markers[loc]) {
                    this.markers[loc] = new mapboxgl.Marker(document.createElement('div')).setLngLat(lonlat).addTo(this.map!)
                }
                return { news, loc_zh: loc, loc_en : loc, lang: this.props.env.lang, pos, onClick: this.props.onEventClick }
            }) //.sort((a, b) => (a.pos[0] - b.pos[0]))
        } else if (this.map) {
            this.map.once('sourcedata', (e) => {
                this.updateMarkers()
                this.componentDidUpdate()
            })
        }
    }

    componentDidUpdate() {
        if (this.map) {
            this.events.forEach(prop => {
                if (this.markers[prop.loc_zh]) {
                    ReactDOM.render(<EventMarker onClick={this.props.onEventClick} news={prop.news} loc_zh={prop.loc_zh} loc_en={prop.loc_en} lang={prop.lang}/>, this.markers[prop.loc_zh].getElement())
                    // this.markers[prop.loc_zh].addTo(this.map!)
                }
            })
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

    onDateChange() {
        if (this.map && this.date !== this.props.date) {
            this.date = this.props.date
            this.reloadEpidemicMap()
            this.onHover(this.hover_feature)
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
            if (this.date !== this.props.date) this.onDateChange()
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
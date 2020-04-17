import * as mapboxgl from 'mapbox-gl'
import { IEpidemicSeries, IRegionEpidemicData } from '../../../models'
import _ from 'lodash'
import { DAYMILLS } from '../../../utils/date'
import { risk2color } from '../../../utils/color'

export function setMapLanguage(map: mapboxgl.Map, lang: string) {
    if (lang === 'zh') lang = 'zh-Hans'
    const handleCoalesce = (arr: mapboxgl.Expression) => {
        arr.slice(1).forEach(item => {
            if (Array.isArray(item) && item[0] === 'get' && (item[1] as string).startsWith('name_')) item[1] = `name_${lang}`
        })
    }
    const handleStep = (arr: mapboxgl.Expression) => {
        arr.forEach(item => {
            if (Array.isArray(item) && item[0] === 'coalesce') handleCoalesce(item as mapboxgl.Expression)
            else if (Array.isArray(item) && item[0] === 'step') handleStep(item as mapboxgl.Expression)
        })
    }
    map.getStyle().layers?.forEach(layer => {
        if (layer.layout) {
            const oldTF = (layer.layout as mapboxgl.SymbolLayout)['text-field']
            if (!oldTF) return
            switch ((oldTF as mapboxgl.Expression)[0]) {
                case 'coalesce':
                    handleCoalesce(oldTF as mapboxgl.Expression)
                    break
                case 'step':
                    handleStep(oldTF as mapboxgl.Expression)
                    break
                default: break
            }
            map.setLayoutProperty(layer.id, 'text-field', oldTF)
        }
    })
}

export function preprocessRenderData(src: {[id: string]: IEpidemicSeries}): {[id: string]: IRegionEpidemicData} {
    const t0 = performance.now()
    const n2u = (x: number | null): number | undefined => { return x === null ? undefined : x  }
    const delta = (x: number | null, y: number | null): number | undefined => { return (x !== null && y !== null) ? (x - y) : undefined }
    const resultMap: {[id: string]: IRegionEpidemicData} = {}
    _.forEach(src, (series, id) => {
        let _remain: number | null = null
        resultMap[id] = {
            level: id.split('|').length,
            offset: Math.floor(new Date(series.begin).getTime() / DAYMILLS),
            data: _.map(series.data, (data, idx) => {
                const [confirmed, suspected, cured, dead, severe, risk] = data
                const [_confirmed, _suspected, _cured, _dead, _severe, _risk] = idx > 0 ? series.data[idx-1] : [null, null, null, null, null, null]
                const remain = (confirmed !== null) ? Math.max(confirmed - (cured || 0) - (dead || 0), 0) : null
                const daydata = {
                    display: data.findIndex(x => x !== undefined && x !== null) >= 0,
                    childDisplay: false,
                    color: risk2color(risk), //confirmed2color(confirmed, cured),
                    confirmed: n2u(confirmed),      confirmed_delta: delta(confirmed, _confirmed),
                    suspected: n2u(suspected),      suspected_delta: delta(suspected, _suspected),
                    cured: n2u(cured),              cured_delta: delta(cured, _cured),
                    dead: n2u(dead),                dead_delta: delta(dead, _dead),
                    severe: n2u(severe),            severe_delta: delta(severe, _severe),
                    remain: n2u(remain),            remain_delta: delta(remain, _remain),
                    risk: n2u(risk),                risk_delta: delta(risk, _risk),
                }
                _remain = remain
                return daydata
            })
        }
    })
    // console.log('mapping', performance.now()-t0, 'mills')
    _.forEach(resultMap, (result, id) => {
        if (id.indexOf('|') < 0) return
        const parentId = id.slice(0, id.lastIndexOf('|'))
        const parentResult = resultMap[parentId]
        if (!parentResult) return
        _.forEach(result.data, (style, idx) => {
            const parentIdx = idx - result.offset + parentResult.offset
            if (parentIdx >= 0 && parentIdx < parentResult.data.length && style.display)
                resultMap[parentId].data[parentIdx].childDisplay = true
        })
    })
    // console.log('total', performance.now()-t0, 'millis')
    return resultMap
}
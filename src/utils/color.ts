import chromajs from 'chroma-js'
import _ from 'lodash'

function getSeriousLevel(cnt: number): number {
    if (cnt >= 10000) return 5
    if (cnt >= 1000) return 4
    if (cnt >= 100) return 3
    if (cnt >= 10) return 2
    if (cnt >= 1) return 1
    return 0
}

function getCuredLevel(cured_rate: number): number {
    if (cured_rate >= 0.9) return 5
    if (cured_rate >= 0.75) return 4
    if (cured_rate >= 0.5) return 3
    if (cured_rate >= 0.25) return 2
    if (cured_rate >= 0.1) return 1
    return 0
}

const LEVELS = 6
const OrRd = chromajs.scale(['#ffffff', '#ff8924', '#ad0003']).colors(LEVELS)
const Blues = chromajs.scale(['#ffffff', '#ffffff', 'lawngreen']).colors(LEVELS)
const EpColors = _.range(LEVELS).map(idx => chromajs.scale([OrRd[idx], Blues[idx]]).colors(LEVELS))

export function confirmed2color(confirmed?: number | null, cured?: number | null) {
    if (confirmed === undefined || confirmed === null) return '#f0f0f0'
    const confirmedLevel = getSeriousLevel(confirmed)
    if (cured === undefined || cured === null || confirmed === 0) return OrRd[confirmedLevel]
    const curedLevel = getCuredLevel(cured / confirmed)
    return EpColors[confirmedLevel][curedLevel]
}

const RISKINTERVAL = 100 / (LEVELS - 1)

export function risk2color(risk?: number | null) {
    if (risk === undefined || risk === null) return '#f0f0f0'
    return OrRd[Math.max(Math.min(Math.ceil(risk / RISKINTERVAL), LEVELS), 0)]
}
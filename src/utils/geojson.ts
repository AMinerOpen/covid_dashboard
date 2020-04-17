import { Geometry, Position } from 'geojson'
import polylabel from 'polylabel'
import * as turf from '@turf/turf'

export const RESO = 50

export function geocentroid(geometry: Geometry): Position {
    if (geometry.type === 'Polygon') {
        return polylabel(geometry.coordinates)
    } else if (geometry.type === 'MultiPolygon') {
        let largestIdx = 0, largestArea = 0
        geometry.coordinates.forEach((coordinates, idx) => {
            const area = turf.area(turf.polygon(coordinates))
            if (area > largestArea) {
                largestIdx = idx
                largestArea = area
            }
        })
        return polylabel(geometry.coordinates[largestIdx])
    }
    else {
        throw new Error('unexpected geometry type ' + geometry.type)
    }
}


function pts2path(pts: Position[]): string {
    let path = ''
    if (pts.length > 0) path = `M ${pts[0][0] * RESO},${-pts[0][1] * RESO}`
    if (pts.length > 1) pts.slice(1).forEach(co => { path += ` L ${co[0] * RESO},${-co[1] * RESO}` })
    return path
}

function poly2path(polygon: Position[][]): string {
    return polygon.map(pts2path).join(' ')
}

export function genpaths(geometry: Geometry): string[] {
    if (geometry.type === 'Polygon') {
        return [poly2path(geometry.coordinates)]
    } else if (geometry.type === 'MultiPolygon') {
        return geometry.coordinates.map(poly2path)
    } else {
        return []
    }
}
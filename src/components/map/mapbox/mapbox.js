import * as mapboxgl from 'mapbox-gl'

export const DEFAULT_STYLE = 'mapbox://styles/somefive/ck842alxl33y01ipj9342t85s';
export const mapTool = {onLocate: (geo, zoom) => {}};

export function initMapbox(isMobile, onLocate) {
    mapTool.onLocate = onLocate;
    if(process.env.REACT_APP_MAPBOX_PROXY) {
        mapboxgl.baseApiUrl = process.env.REACT_APP_MAPBOX_PROXY;
    }
    if(!process.env.REACT_APP_MAPBOX_ACCESSTOKEN) {
        console.error("REACT_APP_MAPBOX_ACCESSTOKEN missing, config REACT_APP_MAPBOX_ACCESSTOKEN in PROJECT_ROOT/.env.local");
    }else {
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESSTOKEN;
    }
    return new mapboxgl.Map({
        container: 'mapbox-container',
        style: DEFAULT_STYLE,
        center: isMobile ? [70, 20] : [200, 70],
        zoom: isMobile ? 0.5 : 1,
        minZoom: 0,
        maxZoom: 9
    })
}
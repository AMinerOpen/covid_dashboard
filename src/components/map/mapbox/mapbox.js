import * as mapboxgl from 'mapbox-gl'

export function initMapbox() {
    if(process.env.REACT_APP_MAPBOX_PROXY) {
        mapboxgl.baseApiUrl = process.env.REACT_APP_MAPBOX_PROXY;
    }
    if(!process.env.REACT_APP_MAPBOX_ACCESSTOKEN) {
        console.error("REACT_APP_MAPBOX_ACCESSTOKEN missing, config REACT_APP_MAPBOX_ACCESSTOKEN in PROJECT_ROOT/.env.local");
    }else {
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESSTOKEN;
    }
}
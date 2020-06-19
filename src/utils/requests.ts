import axios from 'axios'
import _ from 'lodash'

const parsecsv = require('csv-parse/lib/sync')

export async function requestEvents() {
    const resp = await axios.get(process.env.REACT_APP_API_URL + '/dist/events.json', { headers: {'Cache-Control': 'no-cache'} })
    return resp.data as any
}

export async function requestHots() {
    const resp = await axios.get(process.env.REACT_APP_API_URL + '/dist/hot-items.json', { headers: {'Cache-Control': 'no-cache'} })
    return resp.data as any
}

export async function requestEventsUpdate(tflag: number) {
    const resp = await axios.get(process.env.REACT_APP_API_URL + '/events/update?tflag=' + tflag, { headers: {'Cache-Control': 'no-cache'} })
    return resp.data as any
}

export async function requestEpidemic() {
    const resp = await axios.get(process.env.REACT_APP_API_URL + '/dist/epidemic.json', { headers: {'Cache-Control': 'no-cache' }})
    return resp.data
}

export async function requestRegionsInfo() {
    const resp = await axios.get(process.env.REACT_APP_API_URL + '/dist/regions-info.csv', { headers: {'Cache-Control': 'no-cache' }})
    const csvdata = parsecsv(resp.data) as any[][]
    return csvdata
}

export async function requestEvent(id: string) {
    const resp = await axios.get(process.env.REACT_APP_API_URL + '/event/' + id, { headers: {'Cache-Control': 'no-cache'} })
    return resp.data as any
}

export async function requestEntity(url: string, time: number) {
    let req: string = process.env.REACT_APP_API_URL + '/entity?url=' + url + "&time=" + time;
    const resp = await axios.get(req, { headers: {'Cache-Control': 'no-cache'} })
    return resp.data as any
}

export async function requestSearchEvent(text: string) {
    const resp = await axios.get(process.env.REACT_APP_API_URL + '/events/search', { params: { q: text } })
    const items = (resp.data as any).data
    console.log('items', items)
    items.sort((a: any, b: any) => b.time.localeCompare(a.time))
    return items
}

export async function requestRiver(size: 'sm' | 'md' | 'lg') {
    // let url: string = process.env.REACT_APP_API_URL + `/dist/flattened_timelines_${size}.json`;
    let url: string = process.env.REACT_APP_API_URL + `/dist/hierarchical_timelines_${size}.json`;
    const resp = await axios.get(url, { headers: {'Cache-Control': 'no-cache'} })
    return resp.data as any
}

export async function requestEventsTree() {
    const resp = await axios.get(process.env.REACT_APP_API_URL + '/dist/events-tree.json', { headers: {'Cache-Control': 'no-cache' }})
    return resp.data as any
}

export async function requestSearch(q: string) {
    const url: string = `${process.env.REACT_APP_API_URL}/search?q=${q}`;
    const resp = await axios.get(url, { headers: {'Cache-Control': 'no-cache'}})
    return resp.data as any
}

export async function requestEntityHint(name: string) {
    const url: string = `https://innovaapi.aminer.cn/covid/api/v1/pneumonia/hit?name=${name}`;
    const resp = await axios.get(url);
    return resp.data as any;
}

export async function requestEntityView(url: string) {
    const req: string = `https://innovaapi.aminer.cn/covid/api/v1/pneumonia/view?url=${url}`;
    const resp = await axios.get(req);
    return resp.data as any;
}
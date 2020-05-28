import { IEpidemicSeries, IEpidemicCompressedData } from '../models'
import { DAYMILLS } from '../utils/date'

export function getEpidemicDataByDate(series: IEpidemicSeries, date: string): IEpidemicCompressedData {
    const diff = Math.floor((new Date(date).getTime() - new Date(series.begin).getTime()) / DAYMILLS)
    return (diff < 0 || diff >= series.data.length) ? [null, null, null, null, null, null, null] : series.data[diff]
}

export function getLastDate(series: IEpidemicSeries): Date {
    const time = new Date(series.begin).getTime() + (series.data.length - 1) * DAYMILLS
    return new Date(time)
}
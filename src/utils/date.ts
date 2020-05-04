import dateformat from 'dateformat'

export const DAYMILLS = 1000 * 60 * 60 * 24

export function calcDaysAgo(date: string, days: number): string {
    const d = new Date(date)
    d.setDate(d.getDate() - days)
    return dateformat(d, 'yyyy-mm-dd')
}

export function calcDaysDiff(d1: string, d2: string): number {
    return Math.floor((new Date(d1).getTime() - new Date(d2).getTime()) / DAYMILLS);
}

export function str2Date(str: string): Date {
    let timeStr: string = str.replace(" ", "T");
    if(timeStr.indexOf("T") >= 0) timeStr += ".000+08:00";
    return new Date(timeStr);
}

const _date2idx: {[date: string]: number} = {}
const _idx2date: {[idx: number]: string} = {}
{
    let d = str2Date('2019/12/01')
    const endDate = new Date()
    let i = 0
    while (d <= endDate) {
        const dateStr = dateformat(d, 'yyyy-mm-dd')
        _idx2date[i] = dateStr
        _date2idx[dateStr] = i++
        d.setDate(d.getDate()+1)
    }
}

export function date2idx(date: string | Date): number {
    if (typeof(date) !== 'string') date = dateformat(date, 'yyyy-mm-dd')
    return _date2idx[date] || -1
}

export function idx2date(idx: number): string {
    return _idx2date[idx] || ''
}

export const maxDateIdx = date2idx(new Date)

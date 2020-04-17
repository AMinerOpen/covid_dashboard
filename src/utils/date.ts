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
import _ from 'lodash'

export interface IEvent {
    related_events?: string[]
    time: Date
    date: string
    title: string
}
export interface IEvents {
    [id: string]: IEvent
}

interface IGlobalStorage {
    events: IEvents
    getEventsByDate: (date: string) => IEvent[]
}

const events: IEvents = {}

const GlobalStorage: IGlobalStorage = {
    events,
    getEventsByDate: (date: string) => _.filter(events, event => event.date === date)
}

export default GlobalStorage
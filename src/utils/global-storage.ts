import _ from 'lodash'

interface IEvent {
    related_events?: string[]
    time: Date
    date: string
}
interface IEvents {
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
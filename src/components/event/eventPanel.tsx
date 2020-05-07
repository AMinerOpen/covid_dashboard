import * as React from 'react';
import './eventPanel.scss';
import { IDefaultProps } from '../../global';
import { FormattedMessage } from 'react-intl'
import { requestEvent } from '../../utils/requests';
import EventFlag from '../eventFlag/eventFlag';
import dateFormat from 'dateformat';
import GlobalStorage from '../../utils/global-storage';
import _ from 'lodash'
import { getEventColor } from '../eventFlag/utils';
import { str2Date } from '../../utils/date';
import EntityFlag from '../entityFlag/entityFlag';

interface IProps extends IDefaultProps {
    events: any[];
    focusEvent?: any;
    date: Date;
    onClose: () => void;
}

interface IState {
    curEvents: any[];
    entities: any[];
    hightlight: string;
    eventDetail: any;
    date: Date;
}

export default class EventPanel extends React.Component<IProps, IState> {
    private _curEventId: string = "";
    private _closeLock: boolean = true;

    constructor(props: IProps) {
        super(props);
        let events: any[] = [];
        if(this.props.events && this.props.events.length) {
            let obj: any = this.props.events.find(d => this.sameDay(d.date, this.props.date!));
            if(obj) {
                events = obj.data;
            }
        }
        this.state = {
            curEvents: events,
            entities: [],
            hightlight: "",
            eventDetail: null,
            date: this.props.date
        };
        this.handleMapEntities = this.handleMapEntities.bind(this);
        this.handleSelectEvent = this.handleSelectEvent.bind(this);
        this.handleClose = this.handleClose.bind(this);
        if (this.props.focusEvent) this.handleSelectEvent(this.props.focusEvent._id)
    }

    public componentDidMount() {
        setTimeout(() => {
            this._closeLock = false;
        }, 1000);
    }

    public componentDidUpdate(preProps: IProps, preState: IState) {
        if(this.state.hightlight && preState.hightlight != this.state.hightlight) {
            let div: HTMLDivElement | null = document.getElementById(this.state.hightlight) as HTMLDivElement;
            if(div) {
                div.scrollIntoView();
            }
        }
        if(preState.eventDetail != this.state.eventDetail) {
            this.requestEntities();
        }
    }

    private handleClose() {
        if(!this._closeLock) {
            this.props.onClose && this.props.onClose();
        }
    }

    private sameDay(a: Date | string, b: Date | string): boolean {
        if (typeof a === 'string') a = str2Date(a)
        if (typeof b === 'string') b = str2Date(b)
        return a.getFullYear() == b.getFullYear() && a.getMonth() == b.getMonth() && a.getDate() == b.getDate();
    }

    private requestEntities(): void {
        let event: any = this.state.eventDetail;
        if(event.entities && event.entities.length) {
            let exists: any[] = [];
            event.entities.forEach((d: any) => {
                if((event.title && event.title.indexOf(d.label) >= 0) || (event.content && event.content.indexOf(d.label) >= 0)) {
                    exists.push(d);
                }
            })
            if(exists.length) {
                let urls:string = encodeURI('[' + exists.map((d: any) => "\"" + d.url + "\"").join(',') + ']');
                let url: string = "https://covid19.aminer.cn/getEntities?urls=" + urls;
                fetch(url).then(response => response.json()).then(data => {
                    if(data && data.length) {
                        this.setState({entities: data});
                    }
                })
            }
        }
    }

    private handleSelectEvent(id: string): void {
        if(id != this._curEventId) {
            this._curEventId = id;
            requestEvent(id).then(data => {
                if(data && data.status) {
                    if(this._curEventId == data.data._id) {
                        this.setState({eventDetail: data.data});
                    }
                }
            })
        }
    }

    private entityContent(entity: any): string {
        let content: string = "";
        if(entity.lang == 'zh') {
            content = entity.abstractInfo.baidu || entity.abstractInfo.zhwiki || entity.abstractInfo.enwiki;
        }else {
            content = entity.abstractInfo.enwiki || entity.abstractInfo.baidu || entity.abstractInfo.zhwiki;
        }
        return content;
    }

    private handleMapEntities(entity: any, index: number): JSX.Element {
        return (
            <div key={index} id={entity.url} className='entity' style={entity.url == this.state.hightlight ? {border: '4px solid #ffe100'} : undefined}>
                {entity.label}<div className='entityflag'><EntityFlag source={entity.source} /></div>
            </div>
        )
    }

    private format(text: string): JSX.Element[] {
        let entities: any[] = this.state.entities;
        let arr: string[] = [text];
        if(entities && entities.length) {
            entities.forEach((d: any) => text = text.replace(new RegExp(d.label, 'g'), "+++"+d.label+"+++"));
            arr = text.split("+++");
        }
        return (
            arr.map((str: string, index: number) => {
                    let entity: any = entities.find((d:any) => d.label == str);
                    let url: string = entity ? entity.url : "";
                    return <span
                        key={index}
                        onMouseOver={url ? () => this.setState({hightlight: url}) : undefined}
                        onClick={url ? () => this.setState({hightlight: url}) : undefined}
                        style={url ? {color: 'darkorange', fontWeight: 'bold'} : undefined}>{str}</span>
            })
        )
    }

    private paperContent(): JSX.Element {
        const event: any = this.state.eventDetail;
        return (
            <div className='content_outter'>
                <div className='paper_line'>Year: <span className='paper_content'>{event.year || '2020'}</span></div>
                <div className='paper_line'>Authors: <span className='paper_content'>{event.authors.map((d:any) => d.name).join(", ")}</span></div>
                { event.pdf && <div className='paper_line'>Pdf: <span className='paper_content'><a href={event.pdf} target='_blank' >[<FormattedMessage id='event.download' />]</a></span></div>}
                { event.content && <div className='paper_line'>Abstract: <span className='paper_content'>{this.format(event.content)}</span></div> }
                <div style={{width: '100%', height: '80px'}}></div>
            </div>
        )
    }

    private newsContent(): JSX.Element {
        const event: any = this.state.eventDetail;
        return (
            <div className='content_outter'>
                { event.content && <div className='paper_line'><span className='paper_content'>{this.format(event.content)}</span></div> }
                { event.urls && event.urls.length > 0 ? (
                    <div className='paper_line'><FormattedMessage id='event.source' />: <a className='paper_content' href={event.urls[0]} style={{color: 'dodgerblue'}} target="_blank">{`[${event.source || "Url"}]`}</a></div>
                ) : (
                    event.source && <div className='paper_line'><FormattedMessage id='event.source' />: <span className='paper_content'>{`[${event.source}]`}</span></div>
                )}
                <div style={{width: '100%', height: '80px'}}></div>
            </div>
        )
    }

    private title(): JSX.Element {
        const event: any = this.state.eventDetail;
        if(event.type == 'paper') {
            return <div className='title' ><EventFlag lang={this.props.env.lang} type={event.type} category={event.category}/><a href={`https://www.aminer.cn/pub/${event.aminer_id}`} target="_blank" style={{color: 'white'}}>{this.format(event.title)}</a></div>
        }else {
            return <div className='title' ><EventFlag lang={this.props.env.lang} type={event.type} category={event.category}/>{this.format(event.title)}</div>
        }
    }

    redirectToRelatedEvent(id: string) {
        const event = GlobalStorage.events[id]
        if (!event) return
        const date = event.date
        const curEvents = GlobalStorage.getEventsByDate(event.date)
        this.setState({date: new Date(date), curEvents})
        this.handleSelectEvent(id)
    }

    public render() {
        const { env } = this.props;
        const { entities, date } = this.state;
        const event = this.state.eventDetail;

        const curEvents = this.state.curEvents || this.props.events

        // calc related events
        const related_events = _.filter(((event || {}).related_events || []).map((re: any) => GlobalStorage.events[re.id]))
        related_events.sort((a, b) => { return b.time - a.time })

        return (
            <div className='eventpanel' onClick={this.handleClose}>
                <div className='panel' onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                    <div className='left'>
                        <div className='events_header'>{`Events ${dateFormat(date, 'yyyy-mm-dd')} (${curEvents.length})`}</div>
                        <div className='list'>
                            <div className='list_inner'>
                            { curEvents.map((value: any, index: number) => {
                                return (
                                    <div className='event_title' key={index} onClick={() => this.handleSelectEvent(value._id)}><EventFlag lang={env.lang} type={value.type} category={value.category}/>{value.title}</div>
                                )
                            })}
                            </div>
                        </div>
                    </div>
                    <div className='mid'>
                        {event && this.title()}
                        { event && event.type == 'paper' && this.paperContent() }
                        { event && event.type == 'news' && this.newsContent() }
                        {
                            event && event.type != 'paper' && event.type != 'news' && event.content && (
                                <div className='content_outter' >
                                    <div className='content' >{this.format(event.content)}</div>
                                    <div style={{width: '100%', height: '80px'}}></div>
                                </div>
                            )
                        }
                    </div>
                    <div className='right'>
                        <div className='events_header'><FormattedMessage id='event.entities' />{` (${entities.length})`}</div>
                        <div className="list">
                            <div className='entities' >
                            { this.state.entities.map(this.handleMapEntities)}
                            </div>
                        </div>
                        { event && related_events && related_events.length > 0 &&
                            <div className="related-events">
                                <div className='events_header'><FormattedMessage id='event.related_events'/></div>
                                <div className='list'>
                                    {related_events.map((ev, idx) => <div key={idx} className="related-event" onClick={() => this.redirectToRelatedEvent(ev._id)}>
                                        <span className="date">{dateFormat(ev.time, 'yyyy-mm-dd')}</span>
                                        <span className="type" style={{background: getEventColor(ev.type)}}>{_.capitalize(ev.type || '')}</span>
                                        <span className="title">{ev.title}</span>
                                    </div>)}
                                </div>
                            </div>
                        }
                    </div>
                </div>

            </div>
        )
    }
}
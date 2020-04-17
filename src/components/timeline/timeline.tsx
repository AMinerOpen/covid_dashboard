import * as React from 'react';
import './timeline.scss';
import { IDefaultProps } from '../../global';
import { Tooltip } from 'antd';
import { requestEvents, requestEventsUpdate } from '../../utils/requests';
import dateFormat from 'dateformat';

interface IState {
    tflag: number;
    events: any[];
    catchEvents: {lang: string, langAll: boolean, events: (JSX.Element|null)[]} | null;
    catchLine: (JSX.Element|null)[] | null;
}

interface IProps extends IDefaultProps {
    langAll: boolean;
    onTflagChange: (tflag: number) => void;
    onOpenEvent: (event:any) => void;
    onLoadNews?: (news: any[]) => void;
    onLoadEvents?: (events: any[]) => void;
    onChangeDate: (date: Date) => void;
    onChangeSpeed: (speed: number) => void;
}

export default class Timeline extends React.Component<IProps, IState> {
    private _ms1Day: number = 24*60*60*1000;
    private _rangeStartDate: Date;
    private _rangeEndDate: Date;
    private _renderStartDate: Date;
    private _renderEndDate: Date;
    private _container: HTMLDivElement | null;
    private _dates: Date[];

    private _date_circle_radius: number = 18;
    private _date_circle_border_width: number = 4;
    private _date_circle_margin: number = 4;
    private _date_line_width: number = 120;
    private _date_line_height: number = 8;
    private _date_bottom: number = 42;

    private _dragging: boolean = false;
    private _moveDelay: number = 20;
    private _moveLock: boolean = false;
    private _lastTouchX: number = 0;
    private _downTime: number = 0;

    private _types: any[] = [
        {
            type: "paper",
            color: "#d3b933"
        },
        {
            type: "news",
            color: "#ef5e66"
        },
        {
            type: "points",
            color: '#00b7cb'
        },
        {
            type: "event",
            color: "#21a985"
        }
    ]

    constructor(props: IProps) {
        super(props);

        this._rangeStartDate = new Date("2020-01-24");
        this._rangeEndDate = new Date();
        this._renderStartDate = new Date("2020-01-10");
        this._renderEndDate = new Date(this._rangeEndDate.getTime() + 15*this._ms1Day);
        let dates: Date[] = [];
        let date: number = this._renderStartDate.getTime();
        while(date < this._renderEndDate.getTime()) {
            dates.push(new Date(date));
            date += this._ms1Day;
        }
        this._dates = dates;

        this.state = {
            tflag: 0,
            events: [],
            catchEvents: null,
            catchLine: null
        }

        this._container = null;
        this.handleDrawDate = this.handleDrawDate.bind(this);
        this.dateWidth = this.dateWidth.bind(this);
        this.handleMapEventsDate = this.handleMapEventsDate.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseWheel = this.handleMouseWheel.bind(this);
        this.updateEvents = this.updateEvents.bind(this);
    }

    public componentDidMount() {
        this.requestEvents()
        this.locatTimeline(this.props.env.date);
        this.setState({catchLine: this._dates.map(this.handleDrawDate)})

        setInterval(() => {
            if(this.props.env.speed == 0) {
                this.updateEvents();
            }
        }, 30000);
    }

    public componentDidUpdate(preProps: IProps, preState: IState) {
        if(!this._dragging && preProps.env.date != this.props.env.date) {
            this.locatTimeline(this.props.env.date);
        }
        if(!this.state.catchEvents || preState.events != this.state.events || this.state.catchEvents.lang != this.props.env.lang || this.state.catchEvents.langAll != this.props.langAll) {
            if(this.state.events.length) {
                this.setState({catchEvents: {
                    lang: this.props.env.lang,
                    langAll: this.props.langAll,
                    events: this.state.events.map(this.handleMapEventsDate)
                }})
            }
        }
    }

    private sameDay(a: Date, b: Date): boolean {
        return a.getFullYear() == b.getFullYear() && a.getMonth() == b.getMonth() && a.getDate() == b.getDate();
    }

    private locatTimeline(date: Date) {
        if(this._container) {
            let left: number = Math.max(0, this.getPointerOffsetX(date) - this._container.clientWidth / 2);
            this._container.scrollLeft = left;
        }
    }

    private getPointerOffsetX(date: Date): number {
        let ratio: number = (date.getTime() - this._renderStartDate.getTime()) / this._ms1Day * this.dateWidth() + this._date_circle_radius/2;
        return ratio;
    }

    private handleTouchStart(e: React.TouchEvent): void {
        if(e.touches.length) {
            this._lastTouchX = e.touches[0].clientX;
            this.handleMouseDown();
        }
    }

    private handleMouseDown(): void {
        window.addEventListener('mouseup', this.handleMouseUp);
        window.addEventListener('touchend', this.handleMouseUp);
        if(this.props.env.speed) {
            this.props.onChangeSpeed(0);
        }
        this._dragging = true;
    }

    private handleMouseUp(e: MouseEvent | TouchEvent): void {
        window.removeEventListener('mouseup', this.handleMouseUp);
        if(this._dragging && this._container) {
            this._dragging = false;
            let targetDate: Date = this.x2Date(this._container.scrollLeft);
            if(targetDate < this._rangeStartDate) targetDate = new Date(this._rangeStartDate);
            if(targetDate > this._rangeEndDate) targetDate = new Date(this._rangeEndDate);
            if(targetDate != this.props.env.date) {
                this.locatTimeline(targetDate);
                this.syncMovingDate(targetDate);
            }
        }
    }

    private x2Date(x: number): Date {
        let date: Date = new Date(((x - this._date_circle_radius/2 + this._container!.clientWidth/2) / this.dateWidth() * this._ms1Day) + this._renderStartDate.getTime());
        return date;
    }

    private handleMouseMove(movementX: number): void {
        if(this._dragging && this._container) {
            let targetDate: Date = this.x2Date(this._container.scrollLeft - movementX);
            if(targetDate < this._rangeStartDate) targetDate = new Date(this._rangeStartDate);
            if(targetDate > this._rangeEndDate) targetDate = new Date(this._rangeEndDate);
            if(targetDate != this.props.env.date) {
                this.locatTimeline(targetDate);
                if(!this._moveLock) {
                    this.syncMovingDate(targetDate);
                }
            }
        }
    }

    private handleMouseWheel(e: React.WheelEvent): void {
        if(!this._moveLock && e.deltaX != 0 && this._container) {
            let targetDate: Date = this.x2Date(this._container.scrollLeft);
            if(targetDate < this._rangeStartDate) targetDate = new Date(this._rangeStartDate);
            if(targetDate > this._rangeEndDate) targetDate = new Date(this._rangeEndDate);
            if(targetDate != this.props.env.date) {
                this.syncMovingDate(targetDate);
            }
        }
    }

    private syncMovingDate(date: Date): void {
        this.props.onChangeDate && this.props.onChangeDate(date);
        this._moveLock = true;
        setTimeout(() => {
            this._moveLock = false;
        }, this._moveDelay);
    }

    private updateEvents() {
        requestEventsUpdate(this.state.tflag).then(data => {
            if(data && data.status) {
                let tflag: number = data.data.tflag;
                let datas: any[] = data.data.datas;
                if(datas.length) {
                    let events: any[] = [...this.state.events];
                    datas.forEach((d:any) => {
                        let date: Date = new Date(d.time);
                        let dateObj: any = events.find(value => this.sameDay(value.date, date));
                        if(dateObj) {
                                dateObj.data.splice(0, 0, d);
                        }
                    })
                    if (this.props.onLoadNews) {
                        const _events = events.map(event => {return {date: event.date, data: event.data.filter((e: any) => {
                            if (e.type === 'point' || e.type === 'paper') e.category = '学术活动'
                            return e.geoInfo && e.geoInfo.length > 0
                        })}})
                        this.props.onLoadNews(_events)
                    }
                    this.props.onLoadEvents && this.props.onLoadEvents(events);
                    this.setState({events, tflag});
                }else {
                    this.setState({tflag});
                }
                this.props.onTflagChange(tflag);
            }
        })
    }

    private requestEvents() {
        requestEvents().then(data => {
            let tflag: number = data.tflag;
            let events: any[] = this._dates.map(d => {return {date: d, data:[]}});
            data.datas.forEach((d:any) => {
                let date: Date = new Date(d.time);
                let dateObj: any = events.find(value => this.sameDay(value.date, date));
                if(dateObj) {
                    // if(d.type == 'news' && d.lang == 'en') {
                    //     let t: number = 0;
                    //     dateObj.data.forEach((a:any) => a.type == 'news' && a.lang == 'en' && t++);
                    //     if(t < 30) {
                    //         dateObj.data.splice(Math.floor((Math.random() * 100) % dateObj.data.length), 0, d);
                    //     }
                    // }else {
                        let index: number = Math.floor((Math.random() * 100) % dateObj.data.length);
                        dateObj.data.splice(index, 0, d);
                    // }
                }
            })
            if (this.props.onLoadNews) {
                const _events = events.map(event => {return {date: event.date, data: event.data.filter((e: any) => {
                    if (e.type === 'point' || e.type === 'paper') e.category = '学术活动'
                    return e.geoInfo && e.geoInfo.length > 0
                })}})
                this.props.onLoadNews(_events)
            }
            this.props.onLoadEvents && this.props.onLoadEvents(events);
            this.setState({events, tflag});
            this.props.onTflagChange(tflag);
        })
    }

    private dateWidth(): number {
        return this._date_circle_radius + this._date_circle_margin*2 + this._date_line_width;
    }

    private handleDrawDate(value: Date, index: number): JSX.Element {
        let start: number = index * this.dateWidth();
        return (
            <div key={index} style={{
                position: 'absolute',
                left: `${start}px`,
                bottom: `${this._date_bottom}px`,
                marginRight: `${this._date_circle_margin}px`,
                userSelect: 'none'
            }}>
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: `${this._date_circle_radius}px`,
                    height: `${this._date_circle_radius}px`,
                    borderRadius: `${this._date_circle_radius/2}px`,
                    border: `${this._date_circle_border_width}px solid #0095ff`,
                    marginRight: `${this._date_circle_margin}px`
                }} />
                <div style={{
                    position: 'absolute',
                    left: `${this._date_circle_radius + this._date_circle_margin}px`,
                    top: `${(this._date_circle_radius - this._date_line_height)/2}px`,
                    width: `${this._date_line_width}px`,
                    height: `${this._date_line_height}px`,
                    backgroundColor: '#cccccc'
                }} />
                <div style={{
                    position: 'absolute',
                    left: `${this._date_circle_radius + this._date_circle_margin}px`,
                    top: `${this._date_circle_radius/2 + this._date_line_height/2}px`,
                    width: `${this._date_line_width}px`,
                    color: `#d8d8d8`
                }}>{dateFormat(value, "yyyy-mm-dd")}</div>
            </div>
        )
    }

    private drawLine() {
        return (
            <div className='timeline_bar'>
                 {this.state.catchLine}
            </div>
        )
    }

    private handleMapEventsDate(value: any, index: number): JSX.Element | null {
        let scale: number = 0.8;
        let offsetX: number = index * this.dateWidth() + this._date_circle_radius/2;
        const {langAll, env} = this.props;
        let data: any[] = [...value.data];
        let showed: number = 0;
        return (
            <div key={index} className='timeline_date_container' style={{
                left: `${offsetX}px`,
                bottom: `${this._date_bottom + 6}px`
            }}>
                <div key={index} className='timeline_date_list'>
                    { data.map((event: any, dataIndex: number) => {
                        if(showed <= 20 && (langAll || !event.lang || event.lang == env.lang)) {
                            showed += 1;
                            let typeData: any = this._types.find(d => d.type == event.type);
                            return (
                                <Tooltip key={dataIndex} title={event.title} placement='topLeft' mouseEnterDelay={1}>
                                    <div className='timeline_events_item' style={{
                                        height: `26px`}}
                                        onMouseDown={() => this._downTime = new Date().getTime()}
                                        onMouseUp={() => {
                                            if(new Date().getTime() - this._downTime < 300) this.props.onOpenEvent(event);
                                        }}>
                                        <span className='timeline_events_title' style={{
                                            maxWidth: `${(this._date_line_width - 16) / scale}px`,
                                            transform: `scale(${scale})`,
                                            backgroundColor: typeData ? typeData.color : 'green'
                                        }}>
                                            { event.title }
                                        </span>
                                    </div>
                                </Tooltip>
                            )
                        }else {
                            return null;
                        }
                    }) }
                </div>
            </div>
        )
    }

    private drawPointer() {
        return (
            <div className='timeline_pointer' />
        )
    }

    public render() {
        const { events, catchEvents } = this.state;
        return (
            <div className='timeline'>
                {this.drawPointer()}
                <div className='timeline_container'
                    ref={r => this._container = r}
                    onMouseDown={this.handleMouseDown}
                    onTouchStart={this.handleTouchStart}
                    onMouseMove={(e: React.MouseEvent) => this.handleMouseMove(e.movementX)}
                    onTouchMove={(e: React.TouchEvent) => {
                        if(e.touches.length) {
                            this.handleMouseMove(e.touches[0].clientX - this._lastTouchX)
                            this._lastTouchX = e.touches[0].clientX;
                        }}}
                    onWheel={this.handleMouseWheel}>
                        {this.drawLine()}
                        { !!events.length && catchEvents && (
                            <div className='timeline_events'>
                                { catchEvents.events }
                            </div>
                        )}
                </div>
            </div>
        )
    }
}
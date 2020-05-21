import * as React from 'react';
import './timeline.scss';
import { IDefaultProps, sameDay } from '../../global';
import dateformat from 'dateformat'
import { requestEvents, requestEventsUpdate } from '../../utils/requests';
import GlobalStorage from '../../utils/global-storage';
import { CaretRightOutlined, PauseOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import River from '../river/river';

interface IState {
    tflag: number;
    events: any[];
    timelineData: any[];
    catchBars: (JSX.Element|null)[] | null;
    catchLine: (JSX.Element|null)[] | null;
    barHeightRatio: number;
}

interface IProps extends IDefaultProps {
    langAll: boolean;
    onTflagChange: (tflag: number) => void;
    onOpenEvent: (date: Date, data: any, list?: string[]) => void;
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

    private _date_circle_border_width: number = 4;
    private _date_circle_margin: number = 4;
    private _date_line_width: number = 50;
    private _date_line_height: number = 22;
    private _date_bottom: number = 36;
    private _event_bar_width: number = 46;
    private _bar_height_max: number = 160;

    private _dragging: boolean = false;
    private _moveDelay: number = 20;
    private _moveLock: boolean = false;
    private _lastTouchX: number = 0;
    private _downTime: number = 0;

    private _types: any[] = [
        {
            type: "points",
            color: '#00b7cb'
        },
        {
            type: "paper",
            color: "#d3b933"
        },
        {
            type: "event",
            color: "#21a985"
        },
        {
            type: "news",
            color: "#ef5e66"
        }
    ]

    constructor(props: IProps) {
        super(props);

        this._rangeStartDate = new Date(2020,0,24,0,0,0);
        this._rangeEndDate = new Date();
        this._renderStartDate = new Date(2020,0,10,0,0,0);
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
            catchLine: null,
            catchBars: null,
            timelineData: [],
            barHeightRatio: 1
        }

        this._container = null;
        this.handleDrawDate = this.handleDrawDate.bind(this);
        this.dateWidth = this.dateWidth.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseWheel = this.handleMouseWheel.bind(this);
        this.updateEvents = this.updateEvents.bind(this);
        this.drawBars = this.drawBars.bind(this);
        this.handleBar = this.handleBar.bind(this);
        this.handleDateUp = this.handleDateUp.bind(this);
        this.handleBtnClick = this.handleBtnClick.bind(this);
        this.handleRiverLineClick = this.handleRiverLineClick.bind(this);
    }

    public componentDidMount() {
        console.log("monte");
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
        if(preProps.env.date != this.props.env.date) {
            if(!this._dragging) {
                this.locatTimeline(this.props.env.date);
            }
        }
        if(preState.timelineData != this.state.timelineData) {
            this.setState({
                catchBars: this.drawBars()
            })
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
        let ratio: number = (date.getTime() - this._renderStartDate.getTime()) / this._ms1Day * this.dateWidth();
        return ratio;
    }

    private handleRiverLineClick(list: string[]) {
        this.props.onOpenEvent && this.props.onOpenEvent(this.props.env.date, null, list);
    }

    private handleDateUp(date: Date) {
        if((new Date()).getTime() - this._downTime < 300) {
            this.props.onOpenEvent && this.props.onOpenEvent(date, null);
        }
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
        this._downTime = (new Date()).getTime();
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
        let date: Date = new Date(((x + this._container!.clientWidth/2) / this.dateWidth() * this._ms1Day) + this._renderStartDate.getTime());
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
                    let timelineData: any[] = [...this.state.timelineData];
                    this.addToEventsAndTimeline(datas, events, timelineData);
                    this.handleEventsChange(events);
                    let max = timelineData.reduce((pre, cur) => Math.max(pre, cur.data.total), 0);
                    this.setState({events, tflag, timelineData, barHeightRatio: this._bar_height_max / max})
                }else {
                    this.setState({tflag});
                }
                this.props.onTflagChange(tflag);
            }
        })
    }

    private toDate(str: string): Date {
        let timeStr: string = str.replace(" ", "T");
        if(timeStr.indexOf("T") >= 0) timeStr += ".000+08:00";
        return new Date(timeStr);
    }

    private requestEvents() {
        requestEvents().then(data => {
            data.datas.forEach((event: any) => { GlobalStorage.events[event._id] = {...event, time: this.toDate(event.time), date: dateformat(this.toDate(event.time), 'yyyy-mm-dd') } })
            let tflag: number = data.tflag;
            let events: any[] = this._dates.map(d => {return {date: d, data:[]}});
            let timelineData: any[] = this._dates.map(d => {return {date: d, data:{total: 0}}});
            this.addToEventsAndTimeline(data.datas, events, timelineData);
            this.handleEventsChange(events)
            let max = timelineData.reduce((pre, cur) => Math.max(pre, cur.data.total), 0);
            this.setState({tflag, events, timelineData, barHeightRatio: this._bar_height_max / max});
            this.props.onTflagChange(tflag);
        })
    }

    private addToEventsAndTimeline(datas: any[], events: any[], timeline: any[]) {
        datas.forEach((d:any) => {
            let date: Date = this.toDate(d.time);
            let dateObj: any = events.find(value => this.sameDay(value.date, date));
            if(dateObj) {
                dateObj.data.splice(0, 0, d);
            }
            let timelineObj: any = timeline.find(value => this.sameDay(value.date, date));
            if(timelineObj) {
                if(!timelineObj.data[d.type]) {
                    timelineObj.data[d.type] = 1;
                }else {
                    timelineObj.data[d.type] += 1;
                }
                timelineObj.data.total += 1;
            }
        })
    }

    private handleEventsChange(events: any[]) {
        if (this.props.onLoadNews) {
            const _events = events.map(event => {return {date: event.date, data: event.data.filter((e: any) => {
                if (e.type === 'point' || e.type === 'paper') e.category = '学术活动'
                return e.geoInfo && e.geoInfo.length > 0
            })}})
            this.props.onLoadNews(_events)
        }
        this.props.onLoadEvents && this.props.onLoadEvents(events);
    }

    private dateWidth(): number {
        return this._date_circle_margin + this._date_line_width;
    }

    private handleBar(value: any, index: number): JSX.Element | null {
        return (
            <div
                className='bar'
                key={index}
                onMouseUp={() => this.handleDateUp(value.date)}
                onTouchEnd={() => this.handleDateUp(value.date)}
                style={{
                    left: `${index * this.dateWidth() + (this._date_line_width - this._event_bar_width)/2}px`,
                    bottom: '0px',
                    opacity: 0.96,
                    cursor: 'pointer'
                }}>
                { this._types.map((d:any, i:number) => {
                    return (
                        <div key={d.type} style={{
                            position: "relative",
                            width: `${this._event_bar_width}px`,
                            height: `${(value.data[d.type] || 0) * this.state.barHeightRatio}px`,
                            backgroundColor: d.color
                        }} />
                    )
                })}
            </div>
        );
    }

    private drawBars(): (JSX.Element|null)[] {
        let result: (JSX.Element|null)[] = [];
        const { timelineData } = this.state;
        if(timelineData && timelineData.length) {
            result = timelineData.map(this.handleBar);
        }
        return result;
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
                <div
                    className='date'
                    onMouseUp={() => this.handleDateUp(value)}
                    onTouchEnd={() => this.handleDateUp(value)}
                    style={{
                    width: `${this._date_line_width}px`,
                    height: `${this._date_line_height}px`,
                    lineHeight: `${this._date_line_height - 8}px`,
                    borderRadius: `4px`,
                    border: `${this._date_circle_border_width}px solid #0095ff`
                }} >
                    {dateformat(value, "mm/dd")}
                </div>
            </div>
        )
    }

    private handleBtnClick() {
        if(!this.props.env.speed) {
            if(sameDay(this.props.env.date, this._rangeEndDate)) {
                this.props.onChangeDate && this.props.onChangeDate(this._rangeStartDate);
            }
        }
        setTimeout(() => {
            this.props.onChangeSpeed && this.props.onChangeSpeed(this.props.env.speed ? 0 : 3);
        }, 200);
    }

    private drawLine() {
        return (
            <div className='timeline_bar'>
                 {this.state.catchLine}
            </div>
        )
    }

    private drawPointer() {
        return (
            <div className='timeline_pointer' />
        )
    }

    public render() {
        const { env } = this.props;
        const { catchBars } = this.state;
        return (
            <div className='timeline'>
                <div className='bg' />
                <div className='play_btn' onClick={this.handleBtnClick}>
                {
                    env.speed > 0 ? (
                        <PauseOutlined className='btn' />
                    ) : (
                        <CaretRightOutlined className='btn' style={{marginLeft: '3px'}} />
                    )
                }
                </div>
                <div className='timeline_right'>
                    {this.drawPointer()}
                    <div className='timeline_container'
                        ref={r => this._container = r}
                        onMouseDown={this.props.env.isMobile ? undefined : this.handleMouseDown}
                        onTouchStart={this.handleTouchStart}
                        onMouseMove={this.props.env.isMobile ? undefined : (e: React.MouseEvent) => this.handleMouseMove(e.movementX)}
                        onTouchMove={(e: React.TouchEvent) => {
                            if(e.touches.length) {
                                this.handleMouseMove(e.touches[0].clientX - this._lastTouchX)
                                this._lastTouchX = e.touches[0].clientX;
                            }}}
                        onWheel={this.handleMouseWheel}>
                            {this.drawLine()}
                            {/* <div className='events'>
                                { catchBars }
                            </div> */}
                            <div className='river_con'>
                                <River start={this._renderStartDate} end={this._rangeEndDate} dayWidth={this.dateWidth()} onLineClick={this.handleRiverLineClick}/>
                            </div>
                    </div>
                </div>
            </div>
        )
    }
}
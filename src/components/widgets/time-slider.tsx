import React, { MouseEvent } from 'react'
import _ from 'lodash'
import dateformat from 'dateformat'
import './time-slider.scss'
import { IDefaultProps, IEnv } from '../../global'

interface IProp extends IDefaultProps {
    onChangeTime: (d: Date) => void
    onChangeSpeed: (speed: number) => void
    mapName: string
}

interface IState {
    current: Date
    speed: number
    fps: number
}

export default class TimeSlider extends React.Component<IProp, IState> {

    private begin = new Date(2020, 0, 24, 0, 0, 0, 0)
    private end = new Date()
    private caliberLength: number = Math.floor((this.end.getTime() - this.begin.getTime()) / 1000 / 3600 / 6) + 120
    private caliberInterval = 10
    private calibers = _.range(this.caliberLength).map(i => {
        const idx = i
        const date = new Date(this.begin)
        date.setHours(6 * (idx - 8))
        return { idx, date }
    })
    private dates = _.filter(this.calibers, caliber => caliber.date.getHours() === 0)
    private mouseDown = false
    private initX = 0
    private initT = new Date(2020, 0, 24, 0, 0, 0, 0)
    private onChangeTime = _.debounce((newDate: Date) => {
        if (this.props.onChangeTime) this.props.onChangeTime(newDate)
    }, 50, {leading: true, maxWait: 200})

    private frames: number = 0;
    private lastTime: number = (new Date()).getTime();

    private tick = setInterval(() => {
        let env: IEnv = this.props.env;
        if (env.speed > 0) {
            let newDate = new Date(env.date)
            newDate.setHours(env.date.getHours() + env.speed)
            this.setTime(newDate, true)
        }
        if(process.env.NODE_ENV == 'development') {
            this.frames ++;
            let now: number = (new Date()).getTime();
            if(now - this.lastTime >= 1000) {
                this.setState({fps: this.frames})
                this.frames = 0;
                this.lastTime = now;
            }
        }
    }, 16)

    constructor(props: IProp) {
        super(props)
        this.state = { current: new Date(), speed: 0, fps: 0 }
    }

    setClick(mouseDown: boolean, x: number, d: Date) {
        this.mouseDown = mouseDown
        this.initX = x
        this.initT = d
    }

    dragTimeline(e: MouseEvent<HTMLDivElement>) {
        if (!this.mouseDown) return
        const dx = e.clientX - this.initX
        let newDate = new Date(this.initT.getTime() - dx / this.caliberInterval * 6 * 3600 * 1000)
        this.setTime(newDate)
    }

    setTime(newDate: Date, auto?: boolean) {
        if (newDate < this.begin) newDate = new Date(this.begin)
        if (newDate > this.end) newDate = new Date(this.end)
        if (!auto || newDate >= this.end) {
            if (this.props.env.speed !== 0) this.props.onChangeSpeed(0)
        }
        this.onChangeTime(newDate)
    }

    componentDidMount() {
        this.setTime(new Date())
    }

    onChangeSpeed(speed: number) {
        let env: IEnv = this.props.env;
        if (speed === env.speed) return
        if(this.props.env.date.getDate() == this.end.getDate() && this.props.env.date.getMonth() == this.end.getMonth()) {
            this.props.onChangeTime(this.begin);
            setTimeout(() => {
                this.props.onChangeSpeed(speed)
            }, 200);
        }else {
            this.props.onChangeSpeed(speed)
        }
    }

    componentDidUpdate() {
        // if (this.props.endDate.getTime() !== this.end.getTime() && this.props.endDate <= new Date()) {
        //     this.end = new Date(this.props.endDate)
        //     if (this.state.current >= this.end) this.setTime(this.end)
        // }
    }

    render() {
        const env:IEnv = this.props.env;
        const offsetIdx = -(env.date.getTime() - this.begin.getTime()) / 1000 / 3600 / 6 - 8
        const displayTime = dateformat(env.date, 'yyyy-mm-dd HH:00')
        return <div className="side-panel right-side-panel"
            onMouseDown={(e) => { this.setClick(true, e.clientX, env.date) }}
            onMouseUp={() => { this.setClick(false, 0, env.date) }}
            onMouseLeave={() => { this.setClick(false, 0, env.date) }}
            onMouseMove={(e) => this.dragTimeline(e)}>>
            <div className="mask"/>
            <div className="calibers">
                <div className="marks" style={{left: `${offsetIdx * this.caliberInterval + 200}px`, width: `${this.caliberLength * this.caliberInterval}px`}}
                    onMouseDown={() => { this.onChangeSpeed(0) }}>
                {this.calibers.map(caliber => {
                    return <div key={`grad${caliber.idx}`} className={`grad ${caliber.date.getHours() === 0 ? 'full' : 'half'}`} style={{left: `${caliber.idx * this.caliberInterval}px`}}/>
                })}
                {this.dates.map(caliber => {
                    return <div key={`date${caliber.idx}`} className="date" style={{left: `${caliber.idx * this.caliberInterval}px`}}>{caliber.date.getDate()}</div>
                })}
                </div>
                <div className="info-box">
                    <div className="identifier-line"/>
                    <div className="identifier"/>
                    <div className="info-date">{displayTime}</div>
                    <div className="button" onClick={() => this.setTime(this.begin)}><i className="fas fa-fast-backward"></i></div>
                    <div className="button" onClick={() => {
                        this.onChangeSpeed(env.speed > 0 ? 0 : 1)
                    }}>
                        <i className={`fas fa-${env.speed > 0 ? 'pause' : 'play'}-circle`}></i>
                    </div>
                    <div className="button" onClick={() => {
                        this.onChangeSpeed(env.speed >= 3 ? 1 : 3)
                    }}>
                        <i className="fas fa-forward" style={{color: env.speed >= 3 ? 'yellow' : 'white'}}></i>
                    </div>
                    <div className="button" onClick={() => this.setTime(this.end)}><i className="fas fa-fast-forward"></i></div>
                    {/* <div className="map-name">{this.props.mapName}</div> */}
                    { process.env.NODE_ENV == 'development' && <div className='map-fps'>{`FPS: ${this.state.fps}`}</div> }
                </div>
            </div>
        </div>
    }
}
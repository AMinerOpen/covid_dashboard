import React from 'react'
import './epidemic-map.scss'
import MapContainer from './mapbox/container'
import { IRegionData, ITimeline, IEpidemicData, IRegionEpidemicDayData, IRegionInfo } from '../../models'
import ControlPanel from '../widgets/control-panel'
import dateformat from 'dateformat'
import { IEnv, IDefaultProps } from '../../global'
import _ from 'lodash'

interface IProps extends IDefaultProps  {
    onLoadGlobalEpData: (epData:  {[id: string]: ITimeline<IEpidemicData>}) => void
    onLoadGlobalTranslateData: (transData: {[id: string]: {[lang: string]: string}}) => void
    onChangeDate: (d: Date) => void
    onChangeSpeed: (speed: number) => void
    theme: string
    news: any[]
    langAll: boolean
    onEventClick: (event: any) => void
}
interface IState {
    region?: IRegionData
    regionInfo: IRegionInfo
    dayEp: Partial<IRegionEpidemicDayData>
    endDate: Date
}

export default class EpidemicMap extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
        this.state = {
            region: undefined,
            regionInfo: {name: '', name_en: '', name_zh: '', bbox: [0,0,0,0]},
            dayEp: {},
            endDate: new Date()
        }
    }

    public render() {
        return (
            <div className="epidemic-map">
                <MapContainer
                    env={this.props.env}
                    onEventClick={this.props.onEventClick}
                    date={dateformat(this.props.env.date, 'yyyy-mm-dd')}
                    theme={this.props.theme}
                    // events={this.state.events}
                    onHover={(regionInfo, dayEp) => this.setState({regionInfo, dayEp})}
                    onLoadGlobalEpData={this.props.onLoadGlobalEpData}
                    onLoadGlobalTranslateData={this.props.onLoadGlobalTranslateData}
                    news={this.props.news}
                    onChangeEndDate={(endDate) => this.setState({endDate})}
                    langAll={this.props.langAll}
                />
                <ControlPanel
                    env={this.props.env}
                    transData={this.props.transData}
                    epData={this.props.epData}
                    dayEp={this.state.dayEp}
                    regionInfo={this.state.regionInfo}
                    onChangeTime={this.props.onChangeDate}
                    onChangeSpeed={this.props.onChangeSpeed}
                    endDate={this.state.endDate}
                />
            </div>
        )
    }
}
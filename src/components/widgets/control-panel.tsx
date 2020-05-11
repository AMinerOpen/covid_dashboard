import React from 'react'
import TimeSlider from './time-slider'
import { IRegionEpidemicDayData, IRegionInfo } from '../../models'
import './control-panel.scss'
import { IDefaultProps } from '../../global';
import { FormattedMessage } from 'react-intl'
import { displayNumber } from '../../utils/data'
import _ from 'lodash'
import fittext from '../../utils/fittext'
import { Popover } from 'antd'

interface IProp extends IDefaultProps {
    regionInfo: IRegionInfo
    dayEp: Partial<IRegionEpidemicDayData>
    onChangeTime: (d: Date) => void
    onChangeSpeed: (speed: number) => void
    endDate: Date
}

interface IState {
    date: Date
}

export default class ControlPanel extends React.Component<IProp, IState> {

    private regionNameElement?: HTMLDivElement | null

    constructor(props: IProp) {
        super(props)
        this.state = { date: new Date() }
    }

    sS(number?: number) {
        if (number === undefined) return ''
        else if (number >= 0) return `+${number}`
        else return `${number}`
    }

    onChangeTime(date: Date) {
        this.setState({date})
        this.props.onChangeTime(date)
    }

    componentDidUpdate() {
        if (this.regionNameElement) fittext(this.regionNameElement)
    }

    popover(): JSX.Element {
        const isMobile: boolean = this.props.env.isMobile;
        const lang: string = this.props.env.lang;
        return (
            <div className='popover' style={{width: isMobile ? '200px' : "360px"}}>
                <div className='h1'>{lang == 'zh' ? "我们使用多个维度的数据，对地区的风险指数进行综合评估：" : "We aggregate multiple dimensions of data to conduct a comprehensive assessment of the regional risk index, including:"}</div>
                <div className='h2'>{lang == 'zh' ? "- 历史疫情数据，包括确诊病例，死亡/治愈率，预测的拐点等" : "- Historical epidemic data, including confirmed cases, death / cure rates, predicted inflection points, etc."}</div>
                <div className='h2'>{lang == 'zh' ? "- 地区人口数据 [1]" : "- Regional population data [1]"}</div>
                <div className='h2'>{lang == 'zh' ? "- 地区医疗资源 [2]" : "- Regional medical resources [2]"}</div>
                <div className='origin'>
                    <div className='h3'><a href='https://data.worldbank.org/indicator/sp.pop.totl' target="_blank">{"[1]  https://data.worldbank.org/indicator/sp.pop.totl"}</a></div>
                    <div className='h3'><a href='https://www.ghsindex.org/' target="_blank">{"[2]  https://www.ghsindex.org/"}</a></div>
                </div>
            </div>
        )
    }

    render() {
        // const date = dateformat(this.state.date, 'yyyy-mm-dd')
        const regionInfo = this.props.regionInfo || {name_en: '', name_zh: ''}
        let fullName = this.props.env.lang === 'en' ? regionInfo.name_en : regionInfo.name_zh
        if (fullName === 'United States of America') fullName = "United States"
        else if (fullName === 'People\'s Republic of China') fullName = "China"
        fullName = fullName.replace('Republic', 'Rep.').replace('Democratic', 'Dem.')
        const ep = this.props.dayEp
        let active: number | undefined = ep ? ((ep.confirmed||0) - (ep.cured||0) - (ep.dead||0)) : undefined;
        let active_delta: number | undefined = ep ? ((ep.confirmed_delta||0) - (ep.cured_delta||0) - (ep.dead_delta||0)) : undefined;
        return <div className="control-panel" style={{pointerEvents: 'none'}}>
            {
                !this.props.env.isMobile && (
                    <div className="side-panel left-side-panel">
                        <div className="mask"/>
                        <div className="row">
                            <div className="block" style={{left: 0, background: '#442121'}}>
                                <div className="title"><i className="fas fa-medkit"></i>
                                    <FormattedMessage id="map.control.confirmed"/>
                                </div>
                                <div className="agg">{displayNumber(ep?.confirmed)}</div>
                                <div className="inc">{this.sS(ep?.confirmed_delta)}</div>
                            </div>
                            <div className="block" style={{left: '25%', background: '#605041'}}>
                                <div className="title"><i className="fas fa-diagnoses"></i>
                                    <FormattedMessage id="map.control.active"/>
                                </div>
                                <div className="agg">{displayNumber(active)}</div>
                                <div className="inc">{this.sS(active_delta)}</div>
                            </div>
                            <div className="block" style={{left: '50%', background: '#244c26'}}>
                                <div className="title"><i className="fas fa-star-of-life"></i>
                                    <FormattedMessage id="map.control.cured"/>
                                </div>
                                <div className="agg">{displayNumber(ep?.cured)}</div>
                                <div className="inc">{this.sS(ep?.cured_delta)}</div>
                            </div>
                            <div className="block" style={{left: '75%', background: '#161616'}}>
                                <div className="title"><i className="fas fa-skull-crossbones"></i>
                                    <FormattedMessage id="map.control.dead"/>
                                </div>
                                <div className="agg">{displayNumber(ep?.dead)}</div>
                                <div className="inc">{this.sS(ep?.dead_delta)}</div>
                            </div>
                        </div>
                    </div>
                )
            }
            <TimeSlider
                env={this.props.env}
                transData={this.props.transData}
                epData={this.props.epData}
                onChangeTime={d => this.onChangeTime(d)} mapName={fullName}
                onChangeSpeed={this.props.onChangeSpeed} />
            <Popover
                title={this.props.env.lang == 'zh' ? "风险指数" : "Risk Index"}
                placement='bottom'
                content={this.popover()}>
                <div className="main-circle">
                    <div className='region' ref={(e) => this.regionNameElement = e}>{fullName}</div>
                    <div className="title">
                        <FormattedMessage id="map.control.risk"/>
                    </div>
                    <div className="score">{displayNumber(ep?.risk)}</div>
                </div>
            </Popover>
        </div>
    }
}
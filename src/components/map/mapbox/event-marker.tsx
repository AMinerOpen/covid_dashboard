import React from 'react'
import { INews } from '../../../models'
import './event-marker.scss'
import _ from 'lodash'

export interface IEventMarkerProp {
    news: INews[]
    loc_zh: string
    loc_en: string
    lang: string
    onClick: (data: any) => void
}

export default class EventMarker extends React.Component<IEventMarkerProp> {

    render() {
        return <div className="event-marker-groups">
            {_.map(_.map(_.groupBy(this.props.news, news => news.category), (news, category) => [news, category]), (pair, index: number) => {
                const data = pair[0] as INews[]
                const category = pair[1] as string
                const type = data[0].type
                return <SingleEventMarker key={category} onClick={this.props.onClick} loc={this.props.lang === 'zh' ? this.props.loc_zh : this.props.loc_en} type={type} offset={index} lang={this.props.lang} data={data} category={category}/>
            })}
        </div>
    }
}


interface IProp {
    data: INews[]
    type: string
    category: string
    offset: number
    lang: string
    loc: string
    onClick: (data: any) => void
}

class SingleEventMarker extends React.Component<IProp> {

    getTitle() {
        if (this.props.lang === 'zh') {
            if (this.props.category === 'policy') return '政府政策'
            if (this.props.category === 'finance') return '经济'
            if (this.props.category === 'education') return '教育'
            if (this.props.category === 'health') return '医疗'
            if (this.props.category === 'production') return '生产'
            if (this.props.category === 'supplies') return '物资供应'
        } else {
            if (this.props.category === '政府行动') return 'Government Action'
            if (this.props.category === '疫情') return 'Epidemic'
            if (this.props.category === '境内疫情') return 'Domestic Epidemic'
            if (this.props.category === '境外疫情') return 'Oversea Epidemic'
            if (this.props.category === '行业动态' || this.props.category === '行业战疫') return 'Industry News'
            if (this.props.category === '经济政策') return 'Financial Policy'
            if (this.props.category === '教育政策') return 'Education'
            if (this.props.category === '交通运输') return 'Transportation'
            if (this.props.category === '公共医疗') return 'Public Health'
            if (this.props.category === '物资供应') return 'Supplies'
            if (this.props.category === '学术活动') return 'Academic Activity'
        }
        return this.props.category
    }

    getIconName() {
        switch (this.props.category) {
            case '政府行动': return 'iconmap-marker-landmark'
            case '境内疫情': case '境外疫情': case '疫情': return 'iconmap-marker-biohazard'
            case '行业动态': case '行业战疫': return 'iconmap-marker-industry'
            case '经济政策': return 'iconmap-marker-dollar'
            case '教育政策': return 'iconmap-marker-education'
            case '交通运输': return 'iconmap-marker-train'
            case '公共医疗': return 'iconmap-marker-clinic'
            case '物资供应': return 'iconmap-marker-supplies'
            case '学术活动': return 'iconmap-marker-academic'
            default: return 'iconmap-marker-news'
        }
    }

    render() {
        const title = this.getTitle()
        const isFirst = this.props.offset === 0
        return <div className={`event-marker ${isFirst ? 'first' : 'follow'}`}>
            <div className={`icon ${isFirst ? 'first' : 'follow'}`}>
                <svg className="iconfont-icon" aria-hidden="true">
                    <use xlinkHref={`#${this.getIconName()}${isFirst ? '' : '-circle'}`}></use>
                </svg>
            </div>
            <div className="content">
                <h3>{this.props.loc}</h3>
                {title && <h4>{title}</h4>}
                {this.props.data.map((d, idx) => <p key={idx}>{idx+1}. <a href={d.url} onClick={e => {
                    this.props.onClick(d)
                    e.preventDefault();
                }} target="_blank" rel="noopener noreferrer">{d.title}</a></p>)}
            </div>
        </div>
    }
}
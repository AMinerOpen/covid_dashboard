import * as React from 'react';
import './eventPanel.scss';
import { IDefaultProps } from '../../global';
import { FormattedMessage } from 'react-intl'
import { requestEvent } from '../../utils/requests';
import EventFlag from '../eventFlag/eventFlag';

interface IProps extends IDefaultProps {
    event: any;
    onClose: () => void;
}

interface IState {
    entities: any[];
    hightlight: string;
    eventDetail: any;
}

export default class EventPanel extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            entities: [],
            hightlight: "",
            eventDetail: null
        };
        this.handleMapEntities = this.handleMapEntities.bind(this);

        this.requestDetails();
    }

    public componentDidUpdate(preProps: IProps, preState: IState) {
        if(this.state.hightlight && preState.hightlight != this.state.hightlight) {
            let div: HTMLDivElement | null = document.getElementById(this.state.hightlight) as HTMLDivElement;
            if(div) {
                div.scrollIntoView();
            }
        }
        if(!preState.eventDetail && this.state.eventDetail) {
            this.requestEntities();
        }
    }

    private requestDetails() {
        requestEvent(this.props.event._id).then(data => {
            if(data && data.status) {
                this.setState({eventDetail: data.data});
            }
        })
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
                <div className='label'>{entity.label}</div>
                <div className='content' dangerouslySetInnerHTML={{__html: this.entityContent(entity)}}></div>
            </div>
        )
    }

    private format(text: string): JSX.Element[] {
        let entities: any[] = this.state.eventDetail.entities;
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
                        style={url ? {color: 'rgb(215, 385, 70)'} : undefined}>{str}</span>
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
                    <div className='paper_line'><FormattedMessage id='event.source' />: <a className='paper_content' href={event.urls[0]} style={{color: 'lightskyblue'}} target="_blank">{`[${event.source || "Url"}]`}</a></div>
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

    public render() {
        const { onClose } = this.props;
        const event = this.state.eventDetail;
        return (
            <div className='eventpanel' onClick={() => onClose()}>
                <div className='panel' style={event && event.type == 'paper' ? {height: '480px'} : {height: '360px'}} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                    <div className='left'>
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
                        <div className="list">
                            { this.state.entities.map(this.handleMapEntities)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
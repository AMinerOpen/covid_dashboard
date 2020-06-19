import React from 'react';
import './entityPanel.scss';
import { Tooltip } from 'antd';
import { IEnv } from '../../global';
import { requestEntity, requestEntityView } from '../../utils/requests';
import { FormattedMessage } from 'react-intl';
import EventFlag from '../eventFlag/eventFlag';
import EntityFlag from '../entityFlag/entityFlag';
import { sameDay } from '../../global';
import { ReactComponent as ForwardSvg } from './images/forward.svg';
import { ReactComponent as BackwardSvg } from './images/backward.svg';

interface IProps {
  env: IEnv;
  events: any[];
  date: Date | null;
  data: any;
  onOpenEntity: (entity: any, date: Date) => void;
  onOpenEvent: (date: Date, data: any) => void;
  onClose: () => void;
}

interface IState {
  detail: any;
  relatedEvents: any[];
}

export default class EntityPanel extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      detail: null,
      relatedEvents: []
    }
  }

  componentDidMount() {
    this.requestEntity();
  }

  componentDidUpdate(preProps: IProps) {
    if(preProps.data != this.props.data) {
      this.requestEntity();
    }
  }

  private requestEntity() {
    requestEntity(this.props.data.url, (this.props.date || this.props.env.date).getTime()).then(data => {
      if(data && data.status) {
        requestEntityView(this.props.data.url);
        let date: Date = this.props.date || this.props.env.date;
        let obj: any = this.props.events.find(d => sameDay(date, d.date));
        let relatedEvents: any[] = [];
        if(obj) {
          obj.data.forEach((d: any) => data.data.related_events && data.data.related_events.find((e: any) => e == d._id) && relatedEvents.push(d));
        }
        this.setState({detail: data.data, relatedEvents});
      }
    })
  }

  render() {
    const label: string = this.state.detail ? this.state.detail.label : this.props.data.label;
    const desc: string = this.state.detail ? (this.state.detail.abstractInfo.enwiki || this.state.detail.abstractInfo.zhwiki || this.state.detail.abstractInfo.baidu || "") : "";
    const properties: any = this.state.detail ? (this.state.detail.abstractInfo.COVID && this.state.detail.abstractInfo.COVID.properties || null) : null;
    const relations: any[] = this.state.detail ? (this.state.detail.abstractInfo.COVID && this.state.detail.abstractInfo.COVID.relations || []) : [];
    return (
      <div className='entitypanel' onClick={() => this.props.onClose && this.props.onClose()}>
        <div className='panel' onClick={e => e.stopPropagation()}>
          <div className='left'>
          <div className='title'>{this.state.detail && <EntityFlag source={this.state.detail.source} />}<span>{label}</span></div>
            <div className='content'>
              {
                desc && (
                  <div>
                    <div className='head'><FormattedMessage id='entitypanel.desc' /></div>
                    <div className='desc' dangerouslySetInnerHTML={{__html: desc}}/>
                  </div>
                )
              }
              {
                !!relations.length && (
                  <div>
                    <div className='head'><FormattedMessage id='entitypanel.relations' /></div>
                    <div className='relations'>
                      {
                        relations.map((relation: any, index: number) => {
                          let forward: boolean = relation.forward == "True" || relation.forward == true;
                          return (
                            <div className='relation' key={index}>
                              <div className='name'>{relation.relation}</div>
                              <div className='direction'>{forward ? <ForwardSvg fill='palegreen' /> : <BackwardSvg fill='indianred' />}</div>
                              <div className='label'><Tooltip placement='top' title={relation.label}><div className='label_inner'>{relation.label}<div className='line' /></div></Tooltip></div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                )
              }
              {
                properties && !!Object.keys(properties).length && (
                  <div>
                    <div className='head'><FormattedMessage id='entitypanel.properties' /></div>
                    {
                      Object.keys(properties).map((p: string, index: number) => {
                        return (
                          <div key={index}>
                            <div className='property'><span className='key'>{p}</span>{properties[p]}</div>
                          </div>
                        )
                      })
                    }
                  </div>
                )
              }
            </div>
          </div>
          <div className='right'>
            <div className='title'><FormattedMessage id='entitypanel.events' /></div>
            <div className='list'>
              { 
                this.state.relatedEvents.map((event: any, index: number) => {
                  return (
                    <div className='event' key={index} onClick={() => this.props.onOpenEvent && this.props.onOpenEvent(this.props.date || this.props.env.date, event)}>
                      <EventFlag lang={this.props.env.lang} type={event.type} category={event.category}/><span className='title'>{event.title}</span>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
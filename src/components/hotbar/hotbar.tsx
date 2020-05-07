import React from 'react';
import './hotbar.scss';
import { FormattedMessage } from 'react-intl';
import { sameDay } from '../../global';
import EventFlag from '../eventFlag/eventFlag';

interface IProps {
  events: any[];
  lang: 'zh' | 'en';
  date: Date;
  onOpenEvent: (date: Date) => void;
  onOpenEntity: (entity: any, date: Date) => void;
}

interface IState {
  hotEvents: any[];
  hotEntities: any[];
  entitiesExpand: boolean;
  eventsExpand: boolean;
}

export default class Hotbar extends React.Component<IProps, IState> {
  private _blackList: string[] = ["xinhua", "COVID-19", "coronavirus", "confirmed", "So", "so"];
  constructor(props: IProps) {
    super(props);
    this.state = {
      hotEntities: [], 
      hotEvents: [],
      entitiesExpand: true,
      eventsExpand: true
    }
  }

  public componentDidMount() {
    this.freshHot();
  }

  public componentDidUpdate(preProps: IProps, preState: IState) {
    if(!sameDay(preProps.date, this.props.date) || preProps.events != this.props.events) {
      this.freshHot();
    }
  }

  private freshHot() {
    const { events } = this.props;
    let curDate: any = events.find(d => sameDay(d.date, this.props.date));
    let hotEvents: any[] = [];
    let hotEntities: any[] = [];
    if(curDate) {
      let curData: any[] = curDate.data;
      hotEvents = curData.length > 10 ? curData.slice(0, 10) : curData;
      curData.forEach(d => {
        if(d.entities && d.entities.length) {
          d.entities.forEach((entity: any) => {
            if(this._blackList.indexOf(entity.label) < 0) {
              let obj: any = hotEntities.find(e => e.url == entity.url);
              if(obj) {
                obj.count += 1;
              }else {
                hotEntities.push({
                  label: entity.label,
                  url: entity.url,
                  count: 1
                })
              }
            }
          })
        }
      })
      hotEntities.sort((a: any, b: any) => b.count - a.count);
      if(hotEntities.length > 16) hotEntities = hotEntities.slice(0, 16);
    }
    this.setState({hotEvents, hotEntities});
  }

  render() {
    const { lang, onOpenEntity, onOpenEvent, date } = this.props;
    const { hotEvents, hotEntities, eventsExpand, entitiesExpand} = this.state;
    return <div className="hotbar">
      <div className='hot'>
        <div className='bar' onClick={() => this.setState({entitiesExpand: !entitiesExpand})}>
          <div className='title'><FormattedMessage id='hot.entities'/></div>
        </div>
        { 
          entitiesExpand && (
            <div className='con'>
              <div className='con_inner'>
                <div className='entities'>
                  {
                    hotEntities.map((entity: any, index: number) => {
                      return (
                        <div className='entity' key={index} onClick={() => onOpenEntity && onOpenEntity(entity, date)}>
                          <span className='label'>{`${entity.label}(${entity.count || 0})`}</span>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
          )
        }
      </div>
      <div className='hot'>
        <div className='bar' onClick={() => this.setState({eventsExpand: !eventsExpand})}>
          <div className='title'><FormattedMessage id='hot.events'/></div>
        </div>
        {
          eventsExpand && (
            <div className='con'>
              <div className='con_inner'>
                {
                  hotEvents.map((event: any, index: number) => {
                    return (
                      <div className='event' key={index} onClick={() => onOpenEvent && onOpenEvent(this.props.date)}>
                        <EventFlag lang={lang} type={event.type} category={event.category}/><span className='title'>{event.title}</span>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  }
}
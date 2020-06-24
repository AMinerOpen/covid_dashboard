import * as React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import './searchResults.scss';
import { ISearchResult, ISearchRegion, INews, IEntity } from '../../models';
import { ReactComponent as Empty_Svg } from './images/empty.svg';
import EventFlag from '../eventFlag/eventFlag';
import InfluenceFlag from '../influenceFlag/influenceFlag';
import { mapTool } from '../map/mapbox/mapbox.js';

interface ISBoxProps extends React.ComponentProps<any> {
  width: number;
}

const SBox = (props: ISBoxProps) => {
  return (
    <div className='sbox' style={{width: props.width}}>
      {props.children}
    </div>
  )
}

interface IProps extends WrappedComponentProps {
  lang: 'zh' | 'en';
  date: Date;
  defaultWidth: number;
  maxHeight: number;
  data: ISearchResult;
  onOpenEvent: (date: Date, data: any, list?: string[]) => void;
  onOpenEntity: (entity: any, date: Date) => void;
}

interface IState {

}

class SearchResults extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {

    }
  }

  private riskFlag(level: string): JSX.Element {
    const risk_color: string[] = ["#8fc360", "#f3bf52", "#e16a66"];
    return (
      <div className='risk-level'>
        <div className='risk-circle' style={{backgroundColor: risk_color[Number(level)-1]}}><i className={`fa fa-${level=='1'?'check':'exclamation'}`} /></div>
        <div className='risk-text' style={{color: risk_color[Number(level)-1]}}>{this.props.intl.formatMessage({id: `search.risk_${level}`})}</div>
      </div>
    )
  }
  public render() {
    const { data, defaultWidth, maxHeight, intl } = this.props;
    const empty: boolean = !data.entities && !data.regions && !data.events;
    const events: INews[] = data.events ? data.events.slice(0, 10) : [];
    return (
      <div className="sts" style={{width: `${defaultWidth+20}px`, maxHeight: `${maxHeight}px`}}>
        <div className="sts-list">
          {
            empty && (
              <SBox width={defaultWidth}>
                <div className="sts-empty">
                  <Empty_Svg />
                  <div>{intl.formatMessage({id: "search.empty"})}</div>
                </div>
              </SBox>
            )
          }
          {
            !empty && (
              <div className='sts-results'>
                { data.regions && !!data.regions && data.regions.map((region: ISearchRegion, i: number) => {
                  let full: string[] = region.full.slice(0, -1);
                  full.unshift("中国");
                  return <SBox width={defaultWidth} key={i}>
                    <div className='sts-block'>
                      <div className='sts-top'>
                        <div className='sts-item'>
                          <div className='sts-type'>{intl.formatMessage({id: 'search.place'})}</div>
                          <div className='sts-name' onClick={region.geo ? () => mapTool.onLocate && mapTool.onLocate(region.geo, Math.max(0, region.level-2)*3 + 6) : undefined}>{`${region.region}`}{region.geo && <i className='fa fa-map-marker-alt' />}</div>
                        </div>
                        {
                          region.risk_level && region.risk_level != '-' && this.riskFlag(region.risk_level)
                        }
                      </div>
                      <div className='sts-bottom'>
                        <div className='sts-info'>
                          <span className='sts-info-label'>{intl.formatMessage({id: 'search.location'})+": "}</span>
                          <span className='sts-info-content'>{full.join(',')}</span>
                        </div>
                      </div>
                    </div>
                  </SBox>
                })}
                {
                  data.entities && !!data.entities.length && data.entities.map((entity: IEntity, i: number) => {
                    let hot: number = Math.min(3, Math.floor((entity.hot || 0) / 0.32))
                    return <SBox width={defaultWidth} key={i}>
                      <div className='sts-block'>
                        <div className='sts-block-entity'>
                          <div className='sts-block-left'>
                            <div className='sts-top'>
                              <div className='sts-item'>
                                <div className='sts-type'>{intl.formatMessage({id: 'search.entity'})}</div>
                                <div className='sts-name' onClick={() => this.props.onOpenEntity(entity, this.props.date)}>
                                  {entity.label}
                                  <span style={{marginLeft: "6px"}}>{!!hot && Array(hot).fill(0).map((_, i) => <i key={i} className='fa fa-fire' style={{color: "orangered"}} />)}</span>
                                </div>
                              </div>
                            </div>
                            <div>{entity.abstractInfo.baidu || entity.abstractInfo.enwiki || entity.abstractInfo.zhwiki}</div>
                          </div>
                          <div className='sts-block-right'>
                            {
                              entity.img && <img className='sts-entity-img' src={entity.img} />
                            }
                          </div>
                        </div>
                      </div>
                    </SBox>
                  })
                }
                { !!events && events.map((event: INews, i: number) => {
                  return <SBox width={defaultWidth} key={i}>
                    <div 
                      className='sts-news-title' 
                      onClick={() => this.props.onOpenEvent(this.props.date, event, events.map((d:INews) => d._id))} >
                        <EventFlag lang={this.props.lang} type={event.type} category={event.category}/>
                        { !!event.influence && event.influence > 0 && <InfluenceFlag lang={this.props.lang} influence={event.influence || 0} />}
                        {event.title}
                      </div>
                  </SBox>
                }) }
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

export default injectIntl(SearchResults);
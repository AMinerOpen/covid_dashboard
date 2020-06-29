import * as React from 'react';
import './index.scss';
import { IDefaultProps } from '../../global';
import { IRegionEpidemicDayData, IRegionInfo, ITimeline, IEpidemicData, ISearchResult } from '../../models';
import DBBlock from './dbblock';
import { displayNumber } from '../../utils/data';
import { risk2color } from '../../utils/color';
import ReactEcharts from 'echarts-for-react';
import MapModeSelector from '../map/map-mode-selector';
import { Tooltip, Button } from 'antd';
import { FormattedMessage} from 'react-intl';
import dateformat from 'dateformat';
import { ReactComponent as Tip_Svg } from '../main/images/tip.svg';
import SearchBar from './searchBar';
import { requestSearch } from '../../utils/requests';
import SearchResults from './searchResults';

interface IProps extends IDefaultProps{
  regionInfo: IRegionInfo
  dayEp: Partial<IRegionEpidemicDayData>
  onChangeTime: (d: Date) => void
  onChangeSpeed: (speed: number) => void
  endDate: Date
  mapMode: string, 
  onSetMapMode: (mode: string) => void
  onOpenEvent: (date: Date, data: any, list?: string[]) => void;
  onOpenEntity: (entity: any, date: Date) => void;
  onChangeHotRegion: (hotRegion: string) => void;
}

interface IState {
  searchResults: ISearchResult | null;
}

export default class DashBoard extends React.Component<IProps, IState> {
  private _upHeight: number = 100;
  private _leftWidth: number = 180;
  private _leftWidth_m: number = 160;
  private _rightupHeight: number = 36;
  private _rightdownHeight: number;
  private _blockMargin: number = 2;
  private _dataWidth: number = 106;
  private _riskWidth: number;
  private _timeHeight: number;

  constructor(props: IProps) {
    super(props);
    this.state = {
      searchResults: null
    }
    this._rightdownHeight = this._upHeight - this._blockMargin - this._rightupHeight;
    this._riskWidth = 3 * this._dataWidth + 2 * this._blockMargin;
    this._timeHeight = props.env.isMobile ? 32 : 36;

    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchClose = this.handleSearchClose.bind(this);
  }

  private handleSearch(text: string) {
    requestSearch(text).then(data => {
      if(data && data.status) {
        this.setState({searchResults: data.data});
      }else {
        this.setState({searchResults: null});
      }
    })
  }

  private handleSearchClose() {
    this.setState({searchResults: null});
  }

  private riskOption() {
    let option: any = {};
    const { epData, regionInfo } = this.props;
    if(epData && regionInfo) {
      let name = regionInfo.name == 'World' ? "" : regionInfo.name;
      let regionData: ITimeline<IEpidemicData> | null = epData[name] || null;
      let worldData: ITimeline<IEpidemicData> = epData[""];
      if(regionData) {
        let keys: string[] = Object.keys(regionData);
        if(keys.length > 20) keys = keys.slice(-20);
        option = {
          grid: { left: "0%", right: "0%", top: '0%', bottom: "0%" },
          tooltip: { trigger: 'axis' },
          legend: { show: false },
          xAxis: { type: 'category', boundaryGap: false, data: keys },
          yAxis: {
            show: true,
            type: 'value',
            splitLine: {
              show: true,
              interval: 25,
              lineStyle: { color: '#999', opacity: 0.2 }
            },
            max: 100,
            min: 0,
            interval: 20
          },
          visualMap: {
            show: false,
            pieces: [
              { gt: 0, lte: 20, color: risk2color(10) }, 
              { gt: 20, lte: 40, color: risk2color(30) }, 
              { gt: 40, lte: 60, color: risk2color(50) }, 
              { gt: 60, lte: 80, color: risk2color(70) }, 
              { gt: 80, lte: 100, color: risk2color(90) }
            ],
            outOfRange: { color: '#999' }
          },
          series: [
            {
              name: 'World Risk',
              type: 'line',
              show: false,
              smooth: true,
              symbol: 'none',
              data: keys.map(d => worldData![d].risk || 0),
              lineStyle: { color: 'grey', width: 3, opacity: 0.5 }
            },
            {
              name: 'Region Risk',
              type: 'line',
              smooth: true,
              symbol: 'none',
              data: keys.map(d => regionData![d].risk || 0),
              lineStyle: { width: 3 }
            }
          ]
        }
      }
    }
    return option;
  }

  render() {
    const regionInfo = this.props.regionInfo || {name_en: '', name_zh: ''}
    let fullName = this.props.env.lang === 'en' ? regionInfo.name_en : regionInfo.name_zh
    if (fullName === 'United States of America') fullName = "United States"
    else if (fullName === 'People\'s Republic of China') fullName = "China"
    fullName = fullName.replace('Republic', 'Rep.').replace('Democratic', 'Dem.')
    const ep = this.props.dayEp
    let active: number | undefined = ep ? ((ep.confirmed||0) - (ep.cured||0) - (ep.dead||0)) : undefined;
    let active_delta: number | undefined = ep ? ((ep.confirmed_delta||0) - (ep.cured_delta||0) - (ep.dead_delta||0)) : undefined;
    return (
      <div className='dashboard'>
        <div className='up'>
          <div className='left'>
            <DBBlock style={{width: `${this.props.env.isMobile ? this._leftWidth_m : this._leftWidth}px`, height: `${this._upHeight}px`}}>
              <div className='region'>{fullName}</div>
              <Tooltip 
                title={this.props.env.lang == 'zh' ? "风险指数" : "Risk Index"}
                placement='bottom'>
                <div className='risk'>
                  <div className='value' style={{color: risk2color(ep?.risk)}}>{displayNumber(ep?.risk)}</div>
                  <div className='title'>Risk Index</div>
                  <span className='tip' onClick={() => window.open("https://covid-dashboard.aminer.cn/algorithm/?lang="+this.props.env.lang)}><Tip_Svg /></span>
                </div>
              </Tooltip>
              <div className='mode-con'>
                <MapModeSelector mapMode={this.props.mapMode} onSetMapMode={this.props.onSetMapMode}/>
              </div>
            </DBBlock>
            <DBBlock style={{width: `${this.props.env.isMobile ? this._leftWidth_m : this._leftWidth}px`, height: `${this._timeHeight}px`}}>
              <div className='time'>{dateformat(this.props.env.date, "yyyy/mm/dd HH:MM:ss")}</div>
            </DBBlock>
          </div>
          { 
            !this.props.env.isMobile && (
              <div className='right'>
                <div className='rightup'>
                  <DBBlock style={{width: `${this._dataWidth}px`, height: `${this._rightupHeight}px`}}>
                    <Tooltip title={this.props.env.lang == 'zh' ? "累计确诊" : "Total Confirmed"} placement='top' >
                      <div>
                        <div className='data-delta' style={{color: 'lightsalmon'}}><i className="fas fa-plus"/><span className="agg">{displayNumber(ep?.confirmed_delta)}</span></div>
                        <div className='data' style={{color: 'red'}}><i className="fas fa-medkit"/><span className="agg">{displayNumber(ep?.confirmed)}</span></div>
                      </div>
                    </Tooltip>
                  </DBBlock>
                  <DBBlock style={{width: `${this._dataWidth}px`, height: `${this._rightupHeight}px`}}>
                    <Tooltip title={this.props.env.lang == 'zh' ? "现存确诊" : "Active"} placement='top' >
                      <div>
                        <div className='data-delta' style={{color: 'lightgoldenrodyellow'}}><i className="fas fa-plus"/><span className="agg">{displayNumber(active_delta)}</span></div>
                        <div className='data' style={{color: 'khaki'}}><i className="fas fa-diagnoses"/><span className="agg">{displayNumber(active)}</span></div>
                      </div>
                    </Tooltip>
                  </DBBlock>
                  <DBBlock style={{width: `${this._dataWidth}px`, height: `${this._rightupHeight}px`}}>
                    <Tooltip title={this.props.env.lang == 'zh' ? "治愈" : "Cured"} placement='top' >
                      <div>
                        <div className='data-delta' style={{color: 'palegreen'}}><i className="fas fa-plus"/><span className="agg">{displayNumber(ep?.cured_delta)}</span></div>
                        <div className='data' style={{color: 'lime'}}><i className="fas fa-star-of-life"/><span className="agg">{displayNumber(ep?.cured)}</span></div>
                      </div>
                    </Tooltip>
                  </DBBlock>
                  <DBBlock style={{width: `${this._dataWidth}px`, height: `${this._rightupHeight}px`}}>
                    <Tooltip title={this.props.env.lang == 'zh' ? "死亡" : "Dead"} placement='top' >
                      <div>
                        <div className='data-delta' style={{color: 'gainsboro'}}><i className="fas fa-plus"/><span className="agg">{displayNumber(ep?.dead_delta)}</span></div>
                        <div className='data' style={{color: 'darkgrey'}}><i className="fas fa-skull-crossbones"/><span className="agg">{displayNumber(ep?.dead)}</span></div>
                      </div>
                    </Tooltip>
                  </DBBlock>
                </div>
                <div className='rightdown'>
                  <DBBlock style={{width: `${this._riskWidth}px`, height: `${this._rightdownHeight}px`}}>
                    <div className='chart-con'>
                      <ReactEcharts option={this.riskOption()} style={{height: `${this._rightdownHeight-12}px`, width: '100%'}}/>
                      <div className='title'><FormattedMessage id='map.control.riskchart' /></div>
                    </div>
                  </DBBlock>
                  <div className='hot-btns' style={{width: `${this._dataWidth}px`, height: `${this._rightupHeight}`}}>
                    <Button className='hot-btn' onClick={() => this.props.onChangeHotRegion && this.props.onChangeHotRegion("beijing")}><FormattedMessage id="hot.beijing" /></Button>
                  </div>
                </div>
                <div className='rightsearch'>
                  <SearchBar lang={this.props.env.lang} width={this._riskWidth} height={this._rightupHeight} onSearch={this.handleSearch} onClose={this.handleSearchClose} />
                </div>
              </div>
            )
          }
        </div>
        { 
          this.state.searchResults && (
            <div className='searchresults'>
              <SearchResults 
                lang={this.props.env.lang} 
                date={this.props.env.date}
                data={this.state.searchResults} 
                defaultWidth={this._leftWidth+this._riskWidth+this._blockMargin} 
                maxHeight={document.body.offsetHeight-this._blockMargin*2-this._upHeight-220}
                onOpenEntity={this.props.onOpenEntity}
                onOpenEvent={this.props.onOpenEvent} />
            </div>
          )
        }
      </div>
    )
  }
}
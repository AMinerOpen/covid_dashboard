import * as React from "react";
import "./main.scss";
import EpidemicMap from "../map/epidemic-map";
import { IDefaultProps, IEnv } from "../../global";
import Toolbar from "../toolbar/toolbar";
import Forcast from "../forcast/forcast";
import { ITimeline, IEpidemicData } from "../../models/index";
import Timeline from "../timeline/timeline";
import { ReactComponent as Forcast_Svg } from "./images/forcast.svg";
import ControlBar from "../controlBar/controlBar";
import { ReactComponent as Source_Svg } from "../toolbar/images/source.svg";
import { ReactComponent as Search_Svg } from '../toolbar/images/search.svg';
import Source from "../source/source";
import EventPanel from "../event/eventPanel";
import { Header } from "covid-header";
import Infobar from "../infobar/infobar";
import SearchBox from "../searchbox";
import EventTree from "../event/eventTree";
import Hotbar from "../hotbar/hotbar";
import EntityPanel from "../entityPanel/entityPanel";

interface IPanelParams {
  type: 'event' | "entity";
  date: Date;
  data: any;
}

interface IProps extends IDefaultProps {
  frame: boolean;
  onSwitchLocale: () => void;
  onLoadGlobalEpData: (epData: {
    [id: string]: ITimeline<IEpidemicData>;
  }) => void;
  onLoadGlobalTranslateData: (transData: {
    [id: string]: { [lang: string]: string };
  }) => void;
  onChangeDate: (d: Date) => void;
  onChangeSpeed: (speed: number) => void;
}

interface IState {
  tflag: number;
  langAll: boolean;
  theme: string;
  showForcast: boolean;
  news: any[];
  events: any[];
  showDataSource: boolean;
  panelStack: IPanelParams[];
  mapMode: string;
  showSearch: boolean;
  fps: number;
}

export default class Main extends React.Component<IProps, IState> {
  private begin = new Date(2020, 0, 24, 0, 0, 0, 0)
  private end = new Date()
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

  constructor(props: IProps) {
    super(props);
    this.state = {
      tflag: 0,
      langAll: true,
      theme: "light",
      showForcast: false,
      news: [],
      events: [],
      showDataSource: false,
      panelStack: [],
      mapMode: 'risk',
      showSearch: false,
      fps: 0
    };

    this.handleLangAllChange = this.handleLangAllChange.bind(this);
    this.handleClickDataSource = this.handleClickDataSource.bind(this);
    this.handleOpenEventPanel = this.handleOpenEventPanel.bind(this);
    this.handleKg = this.handleKg.bind(this);
    this.handleDatasets = this.handleDatasets.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleOpenEntityPanel = this.handleOpenEntityPanel.bind(this);
    this.pushPanelStack = this.pushPanelStack.bind(this);
    this.popPanelStack = this.popPanelStack.bind(this);
  }

  public componentDidMount() {
    this.props.onChangeDate(new Date());
  }

  private handleLangAllChange() {
    this.setState({ langAll: !this.state.langAll });
  }

  private handleClickDataSource() {
    this.setState({ showDataSource: !this.state.showDataSource });
  }

  private setTime(newDate: Date, auto?: boolean) {
    if (newDate < this.begin) newDate = new Date(this.begin)
    if (newDate > this.end) newDate = new Date(this.end)
    if (!auto || newDate >= this.end) {
        if (this.props.env.speed !== 0) this.props.onChangeSpeed(0)
    }
    this.props.onChangeDate(newDate)
  } 

  private handleOpenEventPanel(date: Date, data: any) {
    this.pushPanelStack({ 
      type: "event",
      date,
      data
    })
  }

  private handleOpenEntityPanel(entity: any, entityDate?: Date) {
    this.pushPanelStack({
      type: "entity",
      date: entityDate || this.props.env.date,
      data: entity
    })
  }

  private handleMarkerClick(data: any) {
    this.pushPanelStack({
      type: "event",
      date: this.props.env.date,
      data
    })
  }

  private pushPanelStack(params: IPanelParams) {
    let panelStack: IPanelParams[] = [...this.state.panelStack];
    panelStack.push(params);
    this.setState({panelStack});
  }

  private popPanelStack() {
    let panelStack: IPanelParams[] = [...this.state.panelStack];
    if(panelStack.length) {
      panelStack.pop();
      this.setState({panelStack});
    }
  }

  private handleKg() {
    let url: string = "https://covid-19.aminer.cn/kg";
    window.open(url, "_blank");
  }

  private handleDatasets() {
    let url: string = "http://aminer.cn/data-covid19";
    window.open(url, "_blank");
  }

  private map(): JSX.Element {
    return (
      <EpidemicMap
        onLoadGlobalEpData={this.props.onLoadGlobalEpData}
        onLoadGlobalTranslateData={this.props.onLoadGlobalTranslateData}
        onChangeDate={this.props.onChangeDate}
        onChangeSpeed={this.props.onChangeSpeed}
        env={this.props.env}
        transData={this.props.transData}
        epData={this.props.epData}
        theme={this.state.theme}
        news={this.state.news}
        onEventClick={this.handleMarkerClick}
        langAll={this.state.langAll}
        mapMode={this.state.mapMode}
        onSetMapMode={(mapMode: string) => this.setState({mapMode})}
      />
    );
  }

  private toolbar(): JSX.Element {
    const { env, onSwitchLocale } = this.props;
    const { langAll } = this.state;
    return (
      <Toolbar
        env={env}
        langAll={langAll}
        onLangAllChange={this.handleLangAllChange}
        transData={this.props.transData}
        epData={this.props.epData}
        theme={this.state.theme}
        onClickSource={this.handleClickDataSource}
        onSearch={() => this.setState({showSearch: !this.state.showSearch})}
        onSwitchTheme={() =>
          this.setState({
            theme: this.state.theme === "dark" ? "light" : "dark"
          })
        }
      />
    );
  }

  private timeline(): JSX.Element {
    const { env } = this.props;
    const { langAll } = this.state;
    return (
      <Timeline
        env={env}
        onTflagChange={tflag => this.setState({tflag})}
        langAll={langAll}
        onChangeDate={this.props.onChangeDate}
        onChangeSpeed={this.props.onChangeSpeed}
        transData={this.props.transData}
        epData={this.props.epData}
        onLoadNews={news => this.setState({ news })}
        onLoadEvents={events => this.setState({events})}
        onOpenEvent={this.handleOpenEventPanel}
      />
    );
  }

  private hotbar(): JSX.Element {
    return (
      <Hotbar
        lang={this.props.env.lang}
        date={this.props.env.date}
        events={this.state.events}
        onOpenEvent={this.handleOpenEventPanel}
        onOpenEntity={this.handleOpenEntityPanel}/>
    )
  }

  private forcast(): JSX.Element {
    return (
      <Forcast
        lang={this.props.env.lang}
        isMobile={this.props.env.isMobile}
        onClose={() => this.setState({ showForcast: false })}
        transData={this.props.transData}
        epData={this.props.epData}
      />
    );
  }

  private controlBar(): JSX.Element {
    return (
      <ControlBar
        env={this.props.env}
        transData={this.props.transData}
        epData={this.props.epData}
        onChangeSpeed={this.props.onChangeSpeed}
        onChangeDate={this.props.onChangeDate}
      />
    );
  }

  private source(): JSX.Element {
    return <Source onClose={() => this.setState({ showDataSource: false })} />;
  }

  private eventPanel(param: IPanelParams): JSX.Element {
    return (
      <EventPanel
        env={this.props.env}
        events={this.state.events}
        date={param.date!}
        onClose={this.popPanelStack}
        focusEvent={param.data}
        onOpenEntity={this.handleOpenEntityPanel}
      />
    );
  }

  private entityPanel(param: IPanelParams): JSX.Element {
    return (
      <EntityPanel
        env={this.props.env}
        events={this.state.events}
        date={param.date}
        data={param.data}
        onOpenEvent={this.handleOpenEventPanel}
        onOpenEntity={this.handleOpenEntityPanel}
        onClose={this.popPanelStack}/>
    )
  }

  private header(): JSX.Element {
    return <Header lang={this.props.env.lang} onSwitchLang={this.props.onSwitchLocale} tab="map"/>;
  }

  private infobar(): JSX.Element {
    return (
      <Infobar events={this.state.events} epData={this.props.epData} tflag={this.state.tflag}/>
    )
  }

  public render() {
    const { env, frame } = this.props;
    const {
      showForcast,
      showDataSource,
      panelStack,
      showSearch
    } = this.state;
    let curPanel: IPanelParams | null = panelStack.length ? panelStack[panelStack.length-1] : null;
    return (
      <div className="main">
        {env.isMobile ? (
          <div className="main_root">
            { !frame && <div className="main_header">{this.header()}</div> }
            <div className="main_content">
              <div className="main_map">{this.map()}</div>
              <div className="main_upper">
                <div className="main_timeline">{this.timeline()}</div>
                <div className="main_right">
                  <div className="main_toolbar">{this.toolbar()}</div>
                  <div className="main_btns">
                    <div
                      className="btn_svg"
                      onClick={() =>
                        this.setState({ showForcast: !showForcast })
                      }
                    >
                      <Forcast_Svg />
                    </div>
                    <div
                      className="btn_svg"
                      onClick={() =>
                        this.setState({ showDataSource: !showDataSource })
                      }
                    >
                      <Source_Svg />
                    </div>
                    <div
                      className="btn_svg"
                      onClick={() =>
                        this.setState({ showSearch: !showSearch })
                      }
                    >
                      <Search_Svg />
                    </div>
                  </div>
                </div>
              </div>
              <div className="main_controlbar">{ showSearch && <SearchBox onClose={() => this.setState({showSearch: false})} onClickEvent={(focusEvent, panelDate) => {this.pushPanelStack({type: 'event', date: panelDate, data: focusEvent})}}/> }</div>
              {showForcast && (
                <div className="main_forcast">{this.forcast()}</div>
              )}
              {showDataSource && <div>{this.source()}</div>}
              {curPanel && curPanel.type == 'event' && this.eventPanel(curPanel)}
              {curPanel && curPanel.type == 'entity' && this.entityPanel(curPanel)}
            </div>
          </div>
        ) : (
          <div className="main_root">
            { !frame && <div className="main_header">{this.header()}</div> }
            <div className="main_content">
              <div className="main_map">{this.map()}</div>
              <div className="main_upper">
                <div className='main_hotbar'>{this.hotbar()}</div>
                <EventTree/>
                <div className="main_timeline">{this.timeline()}</div>
                <div className="main_controlbar">
                  {/* {this.controlBar()} */}
                  { showSearch && <SearchBox onClose={() => this.setState({showSearch: false})} onClickEvent={(focusEvent, panelDate) => {this.pushPanelStack({type: 'event', date: panelDate, data: focusEvent})}}/> }
                </div>
                <div className="main_right">
                  <div className="main_toolbar">{this.toolbar()}</div>
                  <div className="main_infobar">{this.infobar()}</div>
                  <div className="main_forcast">{this.forcast()}</div>
                </div>
              </div>
              {showDataSource && <div>{this.source()}</div>}
              {curPanel && curPanel.type == 'event' && this.eventPanel(curPanel)}
              {curPanel && curPanel.type == 'entity' && this.entityPanel(curPanel)}
            </div>
          </div>
        )}
      </div>
    );
  }
}

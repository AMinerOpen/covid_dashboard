import * as React from "react";
import "./main.scss";
import EpidemicMap from "../map/epidemic-map";
import { IDefaultProps } from "../../global";
import Toolbar from "../toolbar/toolbar";
import Forcast from "../forcast/forcast";
import { ITimeline, IEpidemicData } from "../../models/index";
import Timeline from "../timeline/timeline";
import { ReactComponent as Forcast_Svg } from "./images/forcast.svg";
import ControlBar from "../controlBar/controlBar";
import { ReactComponent as Source_Svg } from "../toolbar/images/source.svg";
import { ReactComponent as Contributors_Svg } from "./images/contributors.svg";
import Source from "../source/source";
import EventPanel from "../event/eventPanel";
import Contributors from "../contributors/contributors";
import { Header } from "covid-header";
import 'covid-header/dist/index.css';
import Infobar from "../infobar/infobar";
import MapModeSelector from "../map/map-mode-selector";
import SearchBox from "../searchbox";

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
  showContributors: boolean;
  panelDate: Date | null;
  mapMode: string;
  focusEvent?: any;
}

export default class Main extends React.Component<IProps, IState> {
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
      showContributors: false,
      panelDate: null,
      mapMode: 'risk'
    };

    this.handleLangAllChange = this.handleLangAllChange.bind(this);
    this.handleClickDataSource = this.handleClickDataSource.bind(this);
    this.handleOpenEventPanel = this.handleOpenEventPanel.bind(this);
    this.handleCloseEventPanel = this.handleCloseEventPanel.bind(this);
    this.handleClickContributors = this.handleClickContributors.bind(this);
    this.handleKg = this.handleKg.bind(this);
    this.handleDatasets = this.handleDatasets.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleGithub = this.handleGithub.bind(this);
  }

  private handleLangAllChange() {
    this.setState({ langAll: !this.state.langAll });
  }

  private handleClickDataSource() {
    this.setState({ showDataSource: !this.state.showDataSource });
  }

  private handleClickContributors() {
    this.setState({ showContributors: true });
  }

  private handleOpenEventPanel(date: Date) {
    this.setState({ panelDate: date });
  }

  private handleMarkerClick(data: any) {
    this.setState({ panelDate: this.props.env.date, focusEvent: data });
  }

  private handleCloseEventPanel() {
    this.setState({ panelDate: null });
  }

  private handleKg() {
    let url: string = "https://covid-19.aminer.cn/kg";
    window.open(url, "_blank");
  }

  private handleDatasets() {
    let url: string = "http://aminer.cn/data-covid19";
    window.open(url, "_blank");
  }

  private handleGithub() {
    let url: string = "https://github.com/AMinerOpen/covid_dashboard";
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
        mapMode={this.state.mapMode}
        onSetMapMode={(mapMode: string) => this.setState({mapMode})}
        onClickSource={this.handleClickDataSource}
        onClickContributors={this.handleClickContributors}
        onClickGithub={this.handleGithub}
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

  private eventPanel(): JSX.Element {
    return (
      <EventPanel
        env={this.props.env}
        events={this.state.events}
        date={this.state.panelDate!}
        onClose={this.handleCloseEventPanel}
        focusEvent={this.state.focusEvent}
      />
    );
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
      showContributors,
      panelDate
    } = this.state;
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
                      onClick={this.handleClickContributors}
                    >
                      <Contributors_Svg />
                    </div>
                    <MapModeSelector mapMode={this.state.mapMode} onSetMapMode={(mapMode) => this.setState({mapMode})}/>
                  </div>
                </div>
              </div>
              <div className="main_controlbar">{this.controlBar()}</div>
              {showForcast && (
                <div className="main_forcast">{this.forcast()}</div>
              )}
              {showDataSource && <div>{this.source()}</div>}
              {showContributors && (
                <Contributors
                  onClose={() => this.setState({ showContributors: false })}
                  env={env}
                />
              )}
              {panelDate && this.eventPanel()}
            </div>
          </div>
        ) : (
          <div className="main_root">
            { !frame && <div className="main_header">{this.header()}</div> }
            <div className="main_content">
              <div className="main_map">{this.map()}</div>
              <div className="main_upper">
                <div className="main_timeline">{this.timeline()}</div>
                <div className="main_controlbar">
                  {this.controlBar()}
                  <SearchBox onClickEvent={(focusEvent, panelDate) => {this.setState({focusEvent, panelDate})}}/>
                </div>
                <div className="main_right">
                  <div className="main_toolbar">{this.toolbar()}</div>
                  <div className="main_infobar">{this.infobar()}</div>
                  <div className="main_forcast">{this.forcast()}</div>
                </div>
              </div>
              {showDataSource && <div>{this.source()}</div>}
              {showContributors && (
                <Contributors
                  onClose={() => this.setState({ showContributors: false })}
                  env={env}
                />
              )}
              {panelDate && this.eventPanel()}
            </div>
          </div>
        )}
      </div>
    );
  }
}

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
import Header from "../header/header";
import Infobar from "../infobar/infobar";

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
  currentEvent: any;
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
      currentEvent: null
    };

    this.handleLangAllChange = this.handleLangAllChange.bind(this);
    this.handleClickDataSource = this.handleClickDataSource.bind(this);
    this.handleOpenEventPanel = this.handleOpenEventPanel.bind(this);
    this.handleCloseEventPanel = this.handleCloseEventPanel.bind(this);
    this.handleClickContributors = this.handleClickContributors.bind(this);
    this.handleKg = this.handleKg.bind(this);
    this.handleDatasets = this.handleDatasets.bind(this);
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

  private handleOpenEventPanel(event: any) {
    this.setState({ currentEvent: event });
  }

  private handleCloseEventPanel() {
    this.setState({ currentEvent: null });
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
        onEventClick={this.handleOpenEventPanel}
        langAll={this.state.langAll}
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
        onClickContributors={this.handleClickContributors}
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
        event={this.state.currentEvent}
        onClose={this.handleCloseEventPanel}
      />
    );
  }

  private header(): JSX.Element {
    return <Header lang={this.props.env.lang} onSwitchLang={this.props.onSwitchLocale}/>;
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
      currentEvent,
      showContributors
    } = this.state;
    return (
      <div className="main">
        {env.isMobile ? (
          <div className="main_root">
            { !frame && <div className="main_header">{this.header()}</div> }
            <div className="main_content">
              <div className="main_map">{this.map()}</div>
              <div className="main_upper">
                {!showForcast && (
                  <div className="main_timeline">{this.timeline()}</div>
                )}
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
              {currentEvent && this.eventPanel()}
            </div>
          </div>
        ) : (
          <div className="main_root">
            { !frame && <div className="main_header">{this.header()}</div> }
            <div className="main_content">
              <div className="main_map">{this.map()}</div>
              <div className="main_upper">
                <div className="main_timeline">{this.timeline()}</div>
                <div className="main_controlbar">{this.controlBar()}</div>
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
              {currentEvent && this.eventPanel()}
            </div>
          </div>
        )}
      </div>
    );
  }
}

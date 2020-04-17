import React from "react";
import { IntlProvider } from "react-intl";
import zh_CN from './locales/zh-CN';
import en_US from './locales/en-US';
import "antd/dist/antd.css";
import "./App.scss";
import Main from "./components/main/main";
import {IEnv} from './global';
import { ITimeline, IEpidemicData } from './models';
import QueryString from 'query-string';

interface IState {
  env: IEnv;
  epData: {[id: string]: ITimeline<IEpidemicData>}
  transData: {[id: string]: {[lang: string]: string}}
  frame: boolean;
}

export default class App extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);

    let parsed: any = QueryString.parse(window.location.search);
    let parsedLang: "zh" | 'en' = parsed['lang'] == 'zh' || parsed['lang'] == 'en' ? parsed['lang'] : "";
    let frame: boolean = parsed['frame'] || parsed['isShow'] == 'false' || false;
    this.state = {
      env: {
        lang: parsedLang || this.getCurrentLanguage(),
        isMobile: this.getIsMobile(),
        date: new Date(),
        speed: 0
      },
      epData: {},
      transData: {},
      frame
    }

    this.handleSwitchLocale = this.handleSwitchLocale.bind(this);
    this.handleChangeSpeed = this.handleChangeSpeed.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  public componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  private getCurrentLanguage(): 'en' | 'zh' {
    let lang: 'zh' | 'en' = navigator.language.toLowerCase().indexOf('zh') >= 0 ? 'zh' : 'en';
    return lang;
  }

  private handleResize() {
    let isMobile: boolean = this.getIsMobile();
    if(isMobile != this.state.env.isMobile) {
      this.setState({env: {...this.state.env, isMobile}});
    }
  }

  private getIsMobile(): boolean {
    return document.body.offsetWidth < 560;
  }

  private getMessage() {
    switch(this.state.env.lang) {
      case "en":
        return en_US;
      case "zh":
      default:
        return zh_CN;
    }
  }

  private handleSwitchLocale() {
    let env: IEnv = {...this.state.env, lang: this.state.env.lang == 'en' ? 'zh' : 'en'};
    this.setState({env});
  }

  private handleChangeSpeed(speed: number) {
    let env: IEnv = {...this.state.env, speed};
    this.setState({env});
  }

  public render() {
    const {env, transData, epData} = this.state;
    return (
      <IntlProvider locale={env.lang} messages={this.getMessage()}>
        <div className="App">
          <Main env={env} onSwitchLocale={this.handleSwitchLocale} transData={transData} epData={epData}
            onLoadGlobalEpData={(epData) => this.setState({epData})}
            onLoadGlobalTranslateData={(transData) => this.setState({transData})}
            onChangeDate={(date: Date) => { this.setState({env: {...this.state.env, date}}) }}
            onChangeSpeed={(speed: number) => {this.handleChangeSpeed(speed)}}
            frame={this.state.frame}/>
        </div>
      </IntlProvider>
    );
  }
}

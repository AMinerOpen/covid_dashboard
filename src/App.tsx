import React from "react";
import { IntlProvider } from "react-intl";
import zh_CN from './locales/zh-CN';
import en_US from './locales/en-US';
import "./App.scss";
import Main from "./components/main/main";
import {IEnv} from './global';
import { ITimeline, IEpidemicData } from './models';
import QueryString from 'query-string';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Contributors from './components/contributors/contributors';

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
    if(lang == 'en') {
      document.title = "COVID-19 Graph - Knowledge Dashboard";
    }
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
    document.title = env.lang == 'zh' ? "全球新冠疫情智能驾驶舱" : "COVID-19 Graph - Knowledge Dashboard";
    this.setState({env});
  }

  private handleChangeSpeed(speed: number) {
    let env: IEnv = {...this.state.env, speed};
    this.setState({env});
  }

  private drawMain(): JSX.Element {
    const {env, transData, epData} = this.state;
    return (
      <Main env={env} onSwitchLocale={this.handleSwitchLocale} transData={transData} epData={epData}
            onLoadGlobalEpData={(epData) => this.setState({epData})}
            onLoadGlobalTranslateData={(transData) => this.setState({transData})}
            onChangeDate={(date: Date) => { this.setState({env: {...this.state.env, date}}) }}
            onChangeSpeed={(speed: number) => {this.handleChangeSpeed(speed)}}
            frame={this.state.frame}/>
    )
  }

  public render() {
    const {env} = this.state;
    return (
      <IntlProvider locale={env.lang} messages={this.getMessage()}>
        <Router>
          <div className="App">
            <Route exact path='/' >{this.drawMain()}</Route>
            <Route exact path='/public' >{this.drawMain()}</Route>
            <Route exact path='/contributors' ><Contributors lang={env.lang} onSwitchLang={this.handleSwitchLocale} /></Route>
          </div>
        </Router>
      </IntlProvider>
    );
  }
}

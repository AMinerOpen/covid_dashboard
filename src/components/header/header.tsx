import * as React from 'react';
import './header.scss';
import { FormattedMessage } from "react-intl";
import { ReactComponent as ListSvg } from './images/list.svg';
import { ReactComponent as EnSvg } from './images/en.svg';
import { ReactComponent as ZhSvg } from './images/cn.svg';

interface IProps {
    lang: "zh" | "en";
    onSwitchLang: () => void;
}

interface IState {
    showList: boolean;
    tabHover: string;
    subtabX: number;
}

export default class Header extends React.Component<IProps, IState> {
    private _tools: HTMLDivElement | null = null;
    private _research: HTMLDivElement | null = null;
    private _public: HTMLDivElement | null = null;
    private _subtabTimer: any = null;
    constructor(props: IProps) {
        super(props);
        this.state = {
            showList: false,
            tabHover: "",
            subtabX: 0
        };

        this.handleSelftest = this.handleSelftest.bind(this);
        this.handleTabHover = this.handleTabHover.bind(this);
        this.handleLangClick = this.handleLangClick.bind(this);
        this.clearTimer = this.clearTimer.bind(this);
        this.handleTabOut = this.handleTabOut.bind(this);
        this.handleDatasets = this.handleDatasets.bind(this);
        this.handleKg = this.handleKg.bind(this);
        this.handlePolicy = this.handlePolicy.bind(this);
        this.handleTimeline = this.handleTimeline.bind(this);
        this.handleExperts = this.handleExperts.bind(this);
    }

    private handleSelftest() {
        let url: string =
          this.props.lang == "zh"
            ? "http://covid-19-zh.tsing-care.com"
            : "https://covid-19-en.tsing-care.com/";
        window.open(url, "_blank");
    }

    private handleSubscribe() {
        window.open("https://newsminer.net/tech/", '_blank');
    }

    private handleTabHover(tab: string) {
        if(!tab) {
            this.setState({tabHover: ""});
        }else if(tab == "tools") {
            this.clearTimer();
            let subtabX: number = this._tools!.offsetLeft + this._tools!.parentElement!.offsetLeft - this._tools!.clientWidth/2 + 16;
            this.setState({tabHover: tab, subtabX});
        }else if(tab == "research") {
            this.clearTimer();
            let subtabX: number = this._research!.offsetLeft + this._research!.parentElement!.offsetLeft - this._research!.clientWidth/2 + 62;
            this.setState({tabHover: tab, subtabX});
        }else if(tab == "public") {
            this.clearTimer();
            let subtabX: number = this._public!.offsetLeft + this._public!.parentElement!.offsetLeft - this._public!.clientWidth/2 + 52;
            this.setState({tabHover: tab, subtabX});
        }
    }

    private clearTimer() {
        this._subtabTimer && clearTimeout(this._subtabTimer);
    }

    private handleTabOut() {
        this._subtabTimer = setTimeout(() => {
            this.handleTabHover("");
        }, 500)
    }

    private handleLangClick() {
        this.props.onSwitchLang && this.props.onSwitchLang();
        if(this.state.showList) {
            this.setState({showList: false});
        }
    }

    private handleDatasets() {
        window.open("https://aminer.cn/data-covid19/?lang=" + this.props.lang, '_blank');
    }

    private handleKg() {
        window.open("https://covid-19.aminer.cn/kg/?lang=" + this.props.lang, "_blank");
    }

    private handlePolicy() {
        window.open("https://zhengce.aminer.cn/", "_blank");
    }

    private handleTimeline() {
        window.open("https://www.aminer.cn/ncp-pubs?lang=" + this.props.lang, "_blank");
    }

    private handleExperts() {
        window.open("https://2019-ncov.aminer.cn", "_blank");
    }

    public render() {
        let lang: string = this.props.lang;
        return (
            <div className='header'>
                <div className='logo'>
                    <div className='logo1'><a href='http://www.ckcest.cn/' target='_blank'><img src={require('./images/ckcest_home.png')} /></a></div>
                    <div className='line1' />
                    <div className='logo2'><a href='https://www.aminer.cn/' target='_blank'><img src={require('./images/aminer_logo.png')} /></a></div>
                    <div className='line2' />
                    <div className='map_logo'>
                        <a href='https://covid-dashboard.aminer.cn/'>
                        {
                            this.props.lang == 'zh' ? (
                            <div>
                                <div className='logo_up'>知识疫图</div>
                                <div className='logo_down'>COVID-19 GRAPH</div>
                            </div>
                            ) : (
                                <div className='logo_en'>COVID-19 GRAPH</div>
                            )
                        }
                        </a>
                    </div>
                </div>
                <div className='tabs'>
                    <div className='tab map' onMouseOver={() => this.handleTabHover("")}><FormattedMessage id='header.map' /></div>
                    <div className='tab' ref={r => this._research = r} onMouseOver={() => this.handleTabHover("research")} onMouseOut={this.handleTabOut}><FormattedMessage id='header.research' /></div>
                    <div className='tab' ref={r => this._public = r} onMouseOver={() => this.handleTabHover("public")} onMouseOut={this.handleTabOut}><FormattedMessage id='header.public' /></div>
                    <div className='tab tools' ref={r => this._tools = r} onMouseOver={() => this.handleTabHover("tools")} onMouseOut={this.handleTabOut} ><FormattedMessage id='header.tools' /></div>
                    <div className='tab' onMouseOver={() => this.handleTabHover("")} onClick={() => window.open('https://covid-19.aminer.cn', '_blank')}><FormattedMessage id='header.more' /></div>
                </div>
                <div className='subtabs' style={{opacity: this.state.tabHover ? 1 : 0.01}} onMouseOut={this.handleTabOut} onMouseOver={this.clearTimer}>
                    <div className='inner' style={{left: this.state.subtabX}}>
                        {this.state.tabHover == 'tools' && <div className='subtab' onClick={this.handleSelftest}><FormattedMessage id='header.selftest' /></div>}
                        {this.state.tabHover == 'tools' && <div className='subtab' onClick={this.handleSubscribe}><FormattedMessage id='header.subscribe' /></div>}
                        {this.state.tabHover == 'research' && <div className='subtab' onClick={this.handleDatasets}><FormattedMessage id='header.datasets' /></div>}
                        {this.state.tabHover == 'research' && <div className='subtab' onClick={this.handleKg}><FormattedMessage id='header.kg' /></div>}
                        {this.state.tabHover == 'research' && <div className='subtab' onClick={this.handleTimeline}><FormattedMessage id='header.timeline' /></div>}
                        {this.state.tabHover == 'research' && <div className='subtab' onClick={this.handleExperts}><FormattedMessage id='header.experts' /></div>}
                        {this.state.tabHover == 'public' && <div className='subtab' onClick={this.handlePolicy}><FormattedMessage id='header.policy' /></div>}
                    </div>
                </div>
                <div className='menu' onClick={() => this.setState({showList: !this.state.showList})}><ListSvg /></div>
                {
                    this.state.showList && (
                        <div className='list'>
                            <div className='item'><FormattedMessage id='header.map' /></div>
                            <div className='item'><FormattedMessage id='header.research' /></div>
                            <div className='item sub' onClick={this.handleDatasets}><FormattedMessage id='header.datasets' /></div>
                            <div className='item sub' onClick={this.handleKg}><FormattedMessage id='header.kg' /></div>
                            <div className='item sub' onClick={this.handleTimeline}><FormattedMessage id='header.timeline' /></div>
                            <div className='item sub' onClick={this.handleExperts}><FormattedMessage id='header.experts' /></div>
                            <div className='item'><FormattedMessage id='header.public' /></div>
                            <div className='item sub' onClick={this.handlePolicy}><FormattedMessage id='header.policy' /></div>
                            <div className='item' ><FormattedMessage id='header.tools' /></div>
                            <div className='item sub' onClick={this.handleSelftest} ><FormattedMessage id='header.selftest' /></div>
                            <div className='item sub' onClick={this.handleSubscribe}><FormattedMessage id='header.subscribe' /></div>
                            <div className='item' onClick={() => window.open('https://covid-19.aminer.cn', '_blank')}><FormattedMessage id='header.more' /></div>
                            <div className='item' onClick={this.handleLangClick}>{lang == 'zh' ? "English" : "中文"}</div>
                        </div>
                    )
                }
                <div className='lang' onClick={this.handleLangClick}>
                    { lang == 'zh' ? <ZhSvg /> : <EnSvg />}
                </div>
            </div>
        )
    }
}
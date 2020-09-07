import * as React from 'react';
import './infobar.scss';
import { FormattedMessage } from "react-intl";
import dateFormat from 'dateformat';
import ActiveNumber from '../activeNumber/ActiveNumber';

interface IProps {
    events: any[];
    epData: any;
    tflag: number;
}

interface IState {
    regions: number;
    papers: number;
    events: number;
    viewed: number;
}

export default class Infobar extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            regions: 0,
            papers: 0,
            events: 0,
            viewed: 0
        }
    }

    componentDidMount() {
        if(this.props.epData && Object.keys(this.props.epData).length) {
            this.updateRegions()
        }
        if(this.props.events.length) {
            this.updateEvents();
        }
        let last: number = Number(localStorage.getItem("covid-dashboard-viewed")) || 0;
        if((new Date()).getTime() - last > 2 * 60 * 60000) {
            this.addViewed();
        }

        this.updateViewed();
        setInterval(() => {
            this.updateViewed();
        }, 60000);
    }

    componentDidUpdate(preProps: IProps) {
        if(this.props.epData != preProps.epData) {
            this.updateRegions();
        }
        if(preProps.events != this.props.events) {
            this.updateEvents();
        }
    }

    private addViewed() {
        let url: string = "https://innovaapi.aminer.cn/predictor/api/v1/valhalla/feedback/";
        fetch(url, {method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "cla": "ncov",
                "pid": "covid-dashboard",
                "positive": 1,
                "negtive": 0
                })
            }).then(response => response.json()).then(data => {
                if(data && data.status == 0) {
                    localStorage.setItem("covid-dashboard-viewed", (new Date).getTime().toString());
                }
            })
    }

    private updateViewed() {
        let url = "https://innovaapi.aminer.cn/predictor/api/v1/valhalla/feedback/get_feedback/";
        fetch(url, {method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "cla": "ncov",
                "pid_list": ['covid-dashboard', 'covid-datasets']
                })
            }).then(response => response.json()).then(data => {
                if(data && data.data.length) {
                    let viewed: number = data.data.reduce((num: number, cur: any) => num + cur.positive_cnt, 0) + 322022;
                    if(viewed != this.state.viewed) {
                        this.setState({viewed});
                    }
                }
            })
    }

    private updateRegions() {
        let regions: number = Object.keys(this.props.epData).length - 1;
        if(regions != this.state.regions) {
            this.setState({regions});
        }
    }

    private updateEvents() {
        let papers: number = 0;
        let events: number = 0;
        this.props.events.forEach((d:any) => {
            d.data.forEach((data:any) => {
                if(data.type == 'paper') {
                    papers += 1;
                }else {
                    events += 1;
                }
            })
        })
        papers += 84232;
        if(papers != this.state.papers || events != this.state.events) {
            this.setState({papers, events});
        }
    }

    public render() {
        let date: Date = this.props.tflag ? new Date(this.props.tflag) : new Date();
        return (
            <div className='infobar'>
                <div className='item'><FormattedMessage id='infobar.regions' /><span className='num'>: <ActiveNumber value={this.state.regions} /></span></div>
                <div className='item'><FormattedMessage id='infobar.papers' /><span className='num'>: <ActiveNumber value={this.state.papers} /></span></div>
                <div className='item'><FormattedMessage id='infobar.events' /><span className='num'>: <ActiveNumber value={this.state.events} /></span></div>
                <div className='item'><FormattedMessage id='infobar.viewed' /><span className='num'>: <ActiveNumber value={this.state.viewed} /></span></div>
                <div className='item'><FormattedMessage id='infobar.lastupdate' /><span className='num'>{`: ${dateFormat(date, "yyyy/mm/dd HH:MM:ss")}`}</span></div>
            </div>
        )
    }
}
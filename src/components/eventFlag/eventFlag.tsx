import * as React from 'react';
import './eventFlag.scss';

interface IProps {
    lang?: string;
    type: string;
    category?: string;
}

export default class EventFlag extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    private text(): string {
        if(this.props.type == 'paper') {
            return "Paper";
        }else if(this.props.type == 'news') {
            return "News";
        }else if(this.props.type == "event") {
            return "Event";
        }else if(this.props.type == "points") {
            return "Point";
        }
        return "";
    }

    private color(): string {
        if(this.props.type == 'paper') {
            return "black";
        }else if(this.props.type == 'news') {
            return "black";
        }else if(this.props.type == "event") {
            return "black";
        }else if(this.props.type == "points") {
            return "black";
        }
        return "";
    }

    private background(): string {
        if(this.props.type == 'paper') {
            return "yellow";
        }else if(this.props.type == 'news') {
            return "salmon";
        }else if(this.props.type == "event") {
            return "mediumspringgreen";
        }else if(this.props.type == "points") {
            return "deepskyblue";
        }
        return "";
    }

    public render() {
        return (
            <span className='eventflag' style={{color: this.color(), backgroundColor: this.background()}}>{this.text()}</span>
        )
    }
}
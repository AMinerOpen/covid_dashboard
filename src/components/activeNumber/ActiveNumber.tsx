import * as React from 'react';
import './ActiveNumber.scss';

interface IProps {
    value: number;
    style?: React.CSSProperties;
}

interface IState {
    value: number;
    playing: boolean;
}

export default class ActiveNumber extends React.Component<IProps, IState> {
    private _actionTotalFrame: number = 50;
    private _valueStart: number = 0;
    private _valueTarget: number = 0;
    private _actionFrame: number = 0;
    private _timeout: NodeJS.Timeout | null = null;

    constructor(props: IProps) {
        super(props);

        this.state = {
            value: this.props.value,
            playing: false
        }
    }

    componentDidUpdate(preProps: IProps) {
        if(preProps.value != this.props.value) {
            if(preProps.value == 0) {
                this.setState({value: this.props.value});
            }else {
                this.changeTo(this.props.value);
            }
        }
    }

    private changeTo(value: number) {
        if(this._timeout) {
            clearTimeout(this._timeout);
        }
        this._actionFrame = 0;
        this._valueStart = this.state.value;
        this._valueTarget = value;
        this.setState({playing: true});
        this.nextFrame();
    }

    private nextFrame() {
        this._actionFrame += 1;
        let value: number = Math.ceil(this._valueStart + (this._valueTarget - this._valueStart) * this._actionFrame / this._actionTotalFrame);
        if(this._actionFrame == this._actionTotalFrame) {
            this.setState({playing: false, value});
        }else {
            this.setState({value});
            this._timeout = setTimeout(() => {
                this.nextFrame();
            }, 50);
        }
    }

    public render() {
        let numStyle: React.CSSProperties = {...this.props.style};
        if(this.state.playing) {
            numStyle.transform = "scale(1.2)",
            numStyle.transformOrigin = "50% 50%",
            numStyle.color = "#e6c65c"
        }

        return (
            <span className='activenumber' style={{...numStyle}}>
                {this.state.value.toLocaleString()}
            </span>
        )
    }
}
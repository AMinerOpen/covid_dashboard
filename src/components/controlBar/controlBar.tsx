import * as React from 'react';
import './controlBar.scss';
import { IDefaultProps } from '../../global';
import { CaretRightOutlined, PauseOutlined, StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons';

interface IState {
    x3: boolean;
}

interface IProps extends IDefaultProps {
    onChangeSpeed: (speed: number) => void;
    onChangeDate: (date: Date) => void;
}

export default class ControlBar extends React.Component<IProps, IState> {
    private begin = new Date(2020, 0, 24, 0, 0, 0, 0)
    private end = new Date()

    constructor(props: IProps) {
        super(props);
        this.state = {
            x3: false
        }
        this.handleX3 = this.handleX3.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
    }

    private handleX3() {
        if(this.props.env.speed) {
            this.props.onChangeSpeed(this.state.x3 ? 1 : 3);
        }
        this.setState({x3: !this.state.x3});
    }

    private handlePlay() {
        if(this.end.getTime() - this.props.env.date.getTime() <= 3 * 24 * 60 * 60 * 1000 ) {
            this.props.onChangeDate(this.begin);
            setTimeout(() => {
                this.props.onChangeSpeed(this.state.x3 ? 3 : 1)
            }, 200);
        }else {
            this.props.onChangeSpeed(this.state.x3 ? 3 : 1)
        }
    }

    public render() {
        const { env, onChangeDate, onChangeSpeed } = this.props;
        const { x3 } = this.state;
        return (
            <div className='controlbar'>
                <img src={require('./images/bg.png')} />
                {
                    env.speed > 0 ? (
                        <PauseOutlined className='playpause' onClick={() => onChangeSpeed(0)} />
                    ) : (
                        <CaretRightOutlined className='playpause' onClick={this.handlePlay} style={{marginLeft: '3px'}} />
                    )
                }
                <StepBackwardOutlined className='start' onClick={() => onChangeDate(this.begin)} />
                <StepForwardOutlined className='end' onClick={() => onChangeDate(this.end)}/>
                <div className='speed' style={x3 ? {backgroundColor: '#020E26bb', color: 'white'} : undefined} onClick={this.handleX3}>x 3</div>
            </div>
        )
    }
}
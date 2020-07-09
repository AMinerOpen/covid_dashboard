import * as React from 'react';
import "./source.scss";
import { ReactComponent as Close_Svg } from '../forcaste/images/close.svg';
import { FormattedMessage } from "react-intl";

interface IState {
    data: []
}

interface IProps {
    onClose: () => void;
}

export default class Source extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            data: []
        }
        this.handlePanelClick = this.handlePanelClick.bind(this);
    }

    public componentDidMount() {
        this.requestData();
    }

    private requestData() {
        let url: string = process.env.PUBLIC_URL + '/data/datasource.json';
        fetch(url).then(response => response.json()).then(data => {
            if(data && data.length) {
                this.setState({data})
            }
        })
    }

    private handlePanelClick(e: React.MouseEvent) {
        e.stopPropagation();
    }

    private handleMapSource(value: any, index: number): JSX.Element {
        return (
            <div key={index} className='type'>
                <div className='type_name'><FormattedMessage id={value.id} /></div>
                {value.sources.map((item:any, itemIndex:number) => {
                    return (
                        <div key={itemIndex} className='item'>
                            <a href={item.url} target='_blank'>{item.name}</a>
                        </div>
                    )
                })}
            </div>
        )
    }

    public render() {
        const { data } = this.state;
        return (
            <div className='source' onClick={() => this.props.onClose()}>
                <div className='source_panel' onClick={this.handlePanelClick}>
                    <div className='source_content'>
                        <div className='title'><FormattedMessage id='source.title'></FormattedMessage></div>
                        { data.map(this.handleMapSource)}
                    </div>
                    <div className='source_close' onClick={() => this.props.onClose()}>
                        <Close_Svg />
                    </div>
                </div>
            </div>
        )
    }
}
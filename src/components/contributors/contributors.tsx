import * as React from 'react';
import './contributors.scss';
import { FormattedMessage } from 'react-intl'
import { IEnv } from '../../global';

interface IProps {
    env: IEnv;
    onClose: () => void;
}

interface IState {
    data: any[];
}

export default class Contributors extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            data: []
        }

        this.initData();
    }

    private initData() {
        let url: string = process.env.PUBLIC_URL + '/data/contributors.json';
        fetch(url).then(response => response.json()).then(data => {
            if(data && data.length) {
                this.setState({data})
            }
        })
    }

    private drawData(): JSX.Element[] {
        let result:JSX.Element[] = [];
        let lang: 'zh' | 'en' = this.props.env.lang;
        if(this.state.data.length) {
            this.state.data.forEach((d, i) => {
                result.push(
                    <div key={i}>
                        <div className='system'>{d[`system_${lang}`]}</div>
                        {
                            d.teams.map((t: any, ti: number) => <div className='content' key={ti}>{t[lang]}</div>)
                        }
                    </div>
                )
            })
        }
        return result;
    }

    public render() {
        return (
            <div className='contributors' onClick={() => this.props.onClose()}>
                <div className='panel' onClick={e => e.stopPropagation()}>
                    <div className='title'><FormattedMessage id='main.contributors' /></div>
                    {this.drawData()}
                </div>
            </div>
        )
    }
}
import * as React from 'react';
import './toolbar.scss';
import { Switch, Tooltip } from 'antd';
import { FormattedMessage } from "react-intl";
import { IDefaultProps } from '../../global';
import { ReactComponent as Zh_Svg } from './images/Lang_zh.svg';
import { ReactComponent as En_Svg } from './images/Lang_en.svg';
import { ReactComponent as Source_Svg } from './images/source.svg';
import { ReactComponent as Contributor_Svg } from '../main/images/contributors.svg';

interface IProps extends IDefaultProps {
    langAll: boolean;
    onLangAllChange: () => void;
    theme: string;
    onSwitchTheme: () => void;
    onClickSource: () => void;
    onClickContributors: () => void;
}

export default class Toolbar extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const {env, langAll, onLangAllChange} = this.props;
        return (
            <div className='toolbar'>
                {
                    !env.isMobile && (
                        <Tooltip title={<FormattedMessage id={langAll ? 'toolbar.showall.tip' : 'toolbar.showall.tip_off'}/>} >
                            <div className='toolbar_langall'>
                                <span className='toolbar_showall'><FormattedMessage id='toolbar.showall'/>:</span><Switch style={langAll ? {backgroundColor: 'skyblue'} : {backgroundColor: 'grey'}} checked={langAll} onChange={() => onLangAllChange && onLangAllChange()} />
                            </div>
                        </Tooltip>
                    )
                }
                {/* <div className='toolbar_locale' onClick={this.handleClickLocale}>
                    {
                        env.lang == 'en' ? <En_Svg style={{fill: 'lightgrey'}} /> : <Zh_Svg style={{fill: '#e72620'}}/>
                    }
                </div> */}
                <div className='toolbar_source' onClick={() => this.props.onClickSource()}>
                    <Source_Svg />
                </div>
                <div className='toolbar_source' onClick={() => this.props.onClickContributors()}>
                    <Contributor_Svg />
                </div>
                {/* <div className='toolbar_source' onClick={() => this.props.onClickSelftest()}>
                    <Selftest_Svg />
                </div> */}
                {/* <div id="style-switch-btn" className={`button ${this.props.theme === 'dark' ? 'light' : 'dark'}`}
                    onClick={() => this.props.onSwitchTheme()}
                ><i className="fas fa-lightbulb"/></div> */}
            </div>
        )
    }
}
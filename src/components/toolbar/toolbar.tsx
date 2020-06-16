import * as React from 'react';
import './toolbar.scss';
import { Switch, Tooltip } from 'antd';
import { FormattedMessage } from "react-intl";
import { IDefaultProps } from '../../global'
import { ReactComponent as Source_Svg } from './images/source.svg';
import { ReactComponent as Search_Svg } from './images/search.svg';

import _ from 'lodash'

interface IProps extends IDefaultProps {
    langAll: boolean;
    onLangAllChange: () => void;
    markerVisible: boolean;
    onMarkerVisibleChange: () => void;
    theme: string;
    onSwitchTheme: () => void;
    onClickSource: () => void;
    onSearch: () => void;
}

export default class Toolbar extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const {env, langAll, onLangAllChange, markerVisible, onMarkerVisibleChange} = this.props;
        return (
            <div className='toolbar'>
                {/* {
                    !env.isMobile && (
                        <Tooltip title={<FormattedMessage id={langAll ? 'toolbar.showall.tip' : 'toolbar.showall.tip_off'}/>} >
                            <div className='toolbar_langall'>
                                <span className='toolbar_showall'><FormattedMessage id='toolbar.showall'/>:</span><Switch style={langAll ? {backgroundColor: 'skyblue'} : {backgroundColor: 'grey'}} checked={langAll} onChange={() => onLangAllChange && onLangAllChange()} />
                            </div>
                        </Tooltip>
                    )
                } */}
                {
                    !env.isMobile && (
                        <Tooltip title={<FormattedMessage id={markerVisible ? 'toolbar.marker.tip' : "toolbar.marker.tip_off"}/>} >
                            <div className='toolbar_langall'>
                                <span className='toolbar_showall'><FormattedMessage id='toolbar.marker'/>:</span><Switch style={markerVisible ? {backgroundColor: 'skyblue'} : {backgroundColor: 'grey'}} checked={markerVisible} onChange={() => onMarkerVisibleChange && onMarkerVisibleChange()} />
                            </div>
                        </Tooltip>
                    )
                }
                <div className='toolbar_source' onClick={() => this.props.onClickSource()}>
                    <Source_Svg />
                </div>
                {/* <div className='toolbar_source' onClick={() => this.props.onSearch()}>
                    <Search_Svg />
                </div> */}
                {/* <div className='toolbar_locale' onClick={this.handleClickLocale}>
                    {
                        env.lang == 'en' ? <En_Svg style={{fill: 'lightgrey'}} /> : <Zh_Svg style={{fill: '#e72620'}}/>
                    }
                </div> */}
                {/* <div id="style-switch-btn" className={`button ${this.props.theme === 'dark' ? 'light' : 'dark'}`}
                    onClick={() => this.props.onSwitchTheme()}
                ><i className="fas fa-lightbulb"/></div> */}
            </div>
        )
    }
}
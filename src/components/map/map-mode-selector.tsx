import React from 'react'
import './map-mode-selector.scss'
import { FormattedMessage } from 'react-intl'
import { ReactComponent as IconMapSvg } from './icon-map.svg'

interface IProps {
    mapMode: string
    onSetMapMode: (mode: string) => void;
}

interface IState {
    showOptions: boolean
}

export default class MapModeSelector extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = { showOptions: false }
    }

    render() {
        return <div className="mapmode-dropdown">
            <div className="dropdown">
                <div className="selected"><FormattedMessage id={`toolbar.mapmode`}/> &#x25BE;</div>
                {['risk', 'confirmed', 'recovered', 'deceased', 'recovery rate', 'death rate'].map(mode =>
                    <div className={`option ${mode === this.props.mapMode ? 'current' : ''}`} key={mode} onClick={() => this.props.onSetMapMode(mode)}><FormattedMessage id={`toolbar.mapmode.${mode}`}/></div>
                )}
            </div>
        </div>
    }
}
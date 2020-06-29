import React from 'react';
import './hot-marker.scss';
import { ReactComponent as LocationSvg } from './images/location.svg';

export interface IHotMarkerProps {
  code: string;
  label: string;
  risk_level: number;
  lang: 'zh' | 'en';
  onClick: () => void;
}

export default class HotMarker extends React.Component<IHotMarkerProps> {
  markerColors: string[] = ["#8fc360", "#f3bf52", "#e16a66"];
  constructor(props: IHotMarkerProps) {
    super(props);
  }

  render() {
    return <div className='hot-marker'>
      <LocationSvg fill={this.markerColors[this.props.risk_level-1]} />
      <i className={`fa fa-${this.props.risk_level == 1 ? "check" : "exclamation"}`} />
      <div className='hot-marker-label'>{this.props.label}</div>
    </div>
  }
}
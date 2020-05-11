import * as React from 'react';
import './index.scss';

interface IProps {
  style?: React.CSSProperties;
}

interface IState {

}

export default class DBBlock extends React.Component<IProps, IState> {
  constructor(props:IProps) {
    super(props);
    this.state = {

    }
  }

  render() {
    const {style} = this.props;
    return (
      <div className='dbblock' style={style}>
        {this.props.children}
      </div>
    )
  }
}
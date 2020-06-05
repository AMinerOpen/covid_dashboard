import * as React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Input } from 'antd';
import './searchBar.scss';
import { ReactComponent as Search_Svg } from '../toolbar/images/search.svg';
import { ReactComponent as Close_Svg } from '../forcast/images/close.svg';

interface IProps extends WrappedComponentProps {
  lang: 'zh' | 'en';
  width: number;
  height: number;
  onSearch: (text: string) => void;
  onClose: () => void;
}

interface IState {
  focus: boolean;
  text: string;
}

class SearchBar extends React.Component<IProps, IState> {
  private _input: Input | null = null;

  constructor(props: IProps) {
    super(props);
    this.state = {
      focus: false, 
      text: ""
    }
    this.handleClickSearch = this.handleClickSearch.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  private handleInputChange(e: React.ChangeEvent) {
    this.setState({text: (e.target as HTMLInputElement).value});
  }

  private handleClickSearch() {
    if(this.state.focus) {
      if(this.state.text) {
        this.props.onSearch && this.props.onSearch(this.state.text);
      }
    }else {
      this.setState({focus: true})
      setTimeout(() => this._input && this._input.focus(), 200);
    }
  }

  private handleClose() {
    this.setState({focus: false})
    this.props.onClose && this.props.onClose();
  }

  public render() {
    const { width, height } = this.props;
    const { focus, text } = this.state;
    return (
      <div className="searchbar" style={ focus ? {width: `${width}px`, height: `${height}px`, backgroundColor: "#020E26cc"} : undefined}>
        { focus && <Input className="input" placeholder={this.props.intl.formatMessage({id: 'search.placeholder'})} ref={r => this._input = r} onChange={this.handleInputChange} onPressEnter={this.handleClickSearch} value={text} style={{width: `${width-4}px`, height: `${height-4}px`}}/> }
        <Search_Svg className="svg" style={focus ? {left: 'unset', right: '8px'} : undefined} onClick={this.handleClickSearch}/>
        { focus && <Close_Svg className="close" onClick={this.handleClose} /> }
      </div>
    )
  }
}

export default injectIntl(SearchBar);
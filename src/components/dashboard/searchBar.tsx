import * as React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Input } from 'antd';
import { requestEntityHint } from '../../utils/requests';
import './searchBar.scss';
import { ReactComponent as Search_Svg } from '../toolbar/images/search.svg';
import { ReactComponent as Close_Svg } from '../forcaste/images/close.svg';

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
  hintEntities: any[];
  hintIndex: number;
}

class SearchBar extends React.Component<IProps, IState> {
  private _input: Input | null = null;
  private _hintTimeout: NodeJS.Timeout | null = null;

  constructor(props: IProps) {
    super(props);
    this.state = {
      focus: true, 
      text: "",
      hintEntities: [],
      hintIndex: -1
    }
    this.handleClickSearch = this.handleClickSearch.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.clearHintTimer = this.clearHintTimer.bind(this);
    this.handleInputKeydown = this.handleInputKeydown.bind(this);
    this.handleHintClick = this.handleHintClick.bind(this);
  }

  private handleInputChange(e: React.ChangeEvent) {
    let text: string = (e.target as HTMLInputElement).value;
    if(text != this.state.text) {
      this.setState({text});

      this.clearHintTimer();
      if(text) {
        this._hintTimeout = setTimeout(() => {
          requestEntityHint(text).then(data => {
            if(data && data.code == 0) {
              this.setState({hintEntities: data.data.slice(0, 6), hintIndex: -1});
            }
          })
        }, 500)
      }else {
        this.setState({hintEntities: [], hintIndex: -1});
      }
    }
  }

  private handleInputKeydown(e: React.KeyboardEvent) {
    let max: number = this.state.hintEntities.length - 1;
    switch(e.keyCode) {
      case 38 : 
        if(this.state.hintIndex > 0) {
          let index = this.state.hintIndex-1;
          this.setState({hintIndex: index, text: this.state.hintEntities[index][`label_${this.state.hintEntities[index].lang || "zh"}`]});
        }
        break;
      case 40 : 
        if(this.state.hintIndex < max) {
          let index = this.state.hintIndex+1;
          this.setState({hintIndex: index, text: this.state.hintEntities[index][`label_${this.state.hintEntities[index].lang || "zh"}`]});
        }
        break;
    }
  }

  private handleClickSearch() {
    if(this.state.focus) {
      if(this.state.text) {
        this.setState({hintEntities: [], hintIndex: -1});
        this.clearHintTimer();
        this.props.onSearch && this.props.onSearch(this.state.text);
      }
    }else {
      this.setState({focus: true})
      setTimeout(() => this._input && this._input.focus(), 200);
    }
  }

  private handleHintClick(label: string) {
    if(label) {
      this.setState({hintEntities: [], hintIndex: -1, text: label});
      this.clearHintTimer();
      this.props.onSearch && this.props.onSearch(label);
    }
  }

  private clearHintTimer() {
    if(this._hintTimeout) {
      clearTimeout(this._hintTimeout);
      this._hintTimeout = null;
    }
  }

  private handleClose() {
    this.setState({focus: false, hintEntities: []})
    this.props.onClose && this.props.onClose();
  }

  public render() {
    const { width, height } = this.props;
    const { focus, text, hintEntities, hintIndex } = this.state;
    return (
      <div className="searchbar" style={ focus ? {width: `${width}px`, height: `${height}px`, backgroundColor: "#020E26cc"} : undefined}>
        { focus && <Input 
          className="input" 
          placeholder={this.props.intl.formatMessage({id: 'search.placeholder'})} 
          ref={r => this._input = r} 
          onChange={this.handleInputChange} 
          onPressEnter={this.handleClickSearch} 
          onKeyDown={this.handleInputKeydown}
          value={text} 
          style={{width: `${width-4}px`, height: `${height-4}px`}}/> }
        <Search_Svg className="svg" style={focus ? {left: 'unset', right: '8px'} : undefined} onClick={this.handleClickSearch}/>
        { focus && <Close_Svg className="close" onClick={this.handleClose} /> }
        {!!hintEntities.length && (
          <div className="hints" >
            {hintEntities.map((entity: any, i: number) => {
              let label: string = entity[`label_${entity.lang || "zh"}`];
              return (
                <div 
                  className="hint_entity" 
                  style={hintIndex == i ? {backgroundColor: "#d1f2ff"} : undefined} 
                  key={i}
                  onClick={() => this.handleHintClick(label)}>
                  {label}
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }
}

export default injectIntl(SearchBar);
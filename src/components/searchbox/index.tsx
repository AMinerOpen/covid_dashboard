import React from 'react'
import { Input } from 'antd'
import { injectIntl, WrappedComponentProps } from 'react-intl'
import './index.scss'
import { requestSearchEvent } from '../../utils/requests'
import _ from 'lodash'
import { getEventColor } from '../eventFlag/utils'
import GlobalStorage from '../../utils/global-storage'
import { CloseCircleOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons'

interface IProps extends WrappedComponentProps {
    onClickEvent: (focusEvent: any, time: Date) => void;
    onClose: () => void;
}
interface IState {
    loading: boolean
    items: any[]
    size: 'small' | 'large'
}

class SearchBox extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = { loading: false, items: [], size: 'small' }
    }

    private _text = ''
    search(text: string) {
        if (this._text !== text) this._text = text
        this._search()
    }

    _search = _.debounce(() => {
        const text = this._text.trim()
        if (text.length === 0) {
            this.setState({items: []})
            return
        }
        this.setState({items: [], loading: true})
        requestSearchEvent(text).then(resp => {
            this.setState({items: resp, loading: false})
        }).catch(err => {
            console.warn('Search Error:', err)
            this.setState({items: [], loading: false})
        })
    }, 500)

    onClickEvent(event: any) {
        const focusEvent = GlobalStorage.events[event._id]
        if (focusEvent) {
            this.props.onClose();
            this.props.onClickEvent(focusEvent, focusEvent.time)
        }
    }

    render() {
        return <div className='search-box'>
            {this.state.items.length > 0 && <div className="search-result" style={{width: this.state.size === 'small' ? 300 : 450}}>
                <div className="search-control">
                    <div className="control-btn" onClick={() => this.setState({size: this.state.size === 'small' ? 'large' : 'small'})}>{this.state.size === 'small' ? <FullscreenOutlined/> : <FullscreenExitOutlined/>}</div>
                    <div className="control-btn" onClick={() => this.setState({items: []})}><CloseCircleOutlined/></div>
                </div>
                <div className="search-items" style={{maxHeight: this.state.size === 'small' ? 350 : 500}}>
                {this.state.items.map(item => {
                    return <div key={item._id} className="search-item" onClick={() => this.onClickEvent(item)}>
                        <div className="event-type" style={{background: getEventColor(item.type)}}>{_.capitalize(item.type)}</div>
                        <div className="event-time">{item.time}</div>
                        <div className="event-title">{item.title}</div>
                    </div>
                })}
                </div>
            </div>}
            <div className="search-input">
                <Input.Search placeholder={this.props.intl.formatMessage({id: "search.placeholder"})} onChange={(e) => this.search(e.target.value)} onSearch={(text) => this.search(text)} loading={this.state.loading}/><span className='close' onClick={() => this.props.onClose && this.props.onClose()}><CloseCircleOutlined/></span>
            </div>
        </div>
    }
}

export default injectIntl(SearchBox)
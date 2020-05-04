import React from 'react'
import './eventTree.scss'
import { requestEventsTree } from '../../utils/requests'
import GlobalStorage from '../../utils/global-storage'
import { IEvent } from '../../utils/global-storage'
import _ from 'lodash'
import { date2idx, idx2date, maxDateIdx } from '../../utils/date'

const dx = 40
const dy = 30
const radius = 7

interface TreeNode {
    layer: number
    groups: TreeNode[]
    nodes: string[]
    branch: number
    size: number
}

class Timeline {
    public parent: Timeline | null
    public subTimelines: Timeline[]
    public nodes: string[]
    public collapse: boolean
    public treeNode: TreeNode
    public height: number
    public y: number
    constructor(node: TreeNode, parent: Timeline | null) {
        this.parent = parent
        this.nodes = node.nodes
        this.collapse = false
        this.treeNode = node
        this.height = 1
        this.y = 0
        this.subTimelines = node.groups.map(n => new Timeline(n, this))
    }

    // updateTimeline() {
    //     let y = this.y
    //     this.subTimelines.forEach(t => {
    //         if (t.collapse) { ++y; t.y = y; }
    //         else { t.y = this.y; }
    //         t.updateTimeline()
    //         if (t.collapse) y = t.y + t.height - 1
    //     })
    //     this.height = y - this.y + 1
    // }

    getMainEvents(): INodeEvent[] {
        return _.filter([
            ...this.nodes.map(id => {return {e:GlobalStorage.events[id], p: this}}),
            ..._.flatten(this.subTimelines.filter(t => !t.collapse).map(t => t.getMainEvents()))])
    }

    setCollapse(value: boolean) {
        if (value) {
            let cur: Timeline = this
            while (cur.parent && cur.parent.parent && !cur.parent.collapse) cur = cur.parent
            cur.collapse = true
        }
        else {
            let cur: Timeline = this
            while (cur.parent && !cur.collapse) cur = cur.parent
            const closeTimeline = (t: Timeline) => {
                t.collapse = false
                t.subTimelines.forEach(closeTimeline)
            }
            closeTimeline(cur)
        }
    }

    getAllEvents(): IEvent[] {
        return _.filter([
            ...this.nodes.map(id => GlobalStorage.events[id]),
            ..._.flatten(this.subTimelines.map(t => t.getAllEvents()))
        ])
    }

    getTimelineComponentProps(): ITimelineComponentProps[] {
        let mainTimeline: ITimelineComponentProps[] = [{context: this, nodes: _.map(_.groupBy(this.getMainEvents(), e => e.e.date), (events, date) => {return {events, x: date2idx(date), context: this}}).filter(p => p.x >= 0)}]
        if (mainTimeline[0].nodes.length > 0) mainTimeline[0].nodes.sort((a, b) => {return a.x - b.x})
        else mainTimeline = []
        const subTimelines = this.subTimelines.filter(t => t.collapse).map(t => t.getTimelineComponentProps())
        const allTimelineGroups: ITimelineComponentProps[][] = [mainTimeline, ...subTimelines].filter(ts => ts.length > 0)
        allTimelineGroups.sort((as, bs) => (as[0].nodes[0].x - bs[0].nodes[0].x))
        allTimelineGroups.forEach((tg, idx) => { tg[0].parent = idx === 0 ? undefined : allTimelineGroups[0][0] })
        return [...allTimelineGroups[0], ..._.flatten(allTimelineGroups.slice(1).reverse())]
        // return _.flatten(allTimelineGroups.reverse())
        // console.log('res', result)
        // return result
    }
}

interface INodeEvent {e: IEvent, p: Timeline}
interface INodeProps {events: INodeEvent[], x: number, context: Timeline}
interface ITimelineComponentProps { nodes: INodeProps[], parent?: ITimelineComponentProps, context: Timeline }
interface ITimelineCircleComponentProps { onNodeHover: (hover: boolean, node: INodeProps) => void }
interface ITimelineLineComponentProps { onClickTimeline: () => void }
class TimelineCircleComponent extends React.Component<ITimelineComponentProps & ITimelineCircleComponentProps> {
    render() {
        const nodes = this.props.nodes
        return <g className="node">
            {nodes.map((node, idx) => <circle key={idx} className="node-circle" cx={node.x * dx} cy={node.context.y * dy} r={radius} fill={"blue"}
                onMouseEnter={() => this.props.onNodeHover(true, node)} onMouseLeave={() => this.props.onNodeHover(false, node)}/>)}
        </g>
    }
}
class TimelineLineComponent extends React.Component<ITimelineComponentProps & ITimelineLineComponentProps> {
    render() {
        const nodes = this.props.nodes
        return <g className="node-line" onClick={this.props.onClickTimeline}>
            {nodes.length >= 2 && <line x1={nodes[0].x * dx} x2={nodes[nodes.length-1].x * dx} y1={this.props.context.y * dy} y2={this.props.context.y * dy}/>}
            {nodes.length > 0 && this.props.parent &&
                <path d={`M ${nodes[0].x * dx},${this.props.context.y * dy} l ${-dx/2},0 l ${0},${(this.props.parent.context.y-this.props.context.y) * dy}`}/>}
            {nodes.length > 0 && this.props.parent &&
                <circle cx={(nodes[0].x - .5) * dx} cy={this.props.parent.context.y * dy} r={radius/3}/>}
            {nodes.length > 0 && this.props.parent && (this.props.parent.nodes[this.props.parent.nodes.length-1].x < nodes[0].x - .5) &&
                <line x1={this.props.parent.nodes[this.props.parent.nodes.length-1].x * dx} x2={(nodes[0].x - .5) * dx} y1={this.props.parent.context.y * dy} y2={this.props.parent.context.y * dy}/>}
        </g>
    }
}

interface IProps {}
interface IState {
    root?: Timeline
    eventsLoaded: boolean
    hoverNode?: INodeProps
}

export default class EventTree extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            root: undefined,
            eventsLoaded: false
        }
    }

    componentWillMount() {
        requestEventsTree().then(tree => {
            this.setState({root: new Timeline(tree as TreeNode, null)})
        }).catch(err => console.error('load event tree failed', err))
        const checkLoaded = () => {
            if (this.state.eventsLoaded) return
            if (Object.keys(GlobalStorage.events).length > 0 && !!this.state.root) this.setState({eventsLoaded: true})
            else setTimeout(() => checkLoaded(), 500)
        }
        checkLoaded()
    }

    private hoverNodeCircle?: INodeProps
    private hoverNodeEventBox?: boolean

    openNodeEventBox = (node: INodeProps) => { if (node !== this.state.hoverNode) this.setState({hoverNode: node}) }
    closeNodeEventBox = _.debounce(() => { if (!this.hoverNodeEventBox && !this.hoverNodeCircle && this.state.hoverNode) this.setState({hoverNode: undefined}) })

    onNodeHover = (hover: boolean, node: INodeProps) => {
        this.hoverNodeCircle = hover ? node : undefined
        if (this.hoverNodeCircle) this.openNodeEventBox(this.hoverNodeCircle)
        else this.closeNodeEventBox()
    }
    onNodeEventBoxHover = (hover: boolean) => {
        this.hoverNodeEventBox = hover
        if (!this.hoverNodeEventBox) this.closeNodeEventBox()
    }

    private svgContainerDivEl: HTMLDivElement | null = null

    render() {
        if (!this.state.eventsLoaded || !this.state.root) return <div className="event-tree"/>
        const timelineProps = this.state.root.getTimelineComponentProps()
        timelineProps.forEach((ts, idx) => { ts.context.y = idx })
        console.log('rerender', timelineProps)
        const svgWidth = (maxDateIdx + 2) * dx
        const svgHeight = (timelineProps.length + 2) * dy
        const svgOffsetX = -dx + (this.svgContainerDivEl?.scrollLeft || 0)
        const svgOffsetY = -dy + (this.svgContainerDivEl?.scrollTop || 0)
        return <div className="event-tree" style={{height: svgHeight}}>
            <div className="svg-container" ref={e => { this.svgContainerDivEl = e }}>
                {_.range(0, maxDateIdx+1).map(i => <div className="name-bg" style={{width: (i === 0 || i === maxDateIdx) ? dx * 1.5 : dx, left: i === 0 ? 0 : (i + 0.5) * dx, background: i % 2 === 0 ? '#dddddda0' : '#aaaaaaa0', height: svgHeight}}>
                    <span style={{top: svgOffsetY + dy}}>{idx2date(i).slice(5)}</span>
                </div>)}
                <svg viewBox={`${-dx} ${-dy} ${svgWidth} ${svgHeight}`} width={svgWidth} height={svgHeight}>
                    {timelineProps.map((prop, idx) => <TimelineLineComponent key={idx} {...prop} onClickTimeline={() => {
                        prop.context.setCollapse(false)
                        this.forceUpdate()
                    }} />)}
                    {timelineProps.map((prop, idx) => <TimelineCircleComponent key={idx} {...prop} onNodeHover={(hover, node) => this.onNodeHover(hover, node)} />)}
                </svg>
            </div>
            {this.state.hoverNode && <div className="node-event-box"
                style={{left: - svgOffsetX + this.state.hoverNode.x * dx,
                        top: - svgOffsetY + this.state.hoverNode.context.y * dy}}
                onMouseEnter={() => this.onNodeEventBoxHover(true)} onMouseLeave={() => this.onNodeEventBoxHover(false)}>
                <div className="node-content">
                {this.state.hoverNode.events.map((nodeEvent, idx) => <div className="node-item" key={idx}
                    style={{background: nodeEvent.p === this.state.hoverNode!.context ? 'white' : 'darkgrey'}}
                    onClick={() => {
                        nodeEvent.p.setCollapse(!nodeEvent.p.collapse)
                        // this.state.root?.updateTimeline()
                        this.setState({hoverNode: undefined})
                    }}>
                        {idx+1}. {nodeEvent.e.title}
                    </div>)}
                </div>
                <div className="node-event-box-bottom-padding"/>
                <div className="node-event-box-arrow"/>
            </div>}
        </div>
    }
}

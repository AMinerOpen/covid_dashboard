import * as React from 'react';
import './river.scss';
import * as d3 from 'd3';
import { requestRiver } from '../../utils/requests';
import { str2Date } from '../../global';
import dateFormat from 'dateformat';

interface IProps {
  start: Date;
  end: Date;
  dayWidth: number;
  onLineClick: (list: string[]) => void;
}

interface IState {
  stack: d3.Stack<any, any, any> | null;
}

export default class River extends React.Component<IProps, IState> {
  private _container: HTMLDivElement | null = null;
  private _layer_total: number = 20;
  private _ms1Day: number = 24*60*60*1000;
  private _datas: any[] = [];
  private _dates: string[] = [];
  private _riverData: d3.Series<{[key: number]: number;}, any>[] = [];

  private _svg: d3.Selection<d3.BaseType, unknown, HTMLElement, null> | null = null;
  private _area: d3.Area<any> | null = null;
  private _x: d3.ScaleLinear<number, number> | null = null;
  private _y: d3.ScaleLinear<number, number> | null = null;

  constructor(props: IProps) {
    super(props);
    this.state = {
      stack: null
    }
    let date: Date = props.start;
    while(date <= props.end) {
      this._dates.push(dateFormat(date, 'yyyy-mm-dd'));
      date = new Date(date.getTime() + this._ms1Day);
    }
    this.handleClickLine = this.handleClickLine.bind(this);
  }

  componentDidMount() {
    if(this._container) {
      this.requestRiver();
    }
  }

  private flatten(items: any[], timelines: any[]) {
    items.forEach((item: any) => {
      if(item.type == 'multi-timelines') {
        this.flatten(item.items, timelines);
      }else if(item.type == 'timeline') {
        timelines.push(item)
      }
    })
  }

  private requestRiver() {
    requestRiver("sm").then(data => {
      console.log(data);
      if(data && data.length) {
        let timelines: any[] = [];
        this.flatten(data, timelines);
        timelines.sort((a:any, b: any) => b.influence - a.influence);
        timelines = timelines.slice(0, this._layer_total);
        this._datas = [];
        timelines.forEach((d: any) => {
          let line: any[] = this._dates.map(dd => {return {date: dd, value: 0, ids: []}});
          d.items.forEach((value:any) => {
            let arr: string[] = value.split(" ");
            let date: Date = str2Date(arr[0]);
            if(date <= this.props.end && date >= this.props.start) {
              let id: string = arr[arr.length-1];
              let dateStr: string = dateFormat(date, 'yyyy-mm-dd');
              let item: any = line.find(dd => dd.date == dateStr);
              if(item) {
                item.value += 1;
                item.ids.push(id);
              }
            }
          })
          this._datas.push({
            values: line.map(d => d.value),
            ids: line.reduce((pre, cur) => pre = pre.concat(cur.ids), []),
          });
        })
        console.log(this._datas);
        this.draw();
      }
    })
  }

  private draw() {
    if(this._container) {
      let datas: any[] = this._datas.map(d => d.values);
      let smoothed: any[] = datas.map(d => this.smooth(d));
      let stack: d3.Stack<any, {[key: number]: number}, any> = d3.stack().keys(Array.from({length: this._layer_total}, (_, i) => i.toString())).offset(d3.stackOffsetWiggle);
      this._riverData = stack(d3.transpose(smoothed));
      this._svg = d3.select('#river_svg');
      this._x = d3.scaleLinear().domain([0, this._dates.length-1]).range([0, (this._dates.length * this.props.dayWidth)]);
      this._y = d3.scaleLinear().domain([d3.min(this._riverData, this.stackMin)!, d3.max(this._riverData, this.stackMax)!]).range([this._container.offsetHeight, 0]);
      let z = d3.interpolateBlues;
      this._area = d3.area()
        .x((_, i) => this._x!(i))
        .y0(d => this._y!(d[0]))
        .y1(d => this._y!(d[1]));
      this._svg.selectAll("path")
        .data(this._riverData)
        .enter().append('path')
        .attr('d', this._area)
        .attr('fill', (_, i) => z(0.4 + i%3*0.15))
        .on('mouseover', function(d, i) {
          d3.select(this)
            .style('filter', 'url(#drop-shadow)')
            .raise()
        })
        .on('mouseout', function(d, i) {
          d3.select(this)
            .style('filter', 'none')
        })
        .on('click', (_, i) => {
          this.handleClickLine(i);
        })
        .style('cursor', 'pointer')

        var defs = this._svg.append("defs");
        var filter = defs.append("filter")
            .attr("id", "drop-shadow")
            .attr("height", "130%");
        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 3)
            .attr("result", "blur");
        filter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 1)
            .attr("dy", 1)
            .attr("result", "offsetBlur");
        var feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur")
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");
    }
  }

  private handleClickLine(index: number) {
    if(this._datas && index < this._datas.length) {
      let data: any = this._datas[index];
      this.props.onLineClick && this.props.onLineClick(data.ids);
    }
  }

  private smooth(values: number[]) {
    let smoothed: number[] = [];
    values.forEach((value, i) => {
      let curr:number = value;
      let prev:number = i ? smoothed[i - 1] : 0;
      let next:number = i == values.length-1 ? values[values.length-1] : values[i+1];
      let improved = this.average([prev, curr, next]);
      smoothed.push(improved);
    });
    return smoothed;
  }

  private average(data: number[]) {
    let sum: number = data.reduce(function(sum, value) {
        return sum + value;
    }, 0);
    let avg: number = sum / data.length;
    return avg;
}

  private stackMin(layer: any[]): number {
    return d3.min(layer, d => d[0]);
  }

  private stackMax(layer: any[]): number {
    return d3.max(layer, d => d[1]);
  }

  render() {
    return (
      <div className='river' ref={r => this._container = r} style={{width: `${(this._dates.length * this.props.dayWidth)}px`}}>
        <svg className='river_svg' id='river_svg' width={`${(this._dates.length * this.props.dayWidth)}px`}/>
      </div>
    )
  }
}
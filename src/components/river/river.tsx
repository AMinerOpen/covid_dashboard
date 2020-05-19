import * as React from 'react';
import './river.scss';
import * as d3 from 'd3';

interface IProps {

}

interface IState {
  width: number;
  height: number;
  stack: d3.Stack<any, any, any> | null;
}

export default class River extends React.Component<IProps, IState> {
  private _container: HTMLDivElement | null = null;
  private _layer_total: number = 20;
  private _sample_per_layer: number = 200;
  private _bumps_per_layer: number = 10;

  constructor(props: IProps) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      stack: null
    }
  }

  componentDidMount() {
    if(this._container) {
      this.setState({width: this._container.offsetWidth, height: this._container.offsetHeight});

      let stack: d3.Stack<any, {[key: number]: number}, any> = d3.stack().keys(Array.from({length: this._layer_total}, (_, i) => i.toString())).offset(d3.stackOffsetWiggle);
      let data: any[] = d3.transpose(d3.range(this._layer_total).map(_ => this.bumps(this._sample_per_layer, this._bumps_per_layer)));
      let layers0: any[] = stack(data);
      let layers1: any[] = stack(d3.transpose(d3.range(this._layer_total).map(_ => this.bumps(this._sample_per_layer, this._bumps_per_layer))));
      let layers: any[] = layers0.concat(layers1);
      console.log(layers);
      let svg = d3.select('#river_svg');
      let x: d3.ScaleLinear<number, number> = d3.scaleLinear().domain([0, this._sample_per_layer - 1]).range([0, this._container.offsetWidth]);
      let y: d3.ScaleLinear<number, number> = d3.scaleLinear().domain([d3.min(layers, this.stackMin)!, d3.max(layers, this.stackMax)!]).range([this._container.offsetHeight, 0]);
      let z = d3.interpolateCool;
      let area: d3.Area<any> = d3.area()
        .x((_, i) => x(i))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]));
      svg.selectAll("path")
        .data(layers0)
        .enter().append('path')
        .attr('d', area)
        .attr('fill', () => z(Math.random()));

      setInterval(() => {
        let t: any[];
        svg.selectAll('path')
          .data((t = layers1, layers1 = layers0, layers0 = t))
          .transition()
          .duration(1000)
          .attr('d', area);
      }, 2000);
    }
  }

  private stackMin(layer: any[]): number {
    return d3.min(layer, d => d[0]);
  }

  private stackMax(layer: any[]): number {
    return d3.max(layer, d => d[1]);
  }

  private bumps(n:number, m: number) {
    let a: number[] = Array.from({length: n}, d => 0);
    while(--m > -1) {
      this.bump(a, n);
    }
    return a;
  }

  private bump(a: number[], n: number) {
    let x: number = 1 / (0.1 + Math.random());
    let y: number = 2 * Math.random() - 0.5;
    let z: number = 10 / (0.1 + Math.random());
    a.forEach((d, i) => { 
      let w: number = (i / n - y) * z;
      a[i] += x * Math.exp(-w * w);
    })
  }

  render() {
    return (
      <div className='river' ref={r => this._container = r}>
        <svg className='river_svg' id='river_svg' />
      </div>
    )
  }
}
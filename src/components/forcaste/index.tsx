import * as React from "react";
import "./index.scss";
import { FormattedMessage } from "react-intl";
import ReactEcharts from "echarts-for-react";
import { Table, Tooltip } from "antd";
import { ReactComponent as Close_Svg } from "./images/close.svg";
import { ReactComponent as Tip_Svg } from '../main/images/tip.svg';
import ActiveNumber from '../activeNumber/ActiveNumber';
import { risk2color } from '../../utils/color';

//https://innovaapi.aminer.cn/covid/api/v1/pneumonia/prediction
//https://innovaapi.aminer.cn/covid/api/v1/pneumonia/data
interface IState {
  forcastData?: any;
  chartOptions?: any;
  tableData: any[] | null;
  tableColumn: any[] | null;
}

interface IProps {
  lang: string;
  isMobile: boolean;
  transData: any;
  epData: any;
  onClose?: () => void;
}

export default class Forcast extends React.Component<IProps, IState> {
  private _colors = [
    "#438fdd",
    "#00b6cd",
    "#3da883",
    "#e4983e",
    "#ea3bf7",
    "#e75e63",
    "#b5cf47",
    "#bd478b",
    "#1bb1a9",
    "#5b61c3",
    "#1796cb",
    "#4a73b8"
  ];

  constructor(props: IProps) {
    super(props);

    this.state = {
      forcastData: undefined,
      chartOptions: undefined,
      tableData: null,
      tableColumn: null
    };

    this.drawDataBar = this.drawDataBar.bind(this);
    this.getChartOption = this.getChartOption.bind(this);
  }

  private requestForcastData() {
    let url = "https://innovaapi.aminer.cn/covid/api/v1/pneumonia/prediction";
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.code == 0) {
          this.setState({ forcastData: data.data });
        }
      });
  }

  private drawDataBar(id: string, value: number, ratio: number, color: string) {
    return (
      <div className="forcast_data">
        <div className="forcast_data_title">
          <FormattedMessage id={id} />
        </div>
        <div
          className="forcast_data_bar"
          style={{
            backgroundColor: `${color}dd`,
            width: `${ratio * 60}%`,
            // borderLeft: `6px solid ${color}`
          }}
        ></div>
        <div className="forcast_data_num" style={{ color: color }}>
          {value}
        </div>
      </div>
    );
  }

  private realData(): JSX.Element {
    const { epData } = this.props;
    let total_confirmed = 0;
    let cured = 0;
    let dead = 0;
    let daily_confirmed = 0;
    let daily_cured = 0;
    let daily_dead = 0;
    if (epData && Object.keys(epData).length) {
      let totalData = epData[""];
      let totalArr = [];
      for (let key in totalData) {
        totalArr.push({
          date: key,
          ...totalData[key]
        });
      }
      totalArr.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      let lastDate = totalArr[totalArr.length - 1];
      total_confirmed = lastDate.confirmed;
      cured = lastDate.cured;
      dead = lastDate.dead;
      daily_confirmed = lastDate.confirmed_delta;
      daily_cured = lastDate.cured_delta;
      daily_dead = lastDate.dead_delta;
    }
    return (
      <div className='realdata'>
        <div className='realdata_datas'>
          <div className='realdata_item'>
            <div className='realdata_title'><FormattedMessage id='forecast.total_confirmed' /></div>
            <div className='realdata_data' style={{color: '#ff565d'}}><ActiveNumber value={total_confirmed} /></div>
            <div className='realdata_daily'><FormattedMessage id='forecast.daily' /> <span style={{color: '#ff565d'}}>{`${daily_confirmed}↑`}</span></div>
          </div>
          <div className='realdata_item'>
            <div className='realdata_title'><FormattedMessage id='forecast.cured' /></div>
            <div className='realdata_data' style={{color: '#4ddb91'}}><ActiveNumber value={cured} /></div>
            <div className='realdata_daily'><FormattedMessage id='forecast.daily' /> <span style={{color: '#4ddb91'}}>{`${daily_cured}↑`}</span></div>
          </div>
          <div className='realdata_item'>
            <div className='realdata_title'><FormattedMessage id='forecast.dead' /></div>
            <div className='realdata_data' style={{color: '#a7abb3'}}><ActiveNumber value={dead} /></div>
            <div className='realdata_daily'><FormattedMessage id='forecast.daily' /> <span style={{color: '#a7abb3'}}>{`${daily_dead}↑`}</span></div>
          </div>
        </div>
        <div className='realdata_bar'>
          <span style={{flex: total_confirmed-cured-dead, backgroundColor: '#ff565d'}} /><span style={{flex: cured, backgroundColor: '#4ddb91'}} /><span style={{flex: dead, backgroundColor: '#a7abb3'}} />
        </div>
      </div>
    )
  }

  private cutDate(datas: any[], start: Date, end: Date) {
    let result: any[] = [];
    datas.forEach(d => {
      let date = new Date(d.date);
      if (date > start && date < end) {
        result.push(d);
      }
    });
    return result;
  }

  private formatDate(date: Date) {
    return `${date.getMonth() + 1}/${("0" + date.getDate()).substr(-2)}`;
  }

  private getChartOption() {
    const { lang } = this.props;
    const { forcastData } = this.state;
    if (forcastData) {
      let option = {};
      let startDate = new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000);
      let endDate = new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000);
      let datas = [
        {
          name_en: "USA",
          name_zh: "美国",
          data: this.cutDate(forcastData['world']['United States of America'], startDate, endDate)
        },
        {
          name_en: "Italy",
          name_zh: "意大利",
          data: this.cutDate(forcastData["world"]["Italy"], startDate, endDate)
        },
        {
          name_en: "Brazil",
          name_zh: "巴西",
          data: this.cutDate(
            forcastData["world"]["Brazil"],
            startDate,
            endDate
          )
        },
        {
          name_en: "India",
          name_zh: "印度",
          data: this.cutDate(forcastData["world"]["India"], startDate, endDate)
        },
        {
          name_en: "Russian",
          name_zh: "俄罗斯",
          data: this.cutDate(
            forcastData["world"]["Russian Federation"],
            startDate,
            endDate
          )
        },
        {
          name_en: "Iran",
          name_zh: "伊朗",
          data: this.cutDate(forcastData["world"]["Iran"], startDate, endDate)
        },
        {
          name_en: "UK",
          name_zh: "英国",
          data: this.cutDate(forcastData["world"]["United Kingdom"], startDate, endDate)
        },
        {
          name_en: "China",
          name_zh: "中国",
          data: this.cutDate(forcastData["overall"], startDate, endDate)
        }
      ];
      // console.log(datas);
      datas.forEach(country => {
        country.data.reduce((p, d) => {
          if (d.real) {
            d.f = d.real;
            d.f1 = "-";
          } else {
            if (p && p.real) {
              p.f1 = p.real;
            }
            d.f = "-";
            d.f1 = d.forcast;
          }

          return d;
        }, null);
      });
      let series: any[] = [];
      let legend: any[] = [];
      datas.forEach((d, i) => {
        let name: string = lang == "zh" ? d.name_zh : d.name_en;
        series.push(
          {
            name,
            type: "line",
            smooth: true,
            data: d.data.map(e => e.f),
            itemStyle: {
              normal: {
                color: this._colors[i],
                borderColor: this._colors[i],
                lineStyle: {
                  width: 3
                }
              }
            }
          },
          {
            name,
            type: "line",
            smooth: true,
            data: d.data.map(e => e.f1),
            itemStyle: {
              normal: {
                color: this._colors[i],
                borderColor: this._colors[i],
                lineStyle: {
                  width: 3,
                  type: "dotted"
                }
              }
            },
            markLine: {
              silent: true,
              symbol: ['none', 'none'],
              lineStyle: {
                normal: {
                  color: '#888888',
                },
              },
              label: {
                normal: {
                  show: false
                }
              },
              data: i == 0 ? [
                {
                  xAxis: this.formatDate(new Date()),
                },
              ] : undefined,
            }
          }
        );
        legend.push(name);
      });
      option = {
        grid: {
          left: "8%",
          right: "4%",
          top: '16%',
          bottom: "12%"
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: datas[0].data.map(d => {
            return this.formatDate(new Date(d.date));
          }),
          axisLabel: {
            rotate: 40
          }
        },
        yAxis: [
          {
            type: "value",
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            }
          }
        ],
        legend: {
          data: legend
        },
        series,
        tooltip: {
          trigger: "axis",
          formatter: function(params: any, ticket: any, callback: any) {
            var htmlStr = "";
            var valMap: any = {};
            for (var i = 0; i < params.length; i++) {
              var param = params[i];
              var xName = param.name; //x轴的名称
              var seriesName = param.seriesName; //图例名称
              var value = param.value; //y轴值
              var color = param.color; //图例颜色
              //过滤无效值
              if (value == "-") continue;
              if (valMap[seriesName] == value) continue;
              if (i === 0) {
                htmlStr += xName + "<br/>";
              }
              htmlStr += '<div style="width: 140px; padding: 0 4px;">';
              htmlStr +=
                '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
                color +
                ';"></span>';
              htmlStr += seriesName;
              htmlStr += '<span style="float: right">' + value + "</span>";
              htmlStr += "</div>";
              valMap[seriesName] = value;
            }
            return htmlStr;
          }
        }
      };
      return option;
    }
    return undefined;
  }

  private calcTable() {
    const { lang, transData, epData } = this.props;
    if (transData && epData && !!Object.keys(epData).length) {
      let column: any[] = [
        {
          title: lang == 'zh' ? "地区" : "Area",
          dataIndex: "area",
          key: "area",
          className: "forcast_table_column",
          render: (text: string) => (
            <span style={{ fontWeight: "bold", color: "lightgrey", textAlign: 'left' }}>{text}</span>
          )
        },
        {
          title: lang == 'zh' ? "风险指数" : "RI",
          dataIndex: "risk",
          key: "risk",
          width: "22%",
          className: "forcast_table_column",
          render: (text: string) => (
            <span style={{ fontWeight: "bold", color: risk2color(Number(text)) }}>{text}</span>
          )
        },
        {
          title: lang == 'zh' ? "累计确诊" : "Confirmed",
          dataIndex: "confirmed",
          key: "confirmed",
          width: "26%",
          className: "forcast_table_column",
          render: (text: string) => (
            <span style={{ fontWeight: "bold", color: "#ff5561" }}>{text}</span>
          )
        },
        {
          title: lang == 'zh' ? "死亡" : "Dead",
          dataIndex: "dead",
          key: "dead",
          width: "22%",
          className: "forcast_table_column",
          render: (text: string) => (
            <span
              style={{ fontWeight: "bold", color: "#d9692d" }}
            >{`+${text}`}</span>
          )
        }
      ];
      let worldArr: any[] = [];
      let data: any[] = [];
      for (let d in epData) {
        if (d) {
          let dataArr: any[] = [];
          for (let a in epData[d]) {
            dataArr.push({
              date: a,
              data: epData[d][a]
            });
          }
          dataArr.sort((a: any, b: any) => a.date < b.date ? 1 : -1)
          let area: string = (lang === 'en' || !transData[d]) ? d : transData[d][lang]
          if (area == "United States of America") area = "United States";
          worldArr.push({
            area: area,
            data: dataArr
          });
        }
      }
      worldArr.sort((a: any, b: any): number => {
        return (
          (b.data[0].data.risk || 0) -
          (a.data[0].data.risk || 0)
        );
      });
      for (let i: number = 0; i < 50; ++i) {
        let d: any = worldArr[i];
        data.push({
          key: d.area,
          area: d.area,
          incr: d.data[0].data.confirmed_delta || 0,
          confirmed: d.data[0].data.confirmed || 0,
          dead: d.data[0].data.dead || 0,
          risk: d.data[0].data.risk || 0
        });
      }
      this.setState({tableColumn: column, tableData: data});
    }
  }

  public componentDidMount() {
    this.requestForcastData();
  }

  public componentDidUpdate(preProps: IProps) {
    if (preProps.lang != this.props.lang || (!this.state.chartOptions && this.state.forcastData)) {
      this.setState({ chartOptions: this.getChartOption() });
    }
    if (!this.state.tableColumn || !this.state.tableData || preProps.lang != this.props.lang || preProps.epData != this.props.epData) {
      this.calcTable();
    }
  }

  public render() {
    const { chartOptions, tableData, tableColumn } = this.state;
    const { epData, onClose, lang, isMobile } = this.props;
    return (
      <div className="forcast">
        <div className="forcast_inner">
          <div className="forcast_title">
            <FormattedMessage id="forecast.title" />
            <Tooltip title={lang == 'zh' ? "疫情严重国家确诊数据预测" : "Forecast of confirmed data in severely affected countries"}>
              <span className='tip'><Tip_Svg /></span>
            </Tooltip>
          </div>
          <div className="forcast_forcast">
            {chartOptions && (
              <ReactEcharts option={chartOptions} lazyUpdate={true} style={{height: '260px'}}/>
            )}
          </div>
          <div className="forcast_title">
            <FormattedMessage id="forecast.realtime" />
            <Tooltip title={lang == 'zh' ? "世界及地区疫情数据实时更新" : "Real-time updates of world and regional epidemic data"}>
              <span className='tip'><Tip_Svg /></span>
            </Tooltip>
          </div>
          { this.realData() }
          {isMobile && (
            <div className="forcast_close" onClick={() => onClose && onClose()}>
              <Close_Svg />
            </div>
          )}
          {
            tableData && tableColumn && (
              <div className="forcast_table">{epData && (
                <Table
                  className="forcast_table_table"
                  columns={tableColumn}
                  dataSource={tableData}
                  pagination={false}
                  size="small"
                />
              )}</div>
            )
          }
        </div>
      </div>
    );
  }
}


import * as React from 'react';
import './algorithmPage.scss';
import { Header } from 'covid-header';

interface IProps {
  lang: 'zh' | 'en';
  onSwitchLang: () => void;
}

interface IState {

}

export default class AlgorithmPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div className='algorithm'>
        <Header lang={this.props.lang} onSwitchLang={this.props.onSwitchLang} />
        {
          this.props.lang == 'zh' ? (
            <div className='al_inner'>
              <h1>新冠肺炎病毒区域性风险指标 (Tsinghua COVID-19 Index)</h1>
              <h2>定义</h2>
              <h3>给定一个疫情数据集，记作 D，那么某区域在 t 时刻的风险指数由一个评估模型 f : D × t → R 的输出所定义。若某一区域的疫情数据为 X ∈ D ，则 f(X, t) 描述了基于 X 所评估得出的该地区在 t 时刻的疫情风险， f(X, t) 越大，疫情就越严重。 </h3>
              <h2>评估方法</h2>
              <h3>我们将一个地区的先验知识与疫情爆发后的后验数据相结合来对一个地区的疫情风险指数进行综合评估。 具体而言，假定在某地区观测到的疫情数据为 X, 我们令 RI(t) = f(X,t) 并且按如下公式计算 RI(t) ：</h3>
              <img src={require('./images/al1.png')} />
              <h3>这里 RI<sub>prior</sub> 是一个疫情爆发前与该地区相关的先验指标，如该地区的卫生状况、医疗设施状况等等，例如全球卫生安全指标（<a href='https://www.ghsindex.org/' target="_blank">GHSIndex</a>）等，而 RI<sub>posterior</sub>(t) 是在 t 时刻基于疫情中的时序数据评估出的地区风险指数。</h3>
              <h3>为了计算出 RI<sub>posterior</sub>(t), 我们需要综合考虑多个维度的疫情数据（如实时的感染人数，死亡人数，上升趋势等等）。利用一个 n 维向量来表示时刻 t 时该地区的多维疫情数据，记作 v(t) ∈ R<sup>n</sup>， v 的每一个维度都是是一个从某一方面描绘了疫情危机程度的参数，例如死亡率与增速等。假定 RI<sub>posterior</sub>(t) 与 v(t) 满足如下关系:</h3>
              <img src={require('./images/al2.png')} />
              <h3>其中 w ∈ R<sup>n</sup> 是一个权重向量，用以平衡 v(t) 中各个维度对风险指数的贡献, 并令 σ(⋅)=max(0,⋅) ，以确保后验风险指数在 [0,1] 区间内。因此有:</h3>
              <img src={require('./images/al3.png')} />
              <h3>为了显示地计算出 v(t) ，我们需要构建一个可靠而高效的流行病传播模型。 在此我们将SEIR模型简化以方便计算一些参数。</h3>
              <h3>令 N(t) 表示 t 时刻的感染人数，我们用一个常微分方程来表示 N(t)：</h3>
              <img src={require('./images/al4.png')} />
              <h3>这里 γ(t) 随时间而变化的系数，囊括了增长率，控制强度，基本再生数等信息。我们对 γ(t) 取一阶近似:</h3>
              <img src={require('./images/al5.png')} />
              <h3>之后解出此微分方程得到：</h3>
              <img src={require('./images/al6.png')} />
              <h3>参数 a 和 b 和利用 X 进行估计， 拐点 t<sup>*</sup> 就可以被表示为:</h3>
              <img src={require('./images/al7.png')} />
              <h3>注意到， a 实际上描述了感染率的加速度，原有的 SEIR 模型很难直接估计出这个参数。</h3>
              <h3>将 t 时刻的死亡率记作 D(t) ，再将区域总人口数记为 P。在这里，我们将向量 v 的维度选为4：</h3>
              <img src={require('./images/al8.png')} />
              <h3>前两个维度融合了主要的时序信息，即评估出的拐点和增长系数，后两个维度融合了几个重要的统计数字， 即死亡率和感染率等。</h3>
              <h2>数据来源</h2>
              <h3>在这里，我们使用了世界卫生安全指数 （GHSIndex），用以各地区 RI<sub>prior</sub> 的计算（公开获取于：<a href='https://www.ghsindex.org/' target="_blank">https://www.ghsindex.org/</a>）还使用了Aminer所收集的细粒度的疫情数据（<a href='https://aminer.cn/data-covid19/?lang=zh' target="_blank">https://aminer.cn/data-covid19/</a>） 作为评估模型的输入。</h3>
            </div>
          ) : (
            <div className='al_inner'>
              <h1>COVID-19 Risk Index (Tsinghua COVID-19 Index)</h1>
              <h2>Definition</h2>
              <h3>Suppose the given set of pandemic data is D, the risk index at time t is defined by the output of an evaluation model f:D×t→R. For the pandemic data X∈D of one specific region, f(X,t) describes the risk of that region evaluated by X at time t. The greater f(X,t) is, the severer pandemic situation is in that region. </h3>
              <h2>Evaluation Method</h2>
              <h3>In this work, we propose to evaluate the risk index as a combination of prior and posterior knowledge of a certain region. Specifically, suppose the data is observed as X, we denote RI(t)=f(X,t) and calculate RI(t) as follows:</h3>
              <img src={require('./images/al1.png')} />
              <h3>where RI<sub>prior</sub> is some index previously computed before the pandemic based on the evaluation of the assessment of the health status in a certain region, e.g. <a href="https://www.ghsindex.org/" target="_blank">Global Health Security Index (GHSIndex)</a>, and RI<sub>posterior</sub> (t) is the risk index evaluated at time t based on time series data of the pandemic.</h3>
              <h3>To calculate RI<sub>posterior</sub> (t), we consider to integrate several important factors related to the epidemic situation at time t into a vector with dimension n, denoted by v(t)∈R<sup>n</sup>. Each dimension of v is a parameter that indicates one specific aspect of the pandemic, e.g. death rate or growing trend. Then we assume the risk odd at time t to be a linear combination of each dimension in v(t) as:</h3>
              <img src={require('./images/al2.png')} />
              <h3>where w∈R<sup>n</sup> is a weight vector chosen based on the scale and priority of each dimension in v(t), and σ(⋅)=max(0,⋅). Then naturally:</h3>
              <img src={require('./images/al3.png')} />
              <h3>To calculate v(t) explicitly, a reliable and efficient pandemic model is necessary to help calculate parameters that indicates the severity of the pandemic. Here we simplify the SEIR model to make the estimation of some critical factors easier. </h3>
              <h3>Let N(t) denote the active cases at time t. Here we describe the growth rate of the active cases using an ordinary differential equation: </h3>
              <img src={require('./images/al4.png')} />
              <h3>where γ(t) is a time-dependent coefficient aggregating the information such as susceptible rate, reproduction number etc. We take the first order approximation and assume γ(t) to be a linear function of t:</h3>
              <img src={require('./images/al5.png')} />
              <h3>Now we can easilt solve the differential equation to a close formula:</h3>
              <img src={require('./images/al6.png')} />
              <h3>The parameters of a and b can be estimated by fitting the model on the given data X. The turning points t<sup>*</sup> is thus can be computed by:</h3>
              <img src={require('./images/al7.png')} />
              <h3>Notice that a actually describes the acceleration of the infection rate, which is hard to be estimated by original SEIR model.</h3>
              <h3>Let the death rate by time t be D(t) and the total population of the target region be P. In this work, we construct the vector v as a four-dimensional vector:</h3>
              <img src={require('./images/al8.png')} />
              <h3>where the first two dimensions incorporate major temporal information, i.e. estimated turning point and estimated growth coefficient, yet the last two dimensions incorporate explicit statistical information, i.e. death rate and infection rate.</h3>
              <h2>Data Source</h2>
              <h3>In this work, we use Global Health Security Index (GHSIndex), which is accessible from the link <a href='https://www.ghsindex.org/' target="_blank">https://www.ghsindex.org/</a>, as RI<sub>prior</sub> of each region, and the fine-grained pandemic data of each country in this world collected by Aminer, accessible at <a href='https://aminer.cn/data-covid19/?lang=en' target="_blank">https://aminer.cn/data-covid19/</a>, as the input of our evaluation model.</h3>
            </div>
          )
        }
        <div className='footer'>
          © 2005-2020 AMiner 京ICP备17059297号-2
        </div>
      </div>
    )
  }
}
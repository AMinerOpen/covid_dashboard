import * as React from 'react';
import './influenceFlag.scss';
import { Tooltip } from 'antd';

interface IProps {
  lang: "zh" | "en";
  influence: number;
}

const InfluenceFlag = (props: IProps) => {
  const influence = Math.max(0, props.influence || 0);

  return (
    <Tooltip title={props.lang == 'zh' ? "风险影响力" : "Risk Influence"}>
      <span className='inf'>
        <i className='fa fa-arrow-up' />{influence.toFixed(2)}
      </span>
    </Tooltip>
  )
}

export default InfluenceFlag;
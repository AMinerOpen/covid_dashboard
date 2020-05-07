import React from 'react';
import './entityFlag.scss';

interface IProps {
  source: string;
}

const EntityFlag = (props: IProps) => {
  const source = props.source || "xlink";
  return (
    <span className={`entityflag ${source}`}>
      {source.toUpperCase()}
    </span>
  )
}

export default EntityFlag;
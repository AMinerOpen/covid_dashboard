import * as React from 'react';
import "./contributors.scss";
import { Header } from 'covid-header';
import { FormattedMessage } from 'react-intl';

interface IProps {
  lang: 'zh' | 'en';
  onSwitchLang: () => void;
}

interface IState {
  data: any[];
}

export default class Contributors extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    this.requestData();
  }

  private requestData() {
    let url: string = 'https://originalstatic.aminer.cn/misc/ncov/homepage/contributors.json';
    fetch(url).then(response => response.json()).then(data => {
        if(data && data.length) {
            this.setState({data})
        }
    })
  }


  render() {
    const { lang, onSwitchLang } = this.props;
    const { data } = this.state;
    return (
      <div className='contributors'>
        <Header lang={lang} onSwitchLang={onSwitchLang} tab="contributors" />
        <div className='content'>
          <div className='title'><FormattedMessage id='contributors.title' /></div>
          <span className='subtitle'><FormattedMessage id='contributors.subtitle' /></span>
          <div className='list'>
            { data.map((org:any, index: number) => {
              return (
                <div className='org' key={index}>
                  <div className='org_name'>{lang == 'zh' ? org.name_zh : org.name_en }</div>
                  <div className='members'>
                    {org.members.map((member: any, i: number) => {
                      return (
                        <div className='member' key={i}>
                          <div className='member_avatar'>
                            <img src={member.avatar || "https://originalstatic.aminer.cn/misc/ncov/homepage/avatars/default.jpg"} />
                          </div>
                          <div className='member_name'>{lang=='zh' ? member.name_zh : member.name_en}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}
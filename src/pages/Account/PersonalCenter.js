import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { Checkbox, Alert, Icon, Button, Row, Col } from 'antd';
import Login from '@/components/Login';
import moment from 'moment'
import Data from './Data'
import IframeCard from '@/components/IframeCard'
import NoticeCard from '@/components/NoticeCard'
import {onGetImageUrl} from '@/utils/FunctionSet';
import styles from './style.less'

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading, guidePage, homePage }) => ({
  login,
  guidePage,
  homePage,
  submitting: loading.effects['login/login'],
}))
class PersonalCenter extends Component {
  state = {
    type: 'account',
    autoLogin: true,
    url:'', //首页展示的图片
  };

  componentDidMount() {
    const personalHome = localStorage.getItem('personalHome') ? JSON.parse(localStorage.getItem('personalHome')) : '';
    this.props.dispatch({
      type: 'homePage/queryNoticeList',
      payload: {},
    })
    if(personalHome[0]){
      let url = onGetImageUrl(personalHome[0])
        this.setState({
          url
      })
    }
  }

  render() {
    const { login, submitting, homePage } = this.props;
    const { noticeData = [] } = homePage
    const { type, autoLogin,url } = this.state;
    return (
      <div style={{borderRadius: '5px',background:'white',padding:'10px',minHeight:'700px'}}>

        <h1>个人主页</h1>
        {/* <img src={./Stone-airplane.svg} fill="#11111" style={{color:'pink',filter: 'dropShadow(pink 80px 0)'}} alt='error' /> */}
        {/* <svg style={{ color: 'hotpink' }} width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
          <path d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
        </svg> */}
        <div style={{display:localStorage.getItem('personalHome') ? 'block' : 'none'}}>
          <img style={{width:'100%'}} src={url ? url : ''} alt='error'/>
        </div>
      </div>
    )

  }
}

export default PersonalCenter;

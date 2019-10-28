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
        <div style={{display:localStorage.getItem('personalHome') ? 'block' : 'none'}}>
          <img style={{width:'100%'}} src={url ? url : ''} alt='error'/>
        </div>
        {/* <DragDrop />  */}
      </div>
    )
  }
}

export default PersonalCenter;

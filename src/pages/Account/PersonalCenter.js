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
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'homePage/queryNoticeList',
      payload: {},
    })
  }

  render() {
    const { login, submitting, homePage } = this.props;
    const { noticeData = [] } = homePage
    const { type, autoLogin } = this.state;
    console.log(localStorage)
    return (
      <div style={{borderRadius: '5px',background:'white',padding:'10px',minHeight:'700px'}}>

        <h1>个人主页</h1>
        <div style={{}}>
          {/* <h2>欢迎登录-宁波鸿裕工业有限公司供应链系统平台</h2> */}
        </div>

      </div>
    )

  }
}

export default PersonalCenter;

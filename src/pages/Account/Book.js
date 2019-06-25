import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import ImageUpdate from '@/components/Upload/ImageUpdate'
import GuidePage from '@/components/GuidePage'
import Link from 'umi/link';
import { Checkbox, Alert, Icon } from 'antd';
import Login from '@/components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading, guidePage }) => ({
  login,
  guidePage,
  submitting: loading.effects['login/login'],
}))
class PersonalCenter extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };



  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div id='outBox' className={styles.bookPage}>
        <iframe ref={dom => this.iframe = dom} style={{ width: '100%', height: document.body.clientHeight - 120, border: 'none' }} src='https://www.yuque.com/ant-design/course/intro#eea98b9a' />
      </div>
    )

  }
}

export default PersonalCenter;

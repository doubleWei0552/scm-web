import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { Checkbox, Alert, Icon, Button } from 'antd';
import Login from '@/components/Login';
import RotationChart from '@/components/Carousel/Index'
import TreeSelect from '@/components/TreeSelect/Index'
import Cascader from '@/components/Cascader/Index'

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading,guidePage }) => ({
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
    return <div>
        <h1>个人主页</h1>
        {/* <TreeSelect /> */}
        {/*  <Cascader /> */}
        {/* <RotationChart /> */}
      </div>;
  }
}

export default PersonalCenter;

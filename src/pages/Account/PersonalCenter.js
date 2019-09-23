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
      <div>

        <h1>个人主页</h1>
    //    <div className={styles.content}>
          //<Row gutter={16}>
           // <Col span={12} className={styles.item}>
          //    <IframeCard />
            //</Col>
         //  <Col span={12} className={styles.item}>
           //   <NoticeCard />
        //    </Col>
         //   <Col span={12} className={styles.item}>
           //   <IframeCard />
        //    </Col>
        //    <Col span={12} className={styles.item}>
           //   <IframeCard />
         //   </Col>
         //   <Col span={24} className={styles.item}>
           //   <IframeCard />
         //   </Col>
     //     </Row>
      //  </div>


      </div>
    )

  }
}

export default PersonalCenter;

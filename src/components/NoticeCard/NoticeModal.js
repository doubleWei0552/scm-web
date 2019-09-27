import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import { Modal, Form, Input, Button, Col, Row, Spin, message, notification } from 'antd';
import styles from './index.less'

const FormItem = Form.Item;

@connect(({ homePage }) => ({
  homePage,
}))
class NoticeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
    };
  }

  // 初始数据加载
  componentDidMount() {
    const { ID } = this.props;
    this.props.dispatch({
      type: 'homePage/queryNoticeById',
      payload: { ID },
    })
    this.setState({
      visible: true,
    });
  }

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  showModelHandler = e => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };


  render() {
    const { title, homePage } = this.props;
    const { noticeDetail } = homePage
    console.log('noticeDetail', noticeDetail)
    const publisher = _.get(_.find(noticeDetail, data => data.FIELD_NAME === "RELEASE_STAFF"), 'FIELD_VALUE');
    const noticeTitle = _.get(_.find(noticeDetail, data => data.FIELD_NAME === "TITLE"), 'FIELD_VALUE');
    const publishDate = _.get(_.find(noticeDetail, data => data.FIELD_NAME === "RELEASE_DATE"), 'FIELD_VALUE');
    const receiverData = _.get(_.find(noticeDetail, data => data.FIELD_NAME === "RANGE"), 'FIELD_VALUE');
    const receiverOption = _.get(_.find(noticeDetail, data => data.FIELD_NAME === "RANGE"), 'options');
    const notice = _.get(_.find(noticeDetail, data => data.FIELD_NAME === "NOTICE"), 'FIELD_VALUE');
    const receiver = _.get(_.find(receiverOption, data => data.value === receiverData), 'text');
    return (
      <span>
        <Modal
          title={title}
          destroyOnClose
          visible={this.state.visible}
          onOk={this.handleSubmit}
          onCancel={this.hideModelHandler}
          width={800}
          style={{}}
          wrapClassName="noticeModalContainer"
          footer={null}
        >
          <div>
            <header>
              <h2>{noticeTitle}</h2>
              <div className="auther">
                <span>发布人员：<b>{publisher}</b></span>
                <span>发布时间：<span>{moment(publishDate).format('YYYY-MM-DD HH:mm')}</span></span>
                <span>接收人员：<b>{receiver}</b></span>
              </div>
            </header>
            <div dangerouslySetInnerHTML={{ __html: notice }} />

          </div>
        </Modal>
      </span>
    );
  }
}

export default NoticeModal;

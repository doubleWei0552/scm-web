import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import { Modal, Form, Input, Button, Col, Row, Spin, message, notification } from 'antd';
import styles from './index.less'

const FormItem = Form.Item;

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
    const { title, } = this.props;
    const { loading } = this.state;
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
              <h2>优秀的产品介绍</h2>
              <div className="auther">
                <span>发布人员：<b>赵小刚</b></span>
                <span>发布时间：<span>{moment(_.now()).format('YYYY-MM-DD HH:mm')}</span></span>
                <span>接收人员：<b>全体人员</b></span>
              </div>
            </header>
            <div>
              Pro 如其名。

              突破性的三摄系统，功能超广却简单易用；电池续航实现了空前的飞跃；极具潜能的芯片，不仅机器学习能力翻倍，更为智能手机开启了新的可能。来，认识一下我们首款足以称之为 Pro 的 iPhone。



              来，定睛细看。

              两款尺寸，四种外观，

              采用不锈钢和玻璃设计。



              Pro 级摄像头系统 自我超越，再而三。



              全新三摄系统，将尖端科技和 iPhone 简单易用的标志性风格融为一体。最高达四倍的取景范围，更大场面一镜通收。强大的低光拍摄，在昏暗中照样捕捉精彩。你还能拍出 iPhone 迄今画质最高的视频，而且用照片里各种熟悉的修图工具就能编辑。这种拍摄体验，真的与众不同。



              超广角摄像头

              13 毫米焦距

              ƒ/2.4 光圈

              五镜式镜头

              120° 视角

              四倍取景范围

              1200 万像素感光元件



              广阔大视野。 iPhone 11 Pro 可从长焦摄像头一直到全新的超广角摄像头，进行效果出众的 4 倍光学变焦。
            </div>
          </div>
        </Modal>
      </span>
    );
  }
}

export default NoticeModal;

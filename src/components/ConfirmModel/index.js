import React from 'react'
import { Modal, Button, ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN';

class ComModal extends React.Component {
  staticProps = {
    message: '确定要执行本次操作么？'
  }
  state = {
    visible: true,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.props.handleOk()
    setTimeout(() => {
      this.setState({
        visible: false,
      });
    }, 500);
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
    // this.props.handleCancel()
  };

  render() {
    return (
      <div>
        <ConfigProvider locale={zhCN}>
          <Modal
            closable={false}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            {this.props.message}
          </Modal>
        </ConfigProvider>
      </div>
    );
  }
}

export default ComModal
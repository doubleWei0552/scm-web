import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Modal, Form, Input, Button, Col, Row, Spin, message, notification } from 'antd';

const FormItem = Form.Item;

// 个人中心弹窗
@connect(({ login, user, loading }) => ({
  user,
  login,
  loading: loading.models.login,
}))
class UserCenter extends Component {
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

  setSelectValue(name, operatorId) {
    const { setOperatorName } = this.props;
    setOperatorName(name, operatorId);
    this.hideModelHandler();
  }

  handleSubmit = e => {
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { password, rePassword } = values;
        const params = {
          password,
          rePassword,
          userId: localStorage.getItem('loginData'),
        };
        dispatch({
          type: 'user/changePassword',
          payload: params,
          callback: response => {
            if (response.status === 'success') {
              this.setState({
                visible: false,
              });
              notification.success({ message: '密码修改成功！', duration: 2 });
            } else {
              notification.error({ message: response.ErrorMsg, duration: 2 });
            }
          },
        });
      }
    });
  };

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

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('rePassword')) {
      callback('两次密码输入不一致!');
    } else {
      callback();
    }
  };

  render() {
    const { title, form, areaData, type } = this.props;
    const { loading } = this.state;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 12,
      },
    };

    return (
      <span>
        <Modal
          title={title}
          destroyOnClose
          visible={this.state.visible}
          onOk={this.handleSubmit}
          onCancel={this.hideModelHandler}
        >
          <Spin spinning={loading}>
            <Form layout="horizontal">
              <FormItem {...formItemLayout} label="原密码">
                {getFieldDecorator('password', {
                  initialValue: _.get(areaData, 'name'),
                  rules: [
                    {
                      required: true,
                      message: '请输入原密码',
                    },
                  ],
                })(<Input type="password" placeholder="请输入原密码" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="新密码">
                {getFieldDecorator('rePassword', {
                  initialValue: _.get(areaData, 'areaCode'),
                  rules: [
                    {
                      required: true,
                      message: '请输入新密码',
                    },
                    {
                      min: 6,
                      message: '密码长度不少于6位',
                    },
                    {
                      max: 11,
                      message: '密码长度不能超过11位',
                    },
                  ],
                })(<Input type="password" placeholder="请输入新密码" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="确认新密码">
                {getFieldDecorator('confirmPwd', {
                  initialValue: _.get(areaData, 'areaCode'),
                  rules: [
                    {
                      required: true,
                      message: '请再次输入新密码',
                    },
                    {
                      validator: this.compareToFirstPassword,
                    },
                  ],
                })(<Input type="password" placeholder="请再次输入新密码" />)}
              </FormItem>
            </Form>
          </Spin>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(UserCenter);

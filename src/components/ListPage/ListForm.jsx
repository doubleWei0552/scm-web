import React from 'react';
import {
  Breadcrumb,
  Button,
  DatePicker,
  Select,
  Input,
  Row,
  Col,
  Table,
  Modal,
  Tooltip,
  Form,
  Icon,
  InputNumber,
  Card,
  Popconfirm,
  message,
} from 'antd';
import moment from 'moment';
import _ from 'lodash'
import { string } from 'prop-types';

const { TextArea } = Input;
//子表新增没有mask的数据时的form表单
@Form.create()
export default class ListForm extends React.Component {
  componentDidMount() {
    this.props.onRef(this);
  }
  //子表的弹框对象没有mask数据时form表单点击事件
  handleSubmit = e => {
    e.preventDefault();
    let Data;
    let DISPLAY_NAME;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        for (let i in values) {
          if (values[i] && typeof values[i] == 'string') {
            values[i + 'DISPLAY_NAME'] = values[i].includes('--')
              ? values[i].split('--')[0]
              : values[i];
            values[i] = values[i].includes('--') ? values[i].split('--')[1] : values[i];
          }
        }
        Data = values;
        if (this.props.ChildData.length == 0) {
          //新增的情况
          let addData = [];
          for (let i in Data) {
            let current = {};
            this.props.columns.map(item => {
              if ((i == item.dataIndex && item.type == 'Select') || item.type == 'Reference') {
                current.options = item.options;
              }
            });
            current.FIELD_NAME = i;
            current.FIELD_VALUE = Data[i];
            current.DISPLAY_NAME = Data[i + 'DISPLAY_NAME'];
            current.OBJECT_TYPE = this.props.value.Data.objectType;
            current.id = null;
            current.key = i + Data[i] + this.props.value.Data.objectType + moment().valueOf();
            addData.push(current);
          }
          let ChildData = [];
          this.props.detailColumns.child.map(n => {
            let cacheData = {};
            let cacheChildData = {};
            cacheData.Columns = n;
            cacheChildData.objectType = n.objectType;
            cacheChildData.records = [];
            if (n.objectType == this.props.value.Data.objectType) {
              cacheChildData.records.push(addData);
            }
            cacheData.Data = cacheChildData;
            ChildData.push(cacheData);
          });
          this.props.dispatch({ type: 'detailPage/save', payload: { ChildData } });
        } else {
          // 编辑情况
          let addData = [];
          for (let i in Data) {
            //再加判断是不是select类型，添加options属性
            let current = {};
            this.props.columns.map(item => {
              if ((i == item.dataIndex && item.type == 'Select') || item.type == 'Reference') {
                current.options = item.options;
              }
            });
            current.FIELD_NAME = i;
            current.DISPLAY_NAME = Data[i + 'DISPLAY_NAME'];
            current.FIELD_VALUE = (typeof Data[i] == 'object' && Data[i]) ? moment(Data[i]).valueOf() : Data[i];
            current.OBJECT_TYPE = this.props.value.Data.objectType;
            current.key = i + Data[i] + this.props.value.Data.objectType + moment().valueOf();
            current.id = null;
            addData.push(current);
          }
          this.props.value.Data.records.push(addData);
          this.props.dispatch({ type: 'detailPage/save' }); //刷新model值
        }
        this.props.handleCancel();
      }
    });
  };
  handleResetClick = e => {
    this.props.form.resetFields();
    if (e) {
      this.props.handleCancel();
    }
  };
  childSelectClick = e => {
    let value = {};
    value.text = e.text;
    value.key = this.props.HeaderData.key;
    this.props.dispatch({ type: 'detailPage/getAutocomplate', payload: { value } });
  };
  onSelectSearch = (e, i) => {
    let value = {};
    value.text = i.text;
    value.key = this.props.HeaderData.key;
    this.props.dispatch({
      type: 'detailPage/getAutocomplate',
      payload: { searchData: e, value },
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Row>
          <Form onSubmit={this.handleSubmit}>
            {this.props.columns.map((values, index) => {
              switch (values.type) {
                case 'Text':
                  if (values.readOnlyCondition) return null; // 如果是只读，就不显示
                  return (
                    <Col span={12} key={index + values.text}>
                      <span
                        style={{
                          width: '30%',
                          height: '40px',
                          lineHeight: '40px',
                          display: 'block',
                          float: 'left',
                          textAlign: 'right',
                          paddingRight: '10px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {values.value}
                      </span>
                      <Form.Item style={{ width: '70%', float: 'left' }}>
                        {getFieldDecorator(values.text, {
                          initialValue: values.defaultValue,
                          rules: [
                            {
                              required: values.requiredCondition,
                              message: `这是必填项,请录入${values.value}`,
                            },
                          ],
                        })(<Input placeholder={`请录入${values.value}`} />)}
                      </Form.Item>
                    </Col>
                  );
                  break;
                case 'Date':
                case 'DateTime':
                  if (values.readOnlyCondition) return null; // 如果是只读，就不显示
                  return (
                    <Col span={12} key={index + values.text}>
                      <span
                        style={{
                          width: '30%',
                          height: '40px',
                          lineHeight: '40px',
                          display: 'block',
                          float: 'left',
                          textAlign: 'right',
                          paddingRight: '10px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {values.value}
                      </span>
                      <Form.Item style={{ width: '70%', float: 'left' }}>
                        {getFieldDecorator(values.text, {
                          initialValue: values.defaultValue,
                          rules: [
                            {
                              required: values.requiredCondition,
                              message: `这是必填项,请选择${values.value}`,
                            },
                          ],
                        })(
                          <DatePicker
                            style={{ width: '100%' }}
                            format={values.type == 'Date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  );
                  break;
                case 'Textarea':
                  if (values.readOnlyCondition) return null; // 如果是只读，就不显示
                  return (
                    <Col span={12} key={index + values.text}>
                      <span
                        style={{
                          width: '30%',
                          height: '40px',
                          lineHeight: '40px',
                          display: 'block',
                          float: 'left',
                          textAlign: 'right',
                          paddingRight: '10px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {values.value}
                      </span>
                      <Form.Item style={{ width: '70%', float: 'left' }}>
                        {getFieldDecorator(values.text, {
                          initialValue: values.defaultValue,
                          rules: [
                            {
                              required: values.requiredCondition,
                              message: `这是必填项,请录入${values.value}`,
                            },
                          ],
                        })(<TextArea rows={1} placeholder={`请录入${values.value}`} />)}
                      </Form.Item>
                    </Col>
                  );
                  break;
                case 'Number':
                  if (values.readOnlyCondition) return null;
                  return (
                    <Col span={12} key={index + values.text}>
                      <span
                        style={{
                          width: '30%',
                          height: '40px',
                          lineHeight: '40px',
                          display: 'block',
                          float: 'left',
                          textAlign: 'right',
                          paddingRight: '10px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {values.value}
                      </span>
                      <Form.Item style={{ width: '70%', float: 'left' }}>
                        {getFieldDecorator(values.text, {
                          initialValue: values.defaultValue,
                          rules: [
                            {
                              required: values.requiredCondition,
                              message: `这是必填项,请录入${values.value}`,
                            },
                          ],
                        })(
                          <InputNumber
                            style={{ width: '100%' }}
                            placeholder={`请录入${values.value}`}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  );
                  break;
                case 'Select':
                case 'Reference':
                case 'ObjectType':
                  if (values.readOnlyCondition) return null;
                  if (!this.props.selectOption) return;
                  let optionChild;
                  if (values.type == 'Reference') {
                    optionChild = this.props.selectOption.map((v, s) => {
                      return (
                        <Select.Option value={`${v.text}--${v.value}`} key={v.text + s}>
                          {v.text}
                        </Select.Option>
                      );
                    });
                  } else {
                    optionChild = values.options.map((v, s) => {
                      return (
                        <Select.Option value={v.value} key={v.text + s}>
                          {v.text}
                        </Select.Option>
                      );
                    });
                  }

                  return (
                    <Col span={12} key={index + values.text}>
                      <span
                        style={{
                          width: '30%',
                          height: '40px',
                          lineHeight: '40px',
                          display: 'block',
                          float: 'left',
                          textAlign: 'right',
                          paddingRight: '10px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {values.value}
                      </span>
                      <Form.Item style={{ width: '70%', float: 'left' }}>
                        {getFieldDecorator(values.text, {
                          initialValue: values.defaultValue,
                          rules: [
                            {
                              required: values.requiredCondition,
                              message: `这是必填项,请选择${values.value}`,
                            },
                          ],
                        })(
                          <Select
                            onFocus={() => {
                              if (values.type == 'Reference') {
                                this.childSelectClick(values);
                              }
                            }}
                            showSearch
                            onSearch={e => this.onSelectSearch(e, values)}
                            placeholder={`请选择${values.value}`}
                            onChange={this.handleSelectChange}
                          >
                            {optionChild}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  );
                  break;
              }
            })}
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button type="primary" htmlType="submit" style={{ margin: '0 5px' }}>
                确定
              </Button>
              <Button onClick={e => this.handleResetClick(e)} style={{ margin: '0 5px' }}>
                取消
              </Button>
            </Col>
          </Form>
        </Row>
      </div>
    );
  }
}

import React from 'react'
import { connect } from 'dva';
import { LocaleProvider,Steps, Button, DatePicker, InputNumber, message, Card, Modal, Form, Switch, Row, Col, Input, Select, Number, notification } from 'antd';
import moment from 'moment';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import _ from 'lodash';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';
const { Item } = Form;
const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 17 },
  },
};
let loopData

@Form.create()
@connect(({ guidePage }) => ({
  guidePage,
}))


class FormModular extends React.Component {
  state={

  }

  //深度克隆一个对象
  clone = (obj) => {
    return Object.create(
      Object.getPrototypeOf(obj),
      Object.getOwnPropertyDescriptors(obj)
    )
  }

  onChange = (e, index, jj, DateType) => {
    if (e instanceof moment) {
      e = moment(e).valueOf()
    }
    let formData
    if (!_.isEmpty(this.props.guidePage.cacheFormData)) {
      formData = this.clone(this.props.guidePage.cacheFormData)
    } else {
      // formData = this.clone(this.props.guidePage.guidePageFormData)
      formData = this.clone(loopData)
    }
    if (DateType) {
      if (formData[jj][index].FIELD_VALUE) {
        if (DateType == 'start') {
          formData[jj][index].FIELD_VALUE.start = e
          formData[jj][index].DISPLAY_NAME.start = e
        } else if (DateType == 'end') {
          formData[jj][index].FIELD_VALUE.end = e
          formData[jj][index].DISPLAY_NAME.end = e
        }
      } else {
        if (DateType == 'start') {
          formData[jj][index].FIELD_VALUE = { start: e, end: null }
          formData[jj][index].DISPLAY_NAME = { start: e, end: null }
        } else if (DateType == 'end') {
          formData[jj][index].FIELD_VALUE = { start: null, end: e }
          formData[jj][index].DISPLAY_NAME = { start: null, end: e }
        }
      }
    } else {
      formData[jj][index].FIELD_VALUE = e
      formData[jj][index].DISPLAY_NAME = e
    }
    this.props.dispatch({ type: 'guidePage/save', payload: { cacheFormData: formData } })
  }

  onEditSearch = (value, searchData, selectKey) => {
    console.log(value, searchData, selectKey)
    // this.props.dispatch({
    //   type: 'tableTemplate/getAutocomplate',
    //   payload: { value, searchData, selectKey },
    // });
  };

  disabledStartDate = (e,value) => {
    const endValue = this.state[`${value.FIELD_NAME}-end`];
    if (!e || !endValue) {
      return false;
    }
    return e.valueOf() > endValue.valueOf();
  };

  disabledEndDate = (e,value) => {
    const startValue = this.state[`${value.FIELD_NAME}-start`];
    if (!e || !startValue) {
      return false;
    }
    return e.valueOf() <= startValue.valueOf();
  };

  onDateChange = (field, value) => {
    this.setState({
      [field]: value,
    })
  };

  onStartChange = (e,value) => {
    this.onDateChange(`${value.FIELD_NAME}-start`, e);
  };

  onEndChange = (e,value) => {
    this.onDateChange(`${value.FIELD_NAME}-end`, e);
  };



  render() {
    // console.log('shuju',this.props.guidePage.cacheFormData)
    const { getFieldDecorator } = this.props.form
    let cacheFormData = this.props.cacheFormData
    let cacheData = {}  //缓存数据
    loopData = []  //分组数据
    let form = _.get(this.props.guidePage, 'guidePageFormData.policyFormFields', [])
    form.map(item => {
      if (cacheData[item.PAGE_FIELD_GROUP_NAME]) {
        cacheData[item.PAGE_FIELD_GROUP_NAME].push(item)
      } else {
        cacheData[item.PAGE_FIELD_GROUP_NAME] = [item]
      }
    })
    for (let i in cacheData) {
      loopData.push(cacheData[i])
    }
    return (
      <div>
        <LocaleProvider locale={zhCN}>
        <Form {...formItemLayout}>
          {
            loopData.map((item, jj) => {
              return <div key={jj}>
                <span style={{ paddingTop: '1rem', display: 'inline-block' }}>{item[0].PAGE_FIELD_GROUP_NAME}</span>
                <Card style={{ border: 'none', borderBottom: '1px solid #e8e8e8' }}>
                  {item.map((values, index) => {
                    switch (values.WIDGET_TYPE) {
                      case 'Text':
                        return (
                          <Col key={index} span={10} offset={1} key={values.SEQUENCE + values.NAME}>
                            <Form.Item
                              label={values.LABEL}
                              {...formItemLayout}
                              style={{ width: '100%' }}
                            >
                              {/* {getFieldDecorator(`${values.DISPLAY_NAME}`, {
                                        initialValue: cacheFormData ? cacheFormData[index].DISPLAY_NAME : values.DISPLAY_NAME,
                                        rules: [
                                          {
                                            required: values.REQUIRED_CONDITION,
                                            message: `${values.LABEL}不能为空`,
                                          },
                                        ],
                                      })( */}
                              {/* <div> */}
                              {getFieldDecorator(`${values.FIELD_NAME}`, {
                                initialValue: cacheFormData ? cacheFormData[index].DISPLAY_NAME : values.DISPLAY_NAME,
                                rules: [
                                  {
                                    required: values.REQUIRED_CONDITION,
                                    message: `${values.LABEL}不能为空`,
                                  },
                                ]
                              })(
                                <Input
                                  placeholder={`请录入${values.LABEL}`}
                                  onChange={(e) => this.onChange(e.target.value, index, jj)}
                                // defaultValue={cacheFormData ? cacheFormData[index].DISPLAY_NAME : values.DISPLAY_NAME}
                                />
                              )}

                              {/* </div> */}

                              {/* )} */}
                            </Form.Item>
                          </Col>
                        );
                        break;
                      case 'Select':
                      case 'Reference':
                      case 'ObjectSelector':
                        return (
                          <Col span={10} offset={1} key={values.SEQUENCE + values.NAME}>
                            <Item
                              label={values.LABEL}
                              style={{ width: '100%' }}
                              {...formItemLayout}
                            >
                              {getFieldDecorator(`${values.NAME}`, {
                                initialValue: values.FIELD_VALUE || null,
                                rules: [
                                  {
                                    required: values.REQUIRED_CONDITION,
                                    message: `${values.LABEL}不能为空`,
                                  },
                                ],
                              })(
                                <Select
                                  filterOption={false}
                                  placeholder={`请选择${values.LABEL}`}
                                  allowClear
                                  // onSearch={e =>
                                  //   this.onEditSearch(values, e, values.key)
                                  // }
                                  showSearch={values.widgetType !== 'Select'}
                                  filterOption={(inputValue, option) =>
                                    _.includes(option.props.children, inputValue)
                                  }
                                  onChange={(e) => this.onChange(e, index, jj)}
                                // defaultValue={cacheFormData ? cacheFormData[index].DISPLAY_NAME : values.DISPLAY_NAME}
                                >
                                  {_.map(values.options, (v, i) => {
                                    return (
                                      <Select.Option value={v.value} key={v.value}>
                                        {v.text}
                                      </Select.Option>
                                    );
                                  })}
                                </Select>
                              )}
                            </Item>
                          </Col>
                        );
                        break;
                      case 'Date':
                      case 'DateTime':
                        let Date = [
                          {
                            ...values,
                            LABEL: `起始${values.LABEL}`,
                            DateType: 'start',
                          },
                          {
                            ...values,
                            LABEL: `结束${values.LABEL}`,
                            FIELD_VALUE: null,
                            DateType: 'end',
                          }
                        ]
                        return Date.map((kk, gg) => {
                          let type = kk.DateType
                          switch (type) {
                            case 'start' :
                                return (
                                  <Col span={10} offset={1} key={kk.SEQUENCE + kk.NAME + gg}>
                                    <Form.Item
                                      label={kk.LABEL}
                                      style={{ width: '100%' }}
                                      {...formItemLayout}
                                    >
                                      {getFieldDecorator(`${values.FIELD_NAME}-${kk.DateType}`, {
                                        initialValue: null,
                                        rules: [
                                          {
                                            required: gg == 0 ? values.REQUIRED_CONDITION : false,
                                            message: `${kk.LABEL}不能为空`
                                          }
                                        ]
                                      })(
                                        <DatePicker
                                          placeholder={`请选择${kk.LABEL}`}
                                          format="YYYY-MM-DD"
                                          placeholder=''
                                          showTime={{defaultValue: moment('00:00:00', 'HH:mm:ss')}}
                                          style={{ width: '100%' }}
                                          onChange={(e) =>{
                                            this.onChange(e, index, jj, kk.DateType)
                                            this.onStartChange(e,kk)
                                          }}
                                          disabledDate={(e)=>this.disabledStartDate(e,kk)}
                                          // value={this.state[`${kk.FIELD_NAME}-start`]}
                                          // onChange={(e)=>this.onStartChange(e,kk)}
                                        />
                                      )}
                                    </Form.Item>
                                  </Col>
                                );
                              break
                            case 'end' :
                              return (
                            <Col span={10} offset={1} key={kk.SEQUENCE + kk.NAME + gg}>
                              <Form.Item
                                label={kk.LABEL}
                                style={{ width: '100%' }}
                                {...formItemLayout}
                              >
                                {getFieldDecorator(`${values.FIELD_NAME}-${kk.DateType}`, {
                                  initialValue: null,
                                  rules: [
                                    {
                                      required: gg == 0 ? values.REQUIRED_CONDITION : false,
                                      message: `${kk.LABEL}不能为空`
                                    }
                                  ]
                                })(
                                  <DatePicker
                                    placeholder={`请选择${kk.LABEL}`}
                                    format="YYYY-MM-DD"
                                    placeholder=''
                                    showTime={{defaultValue: moment('23:59:59', 'HH:mm:ss')}}
                                    style={{ width: '100%' }}
                                    onChange={(e) => {
                                      this.onChange(e, index, jj, kk.DateType)
                                      this.onEndChange(e,kk)
                                    }}
                                    disabledDate={(e)=>this.disabledEndDate(e,kk)}
                                    // value={this.state[`${kk.FIELD_NAME}-end`]}
                                    // onChange={(e)=>this.onEndChange(e,kk)}
                                  />
                                )}
                              </Form.Item>
                            </Col>
                          );
                              break
                            default :
                              break
                          }
                        })
                        break;
                      case 'Number':
                        return (
                          <Col span={10} offset={1} key={values.SEQUENCE + values.NAME}>
                            <Form.Item
                              label={values.LABEL}
                              style={{ width: '100%' }}
                              {...formItemLayout}
                            >
                              {getFieldDecorator(`${values.DISPLAY_NAME}`, {
                                initialValue: cacheFormData ? cacheFormData[index].DISPLAY_NAME : values.DISPLAY_NAME,
                                rules: [
                                  {
                                    required: values.REQUIRED_CONDITION,
                                    message: `${values.LABEL}不能为空`,
                                  },
                                ],
                              })(
                                <InputNumber
                                  onBlur={this.onInputBlur}
                                  style={{ width: '100%' }}
                                  placeholder={`请录入${values.LABEL}`}
                                  onChange={(e) => this.onChange(e, index, jj)}
                                // defaultValue={cacheFormData ? cacheFormData[index].DISPLAY_NAME : values.DISPLAY_NAME}
                                />)}
                            </Form.Item>
                          </Col>
                        );
                      case 'Textarea':
                        return (
                          <Col span={10} offset={1} key={values.SEQUENCE + values.NAME}>
                            <Form.Item
                              label={values.LABEL}
                              style={{ width: '100%' }}
                              {...formItemLayout}
                            >
                              {/* {getFieldDecorator(`${values.DISPLAY_NAME}`, {
                                        initialValue: cacheFormData ? cacheFormData[index].DISPLAY_NAME : values.DISPLAY_NAME,
                                        rules: [
                                          {
                                            required: values.REQUIRED_CONDITION,
                                            message: `${values.LABEL}不能为空`,
                                          },
                                        ],
                                      })( */}
                              <div>
                                <TextArea
                                  rows={3}
                                  style={{ width: '100%' }}
                                  onChange={(e) => this.onChange(e, index, jj)}
                                  placeholder={`请录入${values.LABEL}`}
                                  defaultValue={cacheFormData ? cacheFormData[index].DISPLAY_NAME : values.DISPLAY_NAME}
                                />
                              </div>

                              {/* )} */}
                            </Form.Item>
                          </Col>
                        );
                      default:
                        break;
                    }
                  })}
                </Card>
              </div>

            })

          }
        </Form>
        </LocaleProvider>
      </div>

    )
  }
}

export default FormModular
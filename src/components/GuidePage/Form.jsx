import React from 'react'
import { connect } from 'dva';
import { ConfigProvider,Steps, Button, DatePicker, InputNumber, message, Card, Modal, Form, Switch, Row, Col, Input, Select, Number, notification } from 'antd';
import moment from 'moment';
import zhCN from 'antd/es/locale/zh_CN';
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

export default class FormModular extends React.Component {
  state={ 
      showData:{}
  }

  UNSAFE_componentWillMount=()=>{
    setTimeout(()=>{
      let params = this.props.tableButton.BUTTON_GUIDE[this.props.current]
      let { sendGuideData } = this.props.guidePage
      this.props.dispatch({
        type: 'guidePage/getGuideBean', payload: {
          params,
          pageNum: 1,
          pageSize: 10,
          METHOD_BODY: params.METHOD_BODY,
          AllData:sendGuideData,
        },callback:res=>{
            if (res.status == 'success') {
                this.props.dispatch({type:'guidePage/detailButtonGuide',payload:{
                    OBJECT_TYPE:this.props.tableButton.BUTTON_GUIDE[this.props.current].OBJECT_TYPE,
                    RELATED_FIELD_GROUP:this.props.tableButton.BUTTON_GUIDE[this.props.current].RELATED_FIELD_GROUP,
                    id:this.props.tableTemplate.isEdit ? this.props.tableTemplate.detailData.thisComponentUid : null
                },callback:res=>{
                    this.setState({
                        showData:res
                    })
                    this.props.closeSpin()
                }})
            }
        }
    })
    },1000)
}

disabledStartDate = (startValue,e) => {
  const endValue  = this.state[`${e.FIELD_NAME}-end`];
  if (!startValue || !endValue) {
    return false;
  }
  return startValue.valueOf() > endValue.valueOf();
};

disabledEndDate = (endValue,e) => {
  const startValue = this.state[`${e.FIELD_NAME}-start`]
  if (!endValue || !startValue) {
    return false;
  }
  return endValue.valueOf() <= startValue.valueOf();
};

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = (e,value) => {
    this.onChange([`${value.FIELD_NAME}-start`], e);
  };

  onEndChange = (e,value) => {
    this.onChange([`${value.FIELD_NAME}-end`], e);
  };

  check = () => {  //外面掉验证方法，通过再走下一步
    this.props.form.validateFields(err => {
      if (!err) {
        console.info('success');
      }
    });
  };

  componentWillUnmount=()=>{
    let {isEdit,selectDate} = this.props.tableTemplate
    let formData = _.cloneDeep(this.props.form.getFieldsValue())
    for(let i in formData){
      if(typeof(formData[i]) == 'object' && formData[i]){
        formData[i] = formData[i].valueOf()
      } 
    }
    formData.formPageId = isEdit ? selectDate.ID : null  //进入详情页的ID
    this.props.dispatch({
        type:'guidePage/getSaveData',
        payload:{relatedFieldGroup:this.state.showData.relatedFieldGroup,data:formData}
    })
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
};

compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('PASSWORD')) {
      callback('请确保两次密码相同!');
    } else {
      callback();
    }
};


  render() {
    const { getFieldDecorator } = this.props.form
    let cacheData = {}  //缓存数据
    let loopData = []  //分组数据
    let {showData} = this.state
    let forms = showData.policyFormFields
    if(forms){
        forms.map(item => {
        if (cacheData[item.PAGE_FIELD_GROUP_NAME]) {
                cacheData[item.PAGE_FIELD_GROUP_NAME].push(item)
            } else {
                cacheData[item.PAGE_FIELD_GROUP_NAME] = [item]
            }
        })
        for (let i in cacheData) {
            loopData.push(cacheData[i])
        }
    }
    return (
      <div>
        <ConfigProvider locale={zhCN}>
            <div>
            {
            loopData.map((item, jj) => {
              console.log('循环的值',item)
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
                              {getFieldDecorator(`${values.FIELD_NAME}`, {
                                initialValue: values.FIELD_VALUE,
                                rules: [
                                  {
                                    required: values.REQUIRED_CONDITION,
                                    message: `${values.LABEL}不能为空`,
                                  },
                                ]
                              })(
                                <Input
                                  disabled={values.READ_ONLY_CONDITION}
                                  style={{width:'100%'}}
                                  placeholder={`请录入${values.LABEL}`}
                                />
                              )}
                            </Form.Item>
                          </Col>
                        );
                        break;
                        case 'Password':
                           return [1,2].map((item,index)=>{
                            if(item == 1){
                              return (
                                <Col span={10} offset={1} key={values.SEQUENCE + values.NAME}>
                                <Form.Item label="密码" 
                                style={{ width: '100%' }}
                                {...formItemLayout} hasFeedback>
                                    {getFieldDecorator(`${values.FIELD_NAME}`, {
                                        rules: [
                                        {
                                            required: values.REQUIRED_CONDITION,
                                            message: '请输入您的密码!',
                                        },
                                        {
                                            validator: this.validateToNextPassword,
                                        },
                                        ],
                                    })(<Input.Password />)}
                                    </Form.Item>
                                </Col>
                            ) ;   
                            } else if(item == 2){
                              return (
                                <Col span={10} offset={1} key={values.SEQUENCE + values.NAME}>
                                
                                    <Form.Item label="确定密码" 
                                    style={{ width: '100%' }}
                                    {...formItemLayout} hasFeedback>
                                    {getFieldDecorator(`confirm${values.FIELD_NAME}`, {
                                        rules: [
                                        {
                                            required: values.REQUIRED_CONDITION,
                                            message: '请确定您的密码!',
                                        },
                                        {
                                            validator: this.compareToFirstPassword,
                                        },
                                        ],
                                    })(<Input.Password />)}
                                </Form.Item>
                                </Col>
                            ) ;   
                            }
                          })
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
                                  style={{width:'100%'}}
                                  disabled={values.READ_ONLY_CONDITION}
                                  showSearch={values.widgetType !== 'Select'}
                                  filterOption={(inputValue, option) =>
                                    _.includes(option.props.children, inputValue)
                                  }
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
                      case 'DateTime':
                          return (
                            <Col span={10} offset={1} key={values.SEQUENCE + values.NAME}>
                              <Form.Item
                                label={values.LABEL}
                                style={{ width: '100%' }}
                                {...formItemLayout}
                              >
                                {getFieldDecorator(`${values.FIELD_NAME}`, {
                                  initialValue: values.FIELD_VALUE ? moment(values.FIELD_VALUE) : null,
                                  rules: [
                                    {
                                      required: values.REQUIRED_CONDITION,
                                      message: `${values.LABEL}不能为空`
                                    }
                                  ]
                                })(
                                  <DatePicker
                                    // disabled={values.READ_ONLY_CONDITION}
                                    placeholder={`请选择${values.LABEL}`}
                                    format="YYYY-MM-DD"
                                    placeholder={`请选择${values.LABEL}`}
                                    onChange={(e)=>this.onStartChange(e,values)}
                                    showTime={{defaultValue: moment('00:00:00', 'HH:mm:ss')}}
                                    style={{ width: '100%' }}
                                    disabledDate={(e)=>this.disabledStartDate(e,values)}
                                  />
                                )}
                              </Form.Item>
                            </Col>
                          );
                        break
                      case 'Date':  //时间拆分成起始和结束的
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
                                        initialValue: values.FIELD_VALUE ? moment(values.FIELD_VALUE) : null,
                                        rules: [
                                          {
                                            required: gg == 0 ? values.REQUIRED_CONDITION : false,
                                            message: `${kk.LABEL}不能为空`
                                          }
                                        ]
                                      })(
                                        <DatePicker
                                          // disabled={values.READ_ONLY_CONDITION}
                                          placeholder={`请选择${kk.LABEL}`}
                                          format="YYYY-MM-DD"
                                          placeholder='请选择开始时间'
                                          onChange={(e)=>this.onStartChange(e,kk)}
                                          showTime={{defaultValue: moment('00:00:00', 'HH:mm:ss')}}
                                          style={{ width: '100%' }}
                                          disabledDate={(e)=>this.disabledStartDate(e,kk)}
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
                                    placeholder='请选择结束时间'
                                    onChange={(e)=>this.onEndChange(e,kk)}
                                    // disabled={values.READ_ONLY_CONDITION}
                                    showTime={{defaultValue: moment('23:59:59', 'HH:mm:ss')}}
                                    style={{ width: '100%' }}
                                    disabledDate={(e)=>this.disabledEndDate(e,kk)}
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
                              {getFieldDecorator(`${values.FIELD_NAME}`, {
                                initialValue: values.FIELD_VALUE,
                                rules: [
                                  {
                                    required: values.REQUIRED_CONDITION,
                                    message: `${values.LABEL}不能为空`,
                                  },
                                ],
                              })(
                                <InputNumber
                                  disabled={values.READ_ONLY_CONDITION}
                                  onBlur={this.onInputBlur}
                                  style={{ width: '100%' }}
                                  placeholder={`请录入${values.LABEL}`}
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
                              <div>
                                <TextArea
                                  rows={3}
                                  style={{ width: '100%' }}
                                  disabled={values.READ_ONLY_CONDITION}
                                  placeholder={`请录入${values.LABEL}`}
                                  defaultValue={values.FIELD_VALUE}
                                />
                              </div>
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
            </div>
        </ConfigProvider>
      </div>
    )
  }
}
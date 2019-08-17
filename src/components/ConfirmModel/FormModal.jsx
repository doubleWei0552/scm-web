import React from 'react'
import { Modal, 
    ConfigProvider,
    Table,
    Button,
    Form,
    Card,
    Col,
    Input,
    message,
    Popconfirm,
    Divider,
    InputNumber,
    Select,
    DatePicker,
    Icon,
    Tabs,
    Tooltip, } from 'antd'
import zhCN from 'antd/es/locale/zh_CN';
import { formItemValid } from '@/utils/validate';
import { connect } from 'dva';
import moment from 'moment';
import styles from './FormModal.less'

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';
const dateTimeFormat = 'YYYY/MM/DD HH:mm:ss';
const { RangePicker } = DatePicker;
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

//开户的modal
@Form.create()
@connect(({ guidePage,loading,tableTemplate }) => ({
    guidePage,
    tableTemplate,
    loadingG: loading.effects['guidePage/detailButtonGuide'],
}))
export default class FormModal extends React.Component{
    state = {
        visible: true,
    };

    UNSAFE_componentWillMount=()=>{
        let params = {
            OBJECT_TYPE:this.props.tableButton.BUTTON_GUIDE[0].objectType,
            RELATED_FIELD_GROUP:this.props.tableButton.BUTTON_GUIDE[0].relatedFieldGroup,
            id:this.props.tableTemplate.detailData.thisComponentUid,
        }
        this.props.dispatch({ type: 'guidePage/detailButtonGuide', payload: { params } });
    }
    
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
    let fieldGroup = this.props.guidePage.guidePageFormData.relatedFieldGroup
    let id = this.props.tableTemplate.detailData.thisComponentUid
    let objectType = this.props.guidePage.guidePageFormData.tableName
    let userMessage = this.props.form.getFieldsValue()
    this.props.dispatch({type:'guidePage/getOpenAccount',payload:{id,userMessage,objectType,fieldGroup},
    callback:res=>{
        if(res.executeScript){
            this.props.dispatch({type:'tableTemplate/save',payload:{reportFormURL:res.executeScript}})
        }
    }})
    setTimeout(() => {
        this.setState({
            visible: false,
        });
    }, 500);
    };
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

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    handleSelect =(e, field)=>{
        const { FIELD_NAME, OBJECT_TYPE } = field;
        const fieldValues = this.props.form.getFieldsValue();
        fieldValues[field.FIELD_NAME] = e;
        this.props.dispatch({
        type: 'guidePage/openAccountUpdateFields',
        payload: {
            updatedField: FIELD_NAME,
            objectType: OBJECT_TYPE,
            params: fieldValues,
            value: e,
            fieldValues:field.FIELD_NAME
        },callback:data=>{
            data.map((item,index)=>{
                item.fieldChanges.map((ii,jj)=>{
                    const index = _.findIndex(ii.changes, change => change.field === 'FIELD_VALUE');
                    this.props.form.setFieldsValue({
                        [ii.field]: ii.changes[index].value,
                    });
                })
            })
        }
      })
    }
    render(){
        const { getFieldDecorator } = this.props.form
        let loopData = []  //分组数据
        let groupData = {}
        let form = _.get(this.props.guidePage, 'guidePageFormData.policyFormFields', [])
        form.map(item => {
            if (groupData[item.PAGE_FIELD_GROUP_NAME]) {
                groupData[item.PAGE_FIELD_GROUP_NAME].push(item)
            } else {
                groupData[item.PAGE_FIELD_GROUP_NAME] = [item]
            }
        })
        for (let i in groupData) {
            loopData.push(groupData[i])
        }
        return(
            <ConfigProvider locale={zhCN}>
          <Modal
              closable={false}
              visible={this.state.visible}
              onOk={this.handleOk}
              destroyOnClose={true}
              onCancel={this.handleCancel}
            >
                  <Form {...formItemLayout}>
                  {
                      loopData.map((item, jj) => {
                      return <div key={jj}>
                          <span style={{ paddingTop: '1rem', display: 'inline-block' }}>{item[0].PAGE_FIELD_GROUP_NAME}</span>
                          <Card style={{ border: 'none', borderBottom: '1px solid #e8e8e8' }}>
                          {item.map((values, index) => {
                              switch (values.WIDGET_TYPE) {
                              case 'Password':
                                  return (
                                    <Col span={20} offset={1} key={values.SEQUENCE + values.NAME}>
                                    <Form.Item label="密码" hasFeedback>
                                        {getFieldDecorator('PASSWORD', {
                                            rules: [
                                            {
                                                required: true,
                                                message: '请输入您的密码!',
                                            },
                                            {
                                                validator: this.validateToNextPassword,
                                            },
                                            ],
                                        })(<Input.Password />)}
                                        </Form.Item>
                                        <Form.Item label="确定密码" hasFeedback>
                                        {getFieldDecorator('confirm', {
                                            rules: [
                                            {
                                                required: true,
                                                message: '请确定您的密码!',
                                            },
                                            {
                                                validator: this.compareToFirstPassword,
                                            },
                                            ],
                                        })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                                    </Form.Item>
                                    </Col>
                                ) ;   
                                break;
                              case 'Text':
                                  return (
                                  <Col key={index} span={20} offset={1} key={values.SEQUENCE + values.NAME}>
                                      <Form.Item
                                      label={values.LABEL}
                                      {...formItemLayout}
                                      style={{ width: '100%' }}
                                      >
                                      {getFieldDecorator(`${values.FIELD_NAME}`, {
                                                  initialValue: form ? form[index].DISPLAY_NAME : values.DISPLAY_NAME,
                                                  rules: [
                                                  {
                                                      required: values.REQUIRED_CONDITION,
                                                      message: `${values.LABEL}不能为空`,
                                                  },
                                                  ],
                                              })(
                                      <Input
                                          placeholder={`请录入${values.LABEL}`}
                                      />
                                      )} 
                                      </Form.Item>
                                  </Col>
                                  );
                                  break;
                              case 'Select':
                              case 'Reference':
                              case 'ObjectSelector':
                                  return (
                                  <Col span={20} offset={1} key={values.SEQUENCE + values.NAME}>
                                      <Item
                                      label={values.LABEL}
                                      style={{ width: '100%' }}
                                      {...formItemLayout}
                                      >
                                          {getFieldDecorator(`${values.FIELD_NAME}`, {
                                                  initialValue: form ? form[index].DISPLAY_NAME : values.DISPLAY_NAME,
                                                  rules: [
                                                  {
                                                      required: values.REQUIRED_CONDITION,
                                                      message: `${values.LABEL}不能为空`,
                                                  },
                                                  ],
                                              })(
                                                  <Select
                                                      showSearch
                                                      filterOption={false}
                                                      placeholder={`请选择${values.LABEL}`}
                                                      allowClear
                                                      filterOption={(inputValue, option) =>
                                                          _.includes(option.props.children, inputValue)
                                                      }
                                                      onSelect={e => this.handleSelect(e, values)}
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
                                      LABEL : `起始${values.LABEL}`,
                                      DateType: 'start',
                                  },
                                  { 
                                      ...values,
                                      LABEL : `结束${values.LABEL}`,
                                      FIELD_VALUE: null,
                                      DateType: 'end',
                                  }
                                  ]
                                  return Date.map((kk,gg)=>{
                                  return (
                                      <Col span={20} offset={1} key={kk.SEQUENCE + kk.NAME + gg}>
                                      <Form.Item
                                          label={kk.LABEL}
                                          style={{ width: '100%' }}
                                          {...formItemLayout}
                                      >
                                          {getFieldDecorator(`${values.FIELD_NAME}`, {
                                                  initialValue: kk.FIELD_VALUE && typeof(kk.FIELD_VALUE) == 'number' ? moment(+ kk.FIELD_VALUE) : null,
                                                  rules: [
                                                  {
                                                      required: values.REQUIRED_CONDITION,
                                                      message: `${values.LABEL}不能为空`,
                                                  },
                                                  ],
                                              })(
                                                 <DatePicker
                                              placeholder={`请选择${kk.LABEL}`}
                                              format={dateFormat}
                                              placeholder=''
                                              style={{ width: '100%' }}
                                          /> 
                                              )}
                                      </Form.Item>
                                      </Col>
                                  );
                                  })
                                  
                                  break;
                              case 'Number':
                                  return (
                                  <Col span={20} offset={1} key={values.SEQUENCE + values.NAME}>
                                      <Form.Item
                                      label={values.LABEL}
                                      style={{ width: '100%' }}
                                      {...formItemLayout}
                                      >
                                      {getFieldDecorator(`${values.FIELD_NAME}`, {
                                                  initialValue: form ? form[index].DISPLAY_NAME : values.DISPLAY_NAME,
                                                  rules: [
                                                  {
                                                      required: values.REQUIRED_CONDITION,
                                                      message: `${values.LABEL}不能为空`,
                                                  },
                                                  ],
                                              })(
                                      <div>
                                          <InputNumber
                                          onBlur={this.onInputBlur}
                                          style={{ width: '100%' }}
                                          placeholder={`请录入${values.LABEL}`}
                                          />
                                      </div>
  
                                      )} 
                                      </Form.Item>
                                  </Col>
                                  );
                              case 'Textarea':
                                  return (
                                  <Col span={20} offset={1} key={values.SEQUENCE + values.NAME}>
                                      <Form.Item
                                      label={values.LABEL}
                                      style={{ width: '100%' }}
                                      {...formItemLayout}
                                      >
                                      {getFieldDecorator(`${values.FIELD_NAME}`, {
                                                  initialValue: form ? form[index].DISPLAY_NAME : values.DISPLAY_NAME,
                                                  rules: [
                                                  {
                                                      required: values.REQUIRED_CONDITION,
                                                      message: `${values.LABEL}不能为空`,
                                                  },
                                                  ],
                                              })(
                                      <div>
                                          <TextArea
                                          rows={3}
                                          style={{ width: '100%' }}
                                          placeholder={`请录入${values.LABEL}`}
                                          />
                                      </div>
  
                                      )}
                                      </Form.Item>
                                  </Col>
                                  );
                              default:
                                  return 
                                  break;
                              }
                          })}
                          </Card>
                      </div>
                      })
                  }
                  </Form>
            </Modal>
            </ConfigProvider>
        )
    }
}
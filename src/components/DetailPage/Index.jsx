import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Table,
  Button,
  Form,
  Row,
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
  Tooltip,
  Radio,
  Checkbox,
} from 'antd';
import moment from 'moment';
import _ from 'lodash';
import styles from './Index.less';
import ShowImage from '@/components/Upload/ShowImage';
import ImageUpload from '@/components/Upload/ImageUpload';
import Attachments from '@/components/Upload/Attachments';
import Editor from '@/components/BraftEditor/index';
import responsive from '../DescriptionList/responsive';
import TreeSelectCom from '@/components/TreeSelect/Index';
import { formItemValid } from '@/utils/validate';
import { onGetImageUrl } from "@/utils/FunctionSet";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';
const dateTimeFormat = 'YYYY/MM/DD HH:mm:ss';

@Form.create()
@connect(({ tableTemplate, loading }) => ({
  tableTemplate,
  loadingG: loading.effects['tableTemplate/getDetailPage'],
}))
class DetailPage extends PureComponent {
  state = {
    readOnlyFields: [],
  };

  componentDidMount() {}

  componentWillReceiveProps() {}

  onEditSearch = (value, searchData) => {
    this.props.dispatch({
      type: 'tableTemplate/getAutocomplate',
      payload: { value, searchData: '' },
    });
  };

  handleSelect = (e, field) => {
    const { FIELD_NAME, OBJECT_TYPE } = field;
    const fieldValues = this.props.form.getFieldsValue();
    fieldValues[field.FIELD_NAME] = e;
    this.props.dispatch({
      type: 'tableTemplate/updateFields',
      payload: {
        updatedField: FIELD_NAME,
        objectType: OBJECT_TYPE,
        params: fieldValues,
        value: e,
      },
      callback: data => {
        const { readOnlyFields } = this.state;
        _.map(data, item => {
          const index = _.findIndex(item.changes, change => change.field === 'FIELD_VALUE');
          const index2 = _.findIndex(
            item.changes,
            change => change.field === 'READ_ONLY_CONDITION' && change.value == true
          );
          if (index > -1) {
            this.props.form.setFieldsValue({
              [item.field]: item.changes[index].value,
            });
          }
          if (index2 > -1) {
            const i = _.findIndex(readOnlyFields, f => f === item.field);
            if (i < 0) {
              readOnlyFields.push(item.field);
              this.setState({
                readOnlyFields,
              });
            }
          }
        });
      },
    });
  };

  handleImageChange = (e, i) => {
    const url = _.get(e[0], 'response.data');
    if (url) {
      _.get(this.props.tableTemplate.detailData,'policyFormFields').map(item=>{
        if(item.FIELD_NAME == i ){
          item.FIELD_VALUE = [e[0].response.data]
        }
      })
      this.props.form.setFieldsValue({
        [i]: [url],
      });
    }
  };

  // 多个图片情况
  handleAttachmentsChange =(e,i)=>{
    console.log('修改',e,i)
    let value = []
    if(e){
      e.map(item=>{
        if(item.response){
          value.push(item.response.data)
        }else{
          value.push(item)
        }
      })
    }
    console.log('value',value)
    // const url = _.get(e[0], 'response.data');
    if (value.length) {
      _.get(this.props.tableTemplate.detailData,'policyFormFields').map(item=>{
        if(item.FIELD_NAME == i ){
          item.FIELD_VALUE = value
        }
      })
      this.props.form.setFieldsValue({
        [i]: value,
      });
    }
  }

  //富文本编辑器赋值
  onRichText = (value, FIELD_NAME) => {
    this.props.form.setFieldsValue({
      [FIELD_NAME]: value,
    });
  };

  render() {
    const { tableTemplate } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { policyFormFields = [] } = _.get(tableTemplate, 'detailData');
    const { readOnlyFields } = this.state;
    _.map(policyFormFields, (item,index)=>{
      if(item.WIDGET_TYPE == "Image" || item.WIDGET_TYPE == "Attachment"){
        if(item.FIELD_VALUE){
          item.FIELD_VALUE.map(ii=>{
            if(ii.url){
              if(!ii.url.includes('http:')){
                let newUrl = onGetImageUrl(ii)
                ii.url = newUrl
              }
            }
          })
        }
      }
    })
    let tabFields = [];
    _.map(policyFormFields, (field, index) => {
      const i = _.findIndex(tabFields, item => item.tabName === field.PAGE_FIELD_TAB_NAME);
      if (i > -1) {
        tabFields[i].fields.push(field);
      } else {
        tabFields.push({ tabName: field.PAGE_FIELD_TAB_NAME, fields: [field] });
      }
    });
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
    return (
      <div className={styles.detailPage}>
        <Form layout="inline" onSubmit={this.resetFields}>
          <Tabs
            style={{ background: 'white' }}
            className={tabFields.length > 1 ? 'showTabBar' : 'hideTabBar'}
          >
            {_.map(tabFields, (item, index) => {
              let gFields = [];
              _.map(item.fields, (itm, index) => {
                const i = _.findIndex(
                  gFields,
                  data => data.groupName === itm.PAGE_FIELD_GROUP_NAME
                );
                if (i > -1) {
                  gFields[i].fields.push(itm);
                } else {
                  gFields.push({ groupName: itm.PAGE_FIELD_GROUP_NAME, fields: [itm] });
                }
              });

              return (
                <TabPane tab={item.tabName} key={index}>
                  <div key={index} style={{ border: 'none', borderBottom: '1px solid #e8e8e8' }}>
                    {_.map(gFields, gField => (
                      <Card key={gField.groupName}>
                        <h3>{gField.groupName}</h3>
                        {_.map(gField.fields, (field, i) => {
                          if (!field.DISPLAY_CONDITION) {
                            return (
                              <Form.Item>
                                {getFieldDecorator(`${field.FIELD_NAME}`, {
                                  initialValue: _.get(field, 'FIELD_VALUE'),
                                })(<Input type="hidden" />)}
                              </Form.Item>
                            );
                          }
                          // 解决多个上传组件的图片展示问题
                          // if (
                          //   field.WIDGET_TYPE === 'Image' &&
                          //   this.props.form.getFieldValue(field.FIELD_NAME)
                          // ) {
                          //   field.FIELD_VALUE = this.props.form.getFieldValue(field.FIELD_NAME);
                          // }
                          switch (field.WIDGET_TYPE) {
                            case 'Password':
                              return (
                                <Col span={10} offset={1} key={i}>
                                  <Form.Item
                                    label={
                                      <Tooltip title={field.LABEL + '[' + field.FIELD_NAME + ']'}>
                                        {field.LABEL}
                                      </Tooltip>
                                    }
                                    {...formItemLayout}
                                    style={{ width: '100%' }}
                                  >
                                    {getFieldDecorator(`${field.FIELD_NAME}`, {
                                      initialValue: _.get(field, 'FIELD_VALUE'),
                                      rules: [
                                        {
                                          required: field.REQUIRED_CONDITION,
                                          message: `${field.LABEL}不能为空`,
                                        },
                                        ...formItemValid(field.PATTERN, field.LABEL),
                                      ],
                                    })(
                                      <Input
                                        disabled={
                                          this.props.disabled ? true : field.READ_ONLY_CONDITION
                                        }
                                        type="password"
                                        onChange={e => e.preventDefault()}
                                      />
                                    )}
                                  </Form.Item>
                                </Col>
                              );
                              break;

                            case 'Text':
                              return (
                                <Col span={10} offset={1} key={i}>
                                  <Form.Item
                                    label={
                                      <Tooltip title={field.LABEL + '[' + field.FIELD_NAME + ']'}>
                                        {field.LABEL}
                                      </Tooltip>
                                    }
                                    {...formItemLayout}
                                    style={{ width: '100%' }}
                                  >
                                    {getFieldDecorator(`${field.FIELD_NAME}`, {
                                      initialValue: _.get(field, 'FIELD_VALUE'),
                                      rules: [
                                        {
                                          required: field.REQUIRED_CONDITION,
                                          message: `${field.LABEL}不能为空`,
                                        },
                                        ...formItemValid(field.PATTERN, field.LABEL),
                                      ],
                                    })(
                                      <Input
                                        disabled={
                                          this.props.disabled ? true : field.READ_ONLY_CONDITION
                                        }
                                        // placeholder={`请输入${field.LABEL}`}
                                        onChange={e => e.preventDefault()}
                                        // style={{ width: '165px', textOverflow: 'ellipsis' }}
                                      />
                                    )}
                                  </Form.Item>
                                </Col>
                              );
                              break;

                            case 'Select':
                            case 'Reference':
                            case 'ObjectSelector':
                            case 'MultiObjectSelector':
                              return (
                                <Col span={10} offset={1} key={i}>
                                  <Form.Item
                                    label={
                                      <Tooltip title={field.LABEL + '[' + field.FIELD_NAME + ']'}>
                                        {field.LABEL}
                                      </Tooltip>
                                    }
                                    style={{ width: '100%' }}
                                    {...formItemLayout}
                                  >
                                    {getFieldDecorator(`${field.FIELD_NAME}`, {
                                      initialValue: _.get(field, 'FIELD_VALUE'),
                                      rules: [
                                        {
                                          required: field.REQUIRED_CONDITION,
                                          message: `${field.LABEL}不能为空`,
                                        },
                                        ...formItemValid(field.PATTERN, field.LABEL),
                                      ],
                                    })(
                                      <Select
                                        // placeholder={`请选择${field.LABEL}`}
                                        showSearch={field.WIDGET_TYPE !== 'Select'}
                                        allowClear
                                        onSearch={e => this.onEditSearch(field, e)}
                                        onSelect={e => this.handleSelect(e, field)}
                                        filterOption={(inputValue, option) =>
                                          _.includes(option.props.children, inputValue)
                                        }
                                        disabled={
                                          this.props.disabled ? true : field.READ_ONLY_CONDITION
                                        }
                                      >
                                        {_.map(field.options, (v, i) => {
                                          return (
                                            <Option value={v.value} key={v.value}>
                                              {v.text}
                                            </Option>
                                          );
                                        })}
                                      </Select>
                                    )}
                                  </Form.Item>
                                </Col>
                              );
                              break;
                            // 单选框
                            // case 'Select':
                            // case 'Reference':
                            // case 'ObjectSelector':
                            // case 'MultiObjectSelector':
                            //   return (
                            //     <Col span={10} offset={1} key={i}>
                            //       <Form.Item
                            //         label={
                            //           <Tooltip title={field.LABEL + '[' + field.FIELD_NAME + ']'}>
                            //             {field.LABEL}
                            //           </Tooltip>
                            //         }
                            //         style={{ width: '100%' }}
                            //         {...formItemLayout}
                            //       >
                            //         {getFieldDecorator(`${field.FIELD_NAME}`, {
                            //           initialValue: _.get(field, 'FIELD_VALUE'),
                            //           rules: [
                            //             {
                            //               required: field.REQUIRED_CONDITION,
                            //               message: `${field.LABEL}不能为空`,
                            //             },
                            //             ...formItemValid(field.PATTERN, field.LABEL),
                            //           ],
                            //         })(
                            //           <Radio.Group
                            //             disabled={
                            //               this.props.disabled ? true : field.READ_ONLY_CONDITION
                            //             }
                            //           >
                            //             {_.map(field.options, (v, i) => {
                            //               return (
                            //                 <Radio value={v.value} key={v.value}>
                            //                   {v.text}
                            //                 </Radio>
                            //               );
                            //             })}
                            //           </Radio.Group>
                            //           // <Select
                            //           //   // placeholder={`请选择${field.LABEL}`}
                            //           //   showSearch={field.WIDGET_TYPE !== 'Select'}
                            //           //   allowClear
                            //           //   onSearch={e => this.onEditSearch(field, e)}
                            //           //   onSelect={e => this.handleSelect(e, field)}
                            //           //   filterOption={(inputValue, option) =>
                            //           //     _.includes(option.props.children, inputValue)
                            //           //   }
                            //           //   disabled={
                            //           //     this.props.disabled ? true : field.READ_ONLY_CONDITION
                            //           //   }
                            //           // >
                            //           //   {_.map(field.options, (v, i) => {
                            //           //     return (
                            //           //       <Option value={v.value} key={v.value}>
                            //           //         {v.text}
                            //           //       </Option>
                            //           //     );
                            //           //   })}
                            //           // </Select>
                            //         )}
                            //       </Form.Item>
                            //     </Col>
                            //   );
                            //   break;
                            // 复选框
                            // case 'Select':
                            // case 'Reference':
                            // case 'ObjectSelector':
                            // case 'MultiObjectSelector':
                            //   return (
                            //     <Col span={10} offset={1} key={i}>
                            //       <Form.Item
                            //         label={
                            //           <Tooltip title={field.LABEL + '[' + field.FIELD_NAME + ']'}>
                            //             {field.LABEL}
                            //           </Tooltip>
                            //         }
                            //         style={{ width: '100%' }}
                            //         {...formItemLayout}
                            //       >
                            //         {getFieldDecorator(`${field.FIELD_NAME}`, {
                            //           initialValue: [_.get(field, 'FIELD_VALUE')],
                            //           rules: [
                            //             {
                            //               required: field.REQUIRED_CONDITION,
                            //               message: `${field.LABEL}不能为空`,
                            //             },
                            //             ...formItemValid(field.PATTERN, field.LABEL),
                            //           ],
                            //         })(
                            //           <Checkbox.Group
                            //             disabled={
                            //               this.props.disabled ? true : field.READ_ONLY_CONDITION
                            //             }
                            //           >
                            //             {field.options.length > 0 && (
                            //               <Row>
                            //                 {_.map(field.options, (v, i) => {
                            //                   return (

                            //                     <Checkbox value={v.value} key={v.value}>
                            //                       {v.text}
                            //                     </Checkbox>
                            //                   );
                            //                 })}
                            //               </Row>
                            //             )}

                            //           </Checkbox.Group>

                            //         )}
                            //       </Form.Item>
                            //     </Col>
                            //   );
                            //   break;
                            case 'Date':
                            case 'DateTime':
                              return (
                                <Col span={10} offset={1} key={i}>
                                  <Form.Item
                                    label={
                                      <Tooltip title={field.LABEL + '[' + field.FIELD_NAME + ']'}>
                                        {field.LABEL}
                                      </Tooltip>
                                    }
                                    style={{ width: '100%' }}
                                    {...formItemLayout}
                                  >
                                    {getFieldDecorator(`${field.FIELD_NAME}`, {
                                      initialValue: field.FIELD_VALUE
                                        ? moment(_.get(field, 'FIELD_VALUE') * 1)
                                        : null,
                                      rules: [
                                        {
                                          required: field.REQUIRED_CONDITION,
                                          message: `${field.LABEL}不能为空`,
                                        },
                                        ...formItemValid(field.PATTERN, field.LABEL),
                                      ],
                                    })(
                                      <DatePicker
                                        disabled={
                                          this.props.disabled ? true : field.READ_ONLY_CONDITION
                                        }
                                        format={
                                          field.WIDGET_TYPE == 'Date' ? dateFormat : dateTimeFormat
                                        }
                                        placeholder=""
                                        style={{ width: '100%' }}
                                      />
                                    )}
                                  </Form.Item>
                                </Col>
                              );
                              break;
                            case 'Number':
                              return (
                                <Col span={10} offset={1} key={i}>
                                  <Form.Item
                                    label={
                                      <Tooltip title={field.LABEL + '[' + field.FIELD_NAME + ']'}>
                                        {field.LABEL}
                                      </Tooltip>
                                    }
                                    style={{ width: '100%' }}
                                    {...formItemLayout}
                                  >
                                    {getFieldDecorator(`${field.FIELD_NAME}`, {
                                      initialValue: _.get(field, 'FIELD_VALUE'),
                                      rules: [
                                        {
                                          required: field.REQUIRED_CONDITION,
                                          message: `${field.LABEL}不能为空`,
                                        },
                                        ...formItemValid(field.PATTERN, field.LABEL),
                                      ],
                                    })(
                                      <InputNumber
                                        onBlur={this.onInputBlur}
                                        disabled={
                                          this.props.disabled ? true : field.READ_ONLY_CONDITION
                                        }
                                        style={{ width: '100%' }}
                                      />
                                    )}
                                  </Form.Item>
                                </Col>
                              );
                            case 'Textarea':
                              return (
                                <Col span={10} offset={1} key={i}>
                                  <Form.Item
                                    label={
                                      <Tooltip title={field.LABEL + '[' + field.FIELD_NAME + ']'}>
                                        {field.LABEL}
                                      </Tooltip>
                                    }
                                    style={{ width: '100%' }}
                                    {...formItemLayout}
                                  >
                                    {getFieldDecorator(`${field.FIELD_NAME}`, {
                                      initialValue: _.get(field, 'FIELD_VALUE'),
                                      rules: [
                                        {
                                          required: field.REQUIRED_CONDITION,
                                          message: `${field.LABEL}不能为空`,
                                        },
                                        ...formItemValid(field.PATTERN, field.LABEL),
                                      ],
                                    })(
                                      <TextArea
                                        rows={3}
                                        disabled={
                                          this.props.disabled ? true : item.READ_ONLY_CONDITION
                                        }
                                        style={{ width: '100%' }}
                                      />
                                    )}
                                  </Form.Item>
                                </Col>
                              );
                            case 'RichText': //富文本编辑器
                              return (
                                <Col span={22} offset={1} key={i}>
                                  <Form.Item
                                    // label={<Tooltip title={field.LABEL + '[' + field.FIELD_NAME + ']'}>{field.LABEL}</Tooltip>}
                                    style={{ width: '100%' }}
                                    // {...formItemLayout}
                                  >
                                    {getFieldDecorator(`${field.FIELD_NAME}`, {
                                      initialValue: _.get(field, 'FIELD_VALUE'),
                                      rules: [
                                        {
                                          required: field.REQUIRED_CONDITION,
                                          message: `${field.LABEL}不能为空`,
                                        },
                                        ...formItemValid(field.PATTERN, field.LABEL),
                                      ],
                                    })(
                                      <Editor
                                        defaultData={field.DISPLAY_NAME}
                                        onRichText={value =>
                                          this.onRichText(value, field.FIELD_NAME)
                                        }
                                        disabled={
                                          this.props.disabled ? true : field.READ_ONLY_CONDITION
                                        }
                                      />
                                    )}
                                  </Form.Item>
                                </Col>
                              );
                            case 'Image':
                              // console.log('field',field)
                              return (
                                <Col span={10} offset={1} key={i}>
                                  <Form.Item
                                    label={
                                      <Tooltip title={field.LABEL + '[' + field.FIELD_NAME + ']'}>
                                        {field.LABEL}
                                      </Tooltip>
                                    }
                                    style={{ width: '100%', height: '123px' }}
                                    {...formItemLayout}
                                  >
                                    {getFieldDecorator(`${field.FIELD_NAME}`, {
                                      initialValue: _.get(field, 'FIELD_VALUE'),
                                      rules: [
                                        {
                                          required: field.REQUIRED_CONDITION,
                                          message: `${field.LABEL}不能为空`,
                                        },
                                        ...formItemValid(field.PATTERN, field.LABEL),
                                      ],
                                    })(
                                      <ImageUpload
                                        key={field.LABEL}
                                        handleImageChange={e =>
                                          this.handleImageChange(e, field.FIELD_NAME)
                                        }
                                        field={field}
                                        {...this.props}
                                        disabled={
                                          this.props.disabled ? true : item.READ_ONLY_CONDITION
                                        }
                                      />
                                    )}
                                  </Form.Item>
                                </Col>
                              );
                            case 'TreeSelector':
                              return (
                                <Col span={10} offset={1} key={i}>
                                  <Form.Item
                                    label={
                                      <Tooltip title={field.LABEL + '[' + field.FIELD_NAME + ']'}>
                                        {field.LABEL}
                                      </Tooltip>
                                    }
                                    style={{ width: '100%' }}
                                    {...formItemLayout}
                                  >
                                    {getFieldDecorator(`${field.FIELD_NAME}`, {
                                      initialValue: _.get(field, 'FIELD_VALUE'),
                                      rules: [
                                        {
                                          required: field.REQUIRED_CONDITION,
                                          message: `${field.LABEL}不能为空`,
                                        },
                                        ...formItemValid(field.PATTERN, field.LABEL),
                                      ],
                                    })(
                                      <TreeSelectCom
                                        defaultData={field.FIELD_VALUE}
                                        treeData={field.children}
                                        handleImageChange={e =>
                                          this.handleImageChange(e, field.FIELD_NAME)
                                        }
                                        style={{ width: '200px' }}
                                        disabled={
                                          this.props.disabled ? true : item.READ_ONLY_CONDITION
                                        }
                                      />
                                    )}
                                  </Form.Item>
                                </Col>
                              );
                            case 'Attachment': //附件
                              return (
                                <Col span={22} offset={1} key={i}>
                                  <Form.Item
                                    label={
                                      <Tooltip title={field.LABEL + '[' + field.FIELD_NAME + ']'}>
                                        {field.LABEL}
                                      </Tooltip>
                                    }
                                    style={{ width: '100%', minHeight: '123px', display: 'block' }}
                                  >
                                    {getFieldDecorator(`${field.FIELD_NAME}`, {
                                      initialValue: _.get(field, 'FIELD_VALUE'),
                                      rules: [
                                        {
                                          required: field.REQUIRED_CONDITION,
                                          message: `${field.LABEL}不能为空`,
                                        },
                                        ...formItemValid(field.PATTERN, field.LABEL),
                                      ],
                                    })(
                                      <Attachments
                                        handleAttachmentsChange={e =>
                                          this.handleAttachmentsChange(e, field.FIELD_NAME)
                                        }
                                        field={field}
                                        {...this.props}
                                        disabled={
                                          this.props.disabled ? true : item.READ_ONLY_CONDITION
                                        }
                                      />
                                    )}
                                  </Form.Item>
                                </Col>
                              );
                            default:
                              break;
                          }
                        })}
                      </Card>
                    ))}
                  </div>
                </TabPane>
              );
            })}
          </Tabs>
        </Form>
      </div>
    );
  }
}

export default DetailPage;

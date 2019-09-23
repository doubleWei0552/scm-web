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
import { onGetImageUrl } from '@/utils/FunctionSet';
import { file } from '@babel/types';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';
const dateTimeFormat = 'YYYY/MM/DD HH:mm:ss';

@Form.create()
@connect(({ loading,detailPage }) => ({
  detailPage,
  loadingG: loading.effects['tableTemplate/getDetailPage'],
}))

class DetailPage extends PureComponent {
  state = {
    readOnlyFields: [],
  };

  componentDidMount() {
    this.props.onRef(this)
  }
  render() {
    const { SHOW_PARENT } = TreeSelectCom
    const { detailPage } = this.props;
    const { policyFormFields = [] } = _.get(detailPage, 'detailData');

    const { getFieldDecorator } = this.props.form;
    const { readOnlyFields } = this.state;
    _.map(policyFormFields, (item, index) => {
      if (item.WIDGET_TYPE == 'Image' || item.WIDGET_TYPE == 'Attachment') {
        if (item.FIELD_VALUE) {
          item.FIELD_VALUE.map(ii => {
            if (ii.url) {
              if (!ii.url.includes('http:')) {
                let newUrl = onGetImageUrl(ii);
                ii.url = newUrl;
              }
            }
          });
        }
      }
    });
    let tabFields = [];
    _.map(policyFormFields, (field, index) => {
      const i = _.findIndex(tabFields, item => _.get(item, 'tabName') === field.PAGE_FIELD_TAB_NAME);
      if (i > -1) {
        tabFields[i].fields.push(field);
      } else {
        if (field.PAGE_FIELD_TAB_SORT) {
          tabFields[field.PAGE_FIELD_TAB_SORT] = { tabName: field.PAGE_FIELD_TAB_NAME, fields: [field] };
        } else {
          tabFields.push({ tabName: field.PAGE_FIELD_TAB_NAME, fields: [field] });
        }

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
                              <Form.Item key={field.FIELD_NAME}>
                                {getFieldDecorator(`${field.FIELD_NAME}`, {
                                  initialValue: _.get(field, 'FIELD_VALUE'),
                                })(<Input type="hidden" />)}
                              </Form.Item>
                            );
                          }
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
                                        disabled={true}
                                        type="password"
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
                                      initialValue: field.FIELD_VALUE || '',
                                      rules: [
                                        {
                                          required: field.REQUIRED_CONDITION,
                                          message: `${field.LABEL}不能为空`,
                                        },
                                        ...formItemValid(field.PATTERN, field.LABEL),
                                      ],
                                    })(
                                      <Input
                                        disabled={true}
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
                                  {
                                    field.IS_MULTI ? <Form.Item //判断是不是多选
                                      label={
                                        <Tooltip title={field.LABEL + '[' + field.FIELD_NAME + ']'}>
                                          {field.LABEL}
                                        </Tooltip>
                                      }
                                      style={{ width: '100%' }}
                                      {...formItemLayout}
                                    >
                                      {getFieldDecorator(`${field.FIELD_NAME}`, {
                                        initialValue: _.get(field, 'FIELD_VALUE') ? _.get(field, 'FIELD_VALUE') : [],
                                        rules: [
                                          {
                                            required: field.REQUIRED_CONDITION,
                                            message: `${field.LABEL}不能为空`,
                                          },
                                          ...formItemValid(field.PATTERN, field.LABEL),
                                        ],
                                      })(
                                        <Select
                                          mode="multiple"
                                          showSearch={field.WIDGET_TYPE !== 'Select'}
                                          disabled={true}
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
                                    </Form.Item> : <Form.Item
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
                                            showSearch={field.WIDGET_TYPE !== 'Select'}
                                            filterOption={(inputValue, option) =>
                                              _.includes(option.props.children, inputValue)
                                            }
                                            disabled={true}
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
                                  }
                                </Col>
                              );
                              break;
                            // 单选框
                            case 'Radio':
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
                                      <Radio.Group
                                        disabled={true}
                                      >
                                        {_.map(field.options, (v, i) => {
                                          return (
                                            <Radio
                                              style={{ width: 90 }}
                                              value={v.value}
                                              key={v.value}
                                            >
                                              {v.text}
                                            </Radio>
                                          );
                                        })}
                                      </Radio.Group>
                                    )}
                                  </Form.Item>
                                </Col>
                              );
                              break;
                            // 复选框
                            case 'Checkbox':
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
                                      initialValue: _.get(field, 'FIELD_VALUE')
                                        ? _.get(field, 'FIELD_VALUE')
                                        : [],
                                      rules: [
                                        {
                                          required: field.REQUIRED_CONDITION,
                                          message: `${field.LABEL}不能为空`,
                                        },
                                        ...formItemValid(field.PATTERN, field.LABEL),
                                      ],
                                    })(
                                      <Checkbox.Group
                                        style={{ lineHeight: '32px' }}
                                        disabled={true}
                                      >
                                        {field.options.length > 0 && (
                                          <Row>
                                            {_.map(field.options, (v, i) => {
                                              return (
                                                <Checkbox
                                                  style={{ width: 90, marginLeft: 8 }}
                                                  value={v.value}
                                                  key={v.value}
                                                >
                                                  {v.text}
                                                </Checkbox>
                                              );
                                            })}
                                          </Row>
                                        )}
                                      </Checkbox.Group>
                                    )}
                                  </Form.Item>
                                </Col>
                              );
                              break;
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
                                        disabled={true}
                                        onChange={(e) => this.onNumberChange(e.valueOf(), field)}
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
                                        disabled={true}
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
                                        disabled={true}
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
                                      <Editor
                                        defaultData={field.DISPLAY_NAME}
                                        onRichText={value =>
                                          this.onRichText(value, field.FIELD_NAME)
                                        }
                                        disabled={true}
                                      />
                                    )}
                                  </Form.Item>
                                </Col>
                              );
                            case 'Image':
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
                                        disabled={true}
                                      />
                                    )}
                                  </Form.Item>
                                </Col>
                              );
                            case 'TreeSelector':
                              return (
                                <Col span={10} offset={1} key={i}>
                                  {
                                    field.IS_MULTI ? <Form.Item  //判断是不是多选
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
                                        <TreeSelectCom key={field.FIELD_NAME}
                                          defaultData={field.FIELD_VALUE}
                                          treeData={field.children}
                                          treeCheckable={true}
                                          showSearch={true}
                                          style={{ width: '100%' }}
                                          treeDefaultExpandAll
                                          showCheckedStrategy={SHOW_PARENT}
                                          onChange={e => this.onTreeSelector(e, field)}
                                          disabled={true}
                                        />
                                      )}
                                    </Form.Item> :
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
                                            onChange={e => this.onTreeSelector(e, field)}
                                            style={{ width: '100%' }}
                                            treeDefaultExpandAll
                                            showCheckedStrategy={SHOW_PARENT}
                                            filterTreeNode={(inputValue, treeNode) => {
                                              _.includes(treeNode.props.children, inputValue)
                                            }
                                            }
                                            disabled={true}
                                          />
                                        )}
                                      </Form.Item>
                                  }
                                </Col>
                              );
                            case 'Attachment': //附件
                              return (
                                <Col span={20} offset={1} key={i}>
                                  <Form.Item
                                    label={
                                      <Tooltip title={field.LABEL + '[' + field.FIELD_NAME + ']'}>
                                        {field.LABEL}
                                      </Tooltip>
                                    }
                                    {...formItemLayout}
                                    style={{ width: '100%',paddingRight:'50%' }}
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
                                        dispatch={this.props.dispatch}
                                        disabled={true}
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

import React from 'react'
import { connect } from 'dva';
import {
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
  Spin,
  Tabs,
  Divider,
} from 'antd'
import NTableForm from '../TableForm/TableForm'; //子表组件
import { formItemValid } from '@/utils/validate';
import moment from 'moment';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const { TextArea } = Input
const TabPane = Tabs.TabPane;

@Form.create()
@connect(({ tableTemplate }) => ({
  tableTemplate
}))

export default class ChildTable extends React.Component {
  state = {
    autoFocus: false, //管控inputNumber掉rtlink功能后的焦点状态
    regesKey: '', //子表通过验证的唯一的key，用于判断显示对应的border边框
    isRegex: true, //子表是否通过了正则表达式验证，默认通过为true
  }
  //子表tab组件
  tabCallback = key => {
    this.props.dispatch({ type: 'tableTemplate/save', payload: { defaultActiveKey: key } });
  };

  onEditSearch = (value, searchData, selectKey, ColumnsData) => {
    if (ColumnsData) {
      this.props.dispatch({
        type: 'tableTemplate/getChildAutocomplate',
        payload: { value, searchData, selectKey, ColumnsData },
      });
    } else {
      this.props.dispatch({
        type: 'tableTemplate/getAutocomplate',
        payload: { value, searchData, selectKey },
      });
    }
  };

  popconfirmCancel = e => {
    console.log(e);
  };

  // // table排序方法  //暂定，根据后端的传参来调用
  // handleChange = (pagination, filters, sorter) => {
  //     let obj = {
  //     descend:'DESC',
  //     ascend:'ASC',
  //     undefined:null,
  //     }
  //     let {searchParams,pageId} = this.props.tableTemplate
  //     let value = sorter.field ? sorter.field + ' ' + obj[sorter.order] : null
  // };

  //子表事件
  onChildDelete = record => {
    let id = record.id;
    let objectType = record.objectType;
    this.props.dispatch({ type: 'tableTemplate/getRemoveChildData', payload: { id, objectType } });
  };

  //子表删除气泡确定框
  // deleteIndex:要删除的子表的具体数据 ;index:要对第几个子表的数据进行操作的下标
  popconfirmConfirm = (record, deleteIndex, index) => {
    this.onChildDelete(record);
    let deleteKey = record.key;
    if (record.id) {
      //判断删除元数据还是缓存数据
      _.remove(this.ChildData, function (n) {
        return n.key != deleteKey;
      });
    } else {
      _.remove(this.props.tableTemplate.ChildData[index].Data.records, function (n, index) {
        return index == deleteIndex;
      });
    }
  };

  autoFocusChange = () => {
    this.setState({
      autoFocus: false
    })
  }

  //新的子表编辑
  onChildChang = (e, record, specificData, type, childIndex, index, Columns, Data) => {
    switch (type) {
      case 'targetValue':
        this.props.tableTemplate.ChildData[index].Data.records[childIndex].map(p => {
          if (p.FIELD_NAME == specificData.FIELD_NAME) {
            p.FIELD_VALUE = e.target.value;
          }
        });
        // specificData.FIELD_VALUE = e.target.value;
        break;
      case 'DateInput':
        this.props.tableTemplate.ChildData[index].Data.records[childIndex].map(p => {
          if (p.FIELD_NAME == specificData.FIELD_NAME) {
            p.FIELD_VALUE = e.valueOf();
          }
        });
        break;
      case 'NumberInput':
        //增加rtlink功能
        // specificData.FIELD_VALUE = e;
        this.props.tableTemplate.ChildData[index].Data.records[childIndex].map(p => {
          if (p.FIELD_NAME == specificData.FIELD_NAME) {
            p.FIELD_VALUE = e;
            p.DISPLAY_NAME = e;
          }
        });
        let recordData = record;
        recordData[specificData.FIELD_NAME] = e;

        let cacheNumberData = {};
        cacheNumberData.updatedField = specificData.FIELD_NAME;
        cacheNumberData.identifier =
          specificData.FIELD_NAME + '-' + specificData.FIELD_VALUE + '-' + specificData.id;
        cacheNumberData.identifierKey = record.key;
        cacheNumberData.objectType = specificData.OBJECT_TYPE;
        cacheNumberData.policyFormFields = [];
        for (let i in recordData) {
          let obj = {
            FIELD_NAME: i,
            FIELD_VALUE: recordData[i],
          };
          cacheNumberData.policyFormFields.push(obj);
        }
        cacheNumberData.fieldGroupName = Columns.fieldGroupName;
        let isIndex = Columns.rtLinks.includes(specificData.FIELD_NAME)
        if(isIndex){
          this.props.dispatch({
            type: 'tableTemplate/childUpdateFields',
            payload: { params: { list: [cacheNumberData] } },
            callback: res => {
              if (res.status == 'success') {
                // this.specificData.inputNumberRef.onFocus()
                // this.ref.current.props.autoFocus = true
              }
            },
          });
        }
        
        this.setState({
          autoFocus: true,
        });
        break;
      case 'Select':
      case 'Reference':
      case 'ObjectSelect':
        var bb;
        if (e) {
          bb = e.split('--')[1];
          e = e.split('--')[0];
        }
        this.props.tableTemplate.ChildData[index].Data.records[childIndex].map(p => {
          if (p.FIELD_NAME == specificData.FIELD_NAME) {
            p.FIELD_VALUE = e;
            p.DISPLAY_NAME = bb;
          }
        });
        //select选择后进行rtlink功能
        let cacheData = {};
        let recordSelectData = record;
        recordSelectData[specificData.FIELD_NAME] = e;

        cacheData.updatedField = specificData.FIELD_NAME;
        cacheData.identifier =
          specificData.FIELD_NAME + '-' + specificData.FIELD_VALUE + '-' + specificData.id;
        cacheData.identifierKey = record.key;
        cacheData.objectType = specificData.OBJECT_TYPE;
        cacheData.policyFormFields = [];
        // cacheData.policyFormFields.push(formFields)
        for (let i in recordSelectData) {
          let obj = {
            FIELD_NAME: i,
            FIELD_VALUE: recordSelectData[i],
          };
          cacheData.policyFormFields.push(obj);
        }
        cacheData.fieldGroupName = Columns.fieldGroupName;
        this.props.dispatch({
          type: 'tableTemplate/childUpdateFields',
          payload: { params: { list: [cacheData] } },
        });

        break;
    }
  };

  render() {
    const { disEditStyle } = this.props.tableTemplate
    const { getFieldDecorator } = this.props.form;
    const editChildFiles =
      this.props.tableTemplate.ChildData.length != 0
        ? this.props.tableTemplate.ChildData.map((value, index) => {
          //子表添加删除功能 ⬇️
          let columns = [
            {
              title: <Tooltip title={'操作'}>
                <span>操作</span>
              </Tooltip>,
              key: 'action',
              width: '30px',
              render: (text, record, deleteIndex) =>
                disEditStyle ? (
                  <span
                    style={{
                      width: '30px',
                      textAlign: 'center',
                      display: 'block',
                      color: '#3e90f7',
                      marginTop: '8px', marginBottom: '16px',
                    }}
                  >
                    <Icon
                      type="close"
                      style={{
                        cursor: 'not-allowed',
                        color: 'gray',
                      }}
                    />
                  </span>
                ) : (
                    <Popconfirm
                      key={index + text}
                      title="确定要删除该条数据吗?"
                      //deleteIndex:为子表中删除的某个字段下标；index:为要操作的子表的下标
                      onConfirm={() => this.popconfirmConfirm(record, deleteIndex, index)}
                      onCancel={this.popconfirmCancel}
                      okText="确定"
                      cancelText="取消"
                    >
                      <span
                        style={{
                          width: '30px',
                          textAlign: 'center',
                          display: 'block',
                          color: '#3e90f7',
                          marginTop: '8px', marginBottom: '16px',
                        }}
                      >
                        <Icon
                          type="close"
                          style={{
                            cursor: 'pointer',
                          }}
                        />
                      </span>
                    </Popconfirm>
                  ),
            },
          ];
          let Data = [];
          let MultiObjectSelector = null; //判断是否含有 MultiObjectSelector
          //子表数据
          value.Data.records.map(n => {
            let child = {};
            n.map(z => {
              child[z.FIELD_NAME] = z.FIELD_VALUE;
              child.key = z.key;
              child.id = z.id;
              child.objectType = z.OBJECT_TYPE; //添加OBJECT_TYPE放便后期删除
            });
            Data.push(child);
          });
          //子表表头
          value.Columns.fields.map((i, j) => {
            switch (i.type) {
              case 'Text':
                let columnsText = {
                  title: <Tooltip title={i.value + '[' + i.text + ']'}>
                    <span>{i.value}</span>
                  </Tooltip>,
                  dataIndex: i.text,
                  readOnlyCondition: i.readOnlyCondition, //只读管控
                  defaultValue:i.defaultValue,  //默认值
                  requiredCondition:i.requiredCondition, //是否必填
                  key: j + i.value,
                  text: i.text,
                  type: i.type,
                  value: i.value,
                  render: (text, record, childIndex) => {
                    let childRowData = []; //用于记录某行子表的数据
                    let specificData = {}; //用于记录具体的数据，方便后期添加管控
                    value.Data.records.map(h => {
                      h.map(i => {
                        if (i.key == record.key) {
                          childRowData = h;
                        }
                      });
                    });
                    childRowData.map(o => {
                      if (o.FIELD_NAME == i.text) {
                        specificData = o;
                      }
                    });
                    if (specificData.DISPLAY_CONDITION == false) return null;
                    return (
                      <div key={j + text}>
                        {disEditStyle ? ( //判断是否是可编辑状态 true为不可编辑
                          <span
                            key={text + index}
                            style={{ marginTop: '8px', marginBottom: '16px', display: 'inline-block' }}
                          >
                            {text}
                          </span>
                        ) : this.props.tableTemplate.isEditSave == true ||
                          this.props.tableTemplate.isEditSave == undefined ? ( //判断是否是新增的情况 true 为新增
                              <Form.Item style={{ width: '100%' }}>
                                {getFieldDecorator(`${record.key + i.value}`, {
                                  initialValue: specificData.DISPLAY_NAME
                                    ? specificData.DISPLAY_NAME
                                    : text,
                                  rules: [
                                    {
                                      required: specificData.REQUIRED_CONDITION,
                                      message: `${i.value}不能为空`,
                                    },
                                    ...formItemValid(i.pattern, i.value),
                                  ],
                                })(
                                  <Input
                                    style={{
                                      minWidth: '100px',
                                      border:
                                        !this.state.isRegex &&
                                          this.state.regesKey == record.key + i.value
                                          ? '1px solid red'
                                          : '',
                                    }}
                                    onBlur={e =>
                                      this.onChildChang(
                                        e,
                                        record,
                                        specificData,
                                        'targetValue',
                                        childIndex,
                                        index
                                      )
                                    }
                                    disabled={
                                      specificData.READ_ONLY_CONDITION
                                        ? specificData.READ_ONLY_CONDITION
                                        : i.readOnlyCondition
                                    }
                                  />
                                )}
                              </Form.Item>
                            ) : (
                              <Form.Item style={{ width: '100%' }}>
                                {getFieldDecorator(`${record.key + i.value}`, {
                                  initialValue: specificData.DISPLAY_NAME
                                    ? specificData.DISPLAY_NAME
                                    : text,
                                  rules: [
                                    {
                                      required: specificData.REQUIRED_CONDITION,
                                      message: `${i.value}不能为空`,
                                    },
                                    ...formItemValid(i.pattern, i.value),
                                  ],
                                })(
                                  <Input
                                    style={{ minWidth: '100px' }}
                                    onBlur={e =>
                                      this.onChildChang(
                                        e,
                                        record,
                                        specificData,
                                        'targetValue',
                                        childIndex,
                                        index
                                      )
                                    }
                                    disabled={
                                      specificData.READ_ONLY_CONDITION
                                        ? specificData.READ_ONLY_CONDITION
                                        : i.readOnlyCondition
                                    }
                                  />
                                )}
                              </Form.Item>
                            )}
                      </div>
                    );
                  },
                };
                if (i.displayCondition) {
                  //表头添加管控
                  columns.push(columnsText);
                }
                break;
              case 'Number':
                let columnsNumber = {
                  title: <Tooltip title={i.value + '[' + i.text + ']'}>
                    <span>{i.value}</span>
                  </Tooltip>,
                  dataIndex: i.text,
                  readOnlyCondition: i.readOnlyCondition,
                  defaultValue:i.defaultValue,  //默认值
                  requiredCondition:i.requiredCondition, //是否必填
                  key: j + i.value,
                  text: i.text,
                  type: i.type,
                  value: i.value,
                  render: (text, record, childIndex) => {
                    let childRowData = []; //用于记录某行子表的数据
                    let specificData = {}; //用于记录具体的数据，方便后期添加管控
                    value.Data.records.map(h => {
                      h.map(i => {
                        if (i.key == record.key) {
                          childRowData = h;
                        }
                      });
                    });
                    childRowData.map(o => {
                      if (o.FIELD_NAME == i.text) {
                        specificData = o;
                      }
                    });
                    if (specificData.DISPLAY_CONDITION == false) return null;
                    return (
                      <div key={j + text}>
                        {disEditStyle ? (
                          <span
                            key={text + index}
                            style={{
                              marginTop: '8px', marginBottom: '16px',
                              width: '100%',
                              marginTop: '8px', marginBottom: '16px',
                              display: 'inline-block',
                              textAlign: 'right',
                            }}
                          >
                            {specificData.DISPLAY_NAME ? specificData.DISPLAY_NAME : text}
                          </span>
                        ) : this.props.tableTemplate.isEditSave || this.props.tableTemplate.isEditSave == undefined ? (
                          <Form.Item style={{ width: '100%' }}>
                            {getFieldDecorator(`${record.key + i.value}`, {
                              initialValue: specificData.DISPLAY_NAME
                                ? specificData.DISPLAY_NAME
                                : text,
                              rules: [
                                {
                                  required: specificData.REQUIRED_CONDITION,
                                  message: `${i.value}不能为空`,
                                },
                                ...formItemValid(i.pattern, i.value),
                              ],
                            })(
                              <Input
                                type="number"
                                onChange={()=>{if(specificData.RELATED_FIELDS){
                                  e =>
                                  this.onChildChang(
                                    e.target.value,
                                    record,
                                    specificData,
                                    'NumberInput',
                                    childIndex,
                                    index,
                                    value.Columns, //表头数据
                                    value
                                    )
                                  }
                                }
                                }
                                onBlur={e => {
                                  this.autoFocusChange()
                                }}
                                autoFocus={this.state.autoFocus} //调用rtlink功能会丢失焦点，需要在这里自动获取下
                                style={{
                                  minWidth: '150px',
                                  textAlign: 'right',
                                  border:
                                    !this.state.isRegex &&
                                      this.state.regesKey == record.key + i.value
                                      ? '1px solid red'
                                      : '',
                                }}
                                disabled={
                                  specificData.READ_ONLY_CONDITION
                                    ? specificData.READ_ONLY_CONDITION
                                    : i.readOnlyCondition
                                }
                              />
                            )}
                          </Form.Item>
                        ) : (
                              <Form.Item style={{ width: '100%' }}>
                                {getFieldDecorator(`${record.key + i.value}`, {
                                  initialValue: specificData.DISPLAY_NAME
                                    ? specificData.DISPLAY_NAME
                                    : text,
                                  rules: [
                                    {
                                      required: specificData.REQUIRED_CONDITION,
                                      message: `${i.value}不能为空`,
                                    },
                                    ...formItemValid(i.pattern, i.value),
                                  ],
                                })(
                                  <Input
                                    // ref={this.ref}
                                    type="number"
                                    onChange={()=>{if(specificData.RELATED_FIELDS){
                                      e =>
                                      this.onChildChang(
                                        e.target.value,
                                        record,
                                        specificData,
                                        'NumberInput',
                                        childIndex,
                                        index,
                                        value.Columns, //表头数据
                                        value
                                        )
                                      }
                                    }
                                    }
                                    autoFocus={this.state.autoFocus}
                                    onBlur={e => {
                                      this.autoFocusChange()
                                    }}
                                    style={{
                                      minWidth: '150px',
                                      textAlign: 'right',
                                      border:
                                        !this.state.isRegex &&
                                          this.state.regesKey == record.key + i.value
                                          ? '1px solid red'
                                          : '',
                                    }}
                                    disabled={i.readOnlyCondition}
                                  />
                                )}
                              </Form.Item>
                            )}
                      </div>
                    );
                  },
                };
                if (i.displayCondition) {
                  columns.push(columnsNumber);
                }
                break;
              case 'MultiObjectSelector':
                MultiObjectSelector = i.text;
                let columnsMultiObjectSelector = {
                  title: <Tooltip title={i.value + '[' + i.text + ']'}>
                    <span>{i.value}</span>
                  </Tooltip>,
                  dataIndex: i.text,
                  readOnlyCondition: i.readOnlyCondition,
                  defaultValue:i.defaultValue,  //默认值
                  requiredCondition:i.requiredCondition, //是否必填
                  key: j + i.value,
                  text: i.text,
                  type: i.type,
                  value: i.value,
                  render: (text, record, childIndex) => {
                    let childRowData = []; //用于记录某行子表的数据
                    let specificData = {}; //用于记录具体的数据，方便后期添加管控
                    value.Data.records.map(h => {
                      h.map(i => {
                        if (i.key == record.key) {
                          childRowData = h;
                        }
                      });
                    });
                    childRowData.map(o => {
                      if (o.FIELD_NAME == i.text) {
                        specificData = o;
                      }
                    });
                    if (specificData.DISPLAY_CONDITION == false) return null;
                    return disEditStyle ? (
                      <span style={{ marginTop: '8px', marginBottom: '16px', display: 'inline-block' }}>
                        {specificData.DISPLAY_NAME ? specificData.DISPLAY_NAME : text}
                      </span>
                    ) : (
                        <Button
                          disabled={
                            specificData.READ_ONLY_CONDITION
                              ? specificData.READ_ONLY_CONDITION
                              : i.readOnlyCondition
                          } //精确到字段的管控
                          style={{ minWidth: '70px' }}
                          type="primary"
                        >
                          {specificData.DISPLAY_NAME ? specificData.DISPLAY_NAME : text}
                        </Button>
                      );
                  },
                };
                if (i.displayCondition) {
                  columns.push(columnsMultiObjectSelector);
                }
                break;
              case 'Select':
              case 'Reference':
              case 'ObjectType':
                let columnsSelect = {
                  title: <Tooltip title={i.value + '[' + i.text + ']'}>
                    <span>{i.value}</span>
                  </Tooltip>,
                  dataIndex: i.text,
                  readOnlyCondition: i.readOnlyCondition,
                  defaultValue:i.defaultValue,  //默认值
                  requiredCondition:i.requiredCondition, //是否必填
                  options: i.options,
                  key: j + i.value,
                  text: i.text,
                  type: i.type,
                  value: i.value,
                  render: (text, record, childIndex) => {
                    let childRowData = []; //用于记录某行子表的数据
                    let specificData = {}; //用于记录具体的数据，方便后期添加管控
                    let optionChild;
                    value.Data.records.map(h => {
                      h.map(z => {
                        if (z.key == record.key) {
                          childRowData = h;
                        }
                      });
                      childRowData.map(o => {
                        if (o.FIELD_NAME == i.text) {
                          specificData = o;
                        }
                      });
                      if (i.type != 'Select') {
                        const isExist = _.findIndex(
                          this.props.tableTemplate.selectChildOption,
                          function (z) {
                            return (
                              z.selectKey == specificData.key && z.field == specificData.FIELD_NAME
                            );
                          }
                        );
                        if (isExist == -1) {
                          optionChild = _.get(specificData, 'options', i.options).map((v, s) => {
                            return (
                              <Select.Option
                                value={v.value + '--' + v.text + '--' + s + j}
                                key={v.text + v.value}
                              >
                                {v.text}
                              </Select.Option>
                            );
                          });
                        } else {
                          optionChild = this.props.tableTemplate.selectChildOption[
                            isExist
                          ].options.map((v, s) => {
                            return (
                              <Select.Option
                                value={v.value + '--' + v.text + '--' + s + j}
                                key={v.text + v.value}
                              >
                                {v.text}
                              </Select.Option>
                            );
                          });
                        }
                      } else {
                        if (specificData.options) {
                          optionChild = specificData.options.map((v, s) => {
                            return (
                              <Select.Option value={v.value} key={v.text + v.value + s}>
                                {v.text}
                              </Select.Option>
                            );
                          });
                        } else {
                          optionChild = i.options.map((v, s) => {
                            return (
                              <Select.Option value={v.value} key={v.text + v.value + s}>
                                {v.text}
                              </Select.Option>
                            );
                          });
                        }
                      }
                    })
                    if (specificData.DISPLAY_CONDITION == false) return null;
                    return (
                      <div key={j + text}>
                        {disEditStyle ? (
                          <span
                            key={text + index}
                            style={{ marginTop: '8px', marginBottom: '16px', display: 'inline-block' }}
                          >
                            {specificData.DISPLAY_NAME ? specificData.DISPLAY_NAME : text}
                          </span>
                        ) : this.props.tableTemplate.isEditSave || this.props.tableTemplate.isEditSave == undefined ? (
                          <Select
                            onChange={e =>
                              this.onChildChang(
                                e,
                                record,
                                specificData,
                                'Select',
                                childIndex,
                                index,
                                value.Columns, //表头数据
                                value
                              )
                            }
                            showSearch={true}
                            allowClear
                            onSearch={e =>
                              this.onEditSearch(i, e, specificData.key, value.Columns)
                            }
                            filterOption={false}
                            placeholder="请输入查询内容!"
                            style={{ minWidth: '100px' }}
                            disabled={
                              specificData.READ_ONLY_CONDITION
                                ? specificData.READ_ONLY_CONDITION
                                : i.readOnlyCondition
                            } //精确到字段的管控
                            // disabled={i.readOnlyCondition}
                            defaultValue={
                              specificData.DISPLAY_NAME ? specificData.DISPLAY_NAME : text
                            }
                          >
                            {optionChild}
                          </Select>
                        ) : (
                              <Select
                                onChange={e =>
                                  this.onChildChang(
                                    e,
                                    record,
                                    specificData,
                                    'Select',
                                    childIndex,
                                    index,
                                    value.Columns, //表头数据
                                    value
                                  )
                                }
                                showSearch={true}
                                allowClear
                                onSearch={e =>
                                  this.onEditSearch(i, e, specificData.key, value.Columns)
                                }
                                filterOption={false}
                                placeholder="请输入查询内容!"
                                // onFocus={this.childSelectClick.bind(
                                //   this,
                                //   specificData,
                                //   value.Columns.key
                                // )}
                                style={{ minWidth: '100px' }}
                                defaultValue={
                                  specificData.DISPLAY_NAME ? specificData.DISPLAY_NAME : text
                                }
                                disabled={
                                  specificData.READ_ONLY_CONDITION
                                    ? specificData.READ_ONLY_CONDITION
                                    : i.readOnlyCondition
                                }
                              >
                                {optionChild}
                              </Select>
                            )}
                      </div>
                    );
                  },
                };
                if (i.displayCondition) {
                  columns.push(columnsSelect);
                }
                break;
              case 'Date':
              case 'DateTime':
                let columnsDate = {
                  title: <Tooltip title={i.value + '[' + i.text + ']'}>
                    <span>{i.value}</span>
                  </Tooltip>,
                  dataIndex: i.text,
                  readOnlyCondition: i.readOnlyCondition, //只读管控
                  defaultValue:i.defaultValue,  //默认值
                  requiredCondition:i.requiredCondition, //是否必填
                  key: j + i.value,
                  text: i.text,
                  type: i.type,
                  value: i.value,
                  render: (text, record, childIndex) => {
                    let childRowData = []; //用于记录某行子表的数据
                    let specificData = {}; //用于记录具体的数据，方便后期添加管控
                    value.Data.records.map(h => {
                      h.map(i => {
                        if (i.key == record.key) {
                          childRowData = h;
                        }
                      });
                    });
                    childRowData.map(o => {
                      if (o.FIELD_NAME == i.text) {
                        specificData = o;
                      }
                    });
                    if (specificData.DISPLAY_CONDITION == false) return null;
                    return (
                      <div key={j + text}>
                        {disEditStyle ? ( //判断是否是可编辑状态 true为不可编辑
                          <span
                            key={text + index}
                            style={{ marginTop: '8px', marginBottom: '16px', display: 'inline-block' }}
                          >
                            {specificData.FIELD_VALUE
                              ? moment(specificData.FIELD_VALUE * 1).format('YYYY/MM/DD')
                              : null}
                          </span>
                        ) : this.props.tableTemplate.isEditSave == true ||
                          this.props.tableTemplate.isEditSave == undefined ? ( //判断是否是新增的情况 true 为新增
                              <DatePicker
                                style={{ minWidth: '200px' }}
                                onChange={e =>
                                  this.onChildChang(
                                    e,
                                    record,
                                    specificData,
                                    'DateInput',
                                    childIndex,
                                    index
                                  )
                                }
                                defaultValue={
                                  specificData.FIELD_VALUE
                                    ? moment(specificData.FIELD_VALUE * 1)
                                    : null
                                }
                                format={i.type == 'Date' ? 'YYYY/MM/DD' : 'YYYY-MM-DD HH:mm:ss'}
                                disabled={
                                  specificData.READ_ONLY_CONDITION
                                    ? specificData.READ_ONLY_CONDITION
                                    : i.readOnlyCondition
                                } //精确到字段的管控
                              // disabled={i.readOnlyCondition} //针对某一列的管控
                              />
                            ) : (
                              <DatePicker
                                style={{ minWidth: '200px' }}
                                onChange={e =>
                                  this.onChildChang(
                                    e,
                                    record,
                                    specificData,
                                    'DateInput',
                                    childIndex,
                                    index
                                  )
                                }
                                defaultValue={
                                  specificData.FIELD_VALUE
                                    ? moment(specificData.FIELD_VALUE * 1)
                                    : null
                                }
                                format={i.type == 'Date' ? 'YYYY/MM/DD' : 'YYYY-MM-DD HH:mm:ss'}
                                disabled={
                                  specificData.READ_ONLY_CONDITION
                                    ? specificData.READ_ONLY_CONDITION
                                    : i.readOnlyCondition
                                } //精确到字段的管控
                              // disabled={i.readOnlyCondition}
                              />
                            )}
                      </div>
                    );
                  },
                };
                if (i.displayCondition) {
                  columns.push(columnsDate);
                }
                break;
              case 'Textarea':
                let columnsTextarea = {
                  title: <Tooltip title={i.value + '[' + i.text + ']'}>
                    <span>{i.value}</span>
                  </Tooltip>,
                  dataIndex: i.text,
                  readOnlyCondition: i.readOnlyCondition, //只读管控
                  defaultValue:i.defaultValue,  //默认值
                  requiredCondition:i.requiredCondition, //是否必填
                  key: j + i.value,
                  text: i.text,
                  type: i.type,
                  value: i.value,
                  render: (text, record, childIndex) => {
                    let childRowData = []; //用于记录某行子表的数据
                    let specificData = {}; //用于记录具体的数据，方便后期添加管控
                    value.Data.records.map(h => {
                      h.map(i => {
                        if (i.key == record.key) {
                          childRowData = h;
                        }
                      });
                    });
                    childRowData.map(o => {
                      if (o.FIELD_NAME == i.text) {
                        specificData = o;
                      }
                    });
                    if (specificData.DISPLAY_CONDITION == false) return null;
                    return (
                      <div key={j + text}>
                        {disEditStyle ? ( //判断是否是可编辑状态 true为不可编辑
                          <span
                            key={text + index}
                            style={{ marginTop: '8px', marginBottom: '16px', display: 'inline-block' }}
                          >
                            {text}
                          </span>
                        ) : this.props.tableTemplate.isEditSave == true ||
                          this.props.tableTemplate.isEditSave == undefined ? ( //判断是否是新增的情况 true 为新增
                              <TextArea
                                rows={1}
                                style={{ minWidth: '150px' }}
                                onChange={e =>
                                  this.onChildChang(
                                    e,
                                    record,
                                    specificData,
                                    'targetValue',
                                    childIndex,
                                    index
                                  )
                                }
                                defaultValue={
                                  specificData.DISPLAY_NAME ? specificData.DISPLAY_NAME : text
                                }
                                disabled={
                                  specificData.READ_ONLY_CONDITION
                                    ? specificData.READ_ONLY_CONDITION
                                    : i.readOnlyCondition
                                } //精确到字段的管控
                              />
                            ) : (
                              <TextArea
                                rows={1}
                                style={{ minWidth: '150px' }}
                                onChange={e =>
                                  this.onChildChang(
                                    e,
                                    record,
                                    specificData,
                                    'targetValue',
                                    childIndex,
                                    index
                                  )
                                }
                                defaultValue={
                                  specificData.DISPLAY_NAME ? specificData.DISPLAY_NAME : text
                                }
                                disabled={
                                  specificData.READ_ONLY_CONDITION
                                    ? specificData.READ_ONLY_CONDITION
                                    : i.readOnlyCondition
                                } //精确到字段的管控
                              />
                            )}
                      </div>
                    );
                  },
                };
                if (i.displayCondition) {
                  columns.push(columnsTextarea);
                }
                break;
            }
          });
          const TableForm = {
            MultiObjectSelector,
            HeaderData: value.Columns,
            dispatch: this.props.dispatch,
            data: Data,
            mask: value.Columns.mask,
            columns,
            value, //当前的那条子表数据
            disEditStyle,
            ...this.props.tableTemplate,
          };
          return (
            <TabPane tab={_.get(value, 'Columns.title')} key={index}>
              <div>
                <NTableForm {...TableForm} />
              </div>
            </TabPane>
          );
        })
        : this.props.tableTemplate.detailColumns.child != undefined
          ? this.props.tableTemplate.detailColumns.child.map((value, index) => {
            let MultiObjectSelector = null;
            let columns = [
              {
                title: '操作',
                key: 'action',
                render: (text, record, deleteIndex) => (
                  <Popconfirm
                    key={index + text}
                    title="确定要删除该条数据吗?"
                    onConfirm={() => this.popconfirmConfirm(record, deleteIndex, index)}
                    onCancel={this.popconfirmCancel}
                    okText="确定"
                    cancelText="取消"
                  >
                    <span
                      style={{
                        width: '30px',
                        textAlign: 'center',
                        display: 'block',
                        color: '#3e90f7',
                      }}
                    >
                      <Icon type="close" />
                    </span>
                  </Popconfirm>
                ),
              },
            ];
            value.fields.map(p => {
              if (p.type == 'MultiObjectSelector') {
                MultiObjectSelector = p.text;
              }
              p.title = p.value;
              columns.push(p);
            });
            let cacheData = {}; //缓存的值
            let temporaryData = {};
            cacheData.Columns = value;
            cacheData.Data = temporaryData;
            temporaryData.fieldGroupName = null;
            temporaryData.objectType = value.objectType;
            temporaryData.records = [];
            const TableForm = {
              MultiObjectSelector,
              data: this.props.tableTemplate.ChildData,
              columns,
              HeaderData: value,
              value: cacheData,
              mask: value.mask,
              dispatch: this.props.dispatch,
              disEditStyle,
              ...this.props.tableTemplate,
            };
            return (
              <TabPane tab={_.get(value, 'title', '子表')} key={index}>
                <div>
                  <NTableForm {...TableForm} />
                </div>
              </TabPane>
            );
          })
          : null;
    return (
      <Tabs  //新版test
        activeKey={this.props.tableTemplate.defaultActiveKey}
        onChange={this.tabCallback}
      >
        {editChildFiles}
      </Tabs>
    )
  }
}


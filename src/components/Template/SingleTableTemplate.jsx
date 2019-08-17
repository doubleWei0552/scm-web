import React from 'react';
import _ from 'lodash';
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
} from 'antd';
import styles from './SingleTableTemplate.less';
import moment from 'moment';

const { RangePicker } = DatePicker;

// 输入框使用form表单
class FromInput extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Form {...formItemLayout}>
        <Form.Item label="input">{getFieldDecorator('input', config)(<DatePicker />)}</Form.Item>
      </Form>
    );
  }
}

const WrappedTimeRelatedForm = Form.create({ name: 'formInput' })(FromInput);

@Form.create()
export default class SingleTableTemplate extends React.Component {
  static defaultProps = {
    //---列表页----
    tableTitle: '列表页', //列表页标题
    Breadcrumb: [{ title: '首页', href: '' }, { title: '基础设置', href: '' }], //列表页面包屑
    Search: [
      { type: 'Select', option: [{ title: '工商行政管理' }] },
      { type: 'Select', option: [{ title: '营业执照' }] },
      { type: 'Input', placeholder: '供应商' },
      { type: 'DatePicker' },
    ], //列表页搜索条件
    tableColumns: [], //列表页表头
    tableData: [], //列表页数据
    pagination: {}, //分页返回的数据

    //---详情页----
    buttonType: false, //详情页的按钮格式
    editTitle: '详情页', //详情页标题
    editBreadcrumb: [{ title: '首页', href: '' }, { title: '基础设置详情页', href: '' }], //列表页面包屑
  };
  state = {
    isEdit: false, //判断是不是详情页，默认不是详情页false
    selectedRowKeys: [], //选择的那个表格行数据
    selectData: {}, //选中的那一行数据
    buttonType: false, //详情页的按钮格式,false表示只有保存，取消按钮
    disEditStyle: true, //默认都不可编辑
    inputNull: false, //默认input输入框不为空
    isNewSave: false, //判断是不是列表页的新增，默认为false 不是
    isEditSave: false, //判断是不是详情页的新增，默认是false 不是
    disSelectDate: false, //判断是否让输入框为空，默认不为空
    visible: false, //用于控制modal是否显示
    warning: '确定执行本次操作？', //用于显示modal的提示信息
    modalEvent: null, //用于记录点击modal后执行的函数
    isOperate: false, //用于记录取消时，用户有没有进行过操作，默认没有操作（fasle）
    expand: false, // 用于搜索栏展开（true）/收起（false）
  };
  UNSAFE_componentWillMount = () => {
    const pageId = this.props.location.query.PageId;
    this.props.dispatch({ type: 'tableTemplate/save', payload: { pageId: +pageId } });
    // 进入请求分页数据,参数为默认值
    this.props.dispatch({
      type: 'tableTemplate/getPagination',
      payload: { pageId, current: 1, pageSize: 10 },
    });
  };
  componentDidMount = () => {
    this.props.dispatch({ type: 'tableTemplate/getDetailPageConfig' });
    this.props.dispatch({ type: 'tableTemplate/getSummaryPageConfig' });
    // this.props.dispatch({type:'tableTemplate/getPagelist'})
  };
  tableCreate = e => {
    let newState = {};
    for (let i in this.state) {
      if (i === 'visible') {
        newState[i] = this.state[i];
      } else {
        newState[i] = undefined;
      }
    }
    this.setState({
      ...newState,
      isEdit: true,
      buttonType: false,
      disEditStyle: false,
      isNewSave: true,
    });
    this.props.dispatch({
      type: 'tableTemplate/getDetailPage',
      payload: {
        ObjectType: this.props.tableTemplate.detailColumns.objectType,
        pageId: this.props.tableTemplate.pageId,
      },
    });
    this.props.dispatch({ type: 'tableTemplate/save', payload: { selectDate: {} } }); //新增时，清空输入框内的内容
  };
  tableDelete = () => {
    this.setState({ visible: true });
    this.props.dispatch({ type: 'tableTemplate/getRemoveBusiness' });
  };
  tableExport = e => {};
  onJump = e => {
    let newState = {};
    for (let i in this.state) {
      if (i === 'visible') {
        newState[i] = this.state[i];
      } else {
        newState[i] = undefined;
      }
    }
    this.setState({ disEditStyle: true });
    this.props.dispatch({ type: 'tableTemplate/save', payload: { selectDate: e } });
    this.props.dispatch({
      type: 'tableTemplate/getDetailPage',
      payload: { ID: e.ID, ObjectType: e.ObjectType, pageId: this.props.tableTemplate.pageId },
    });
    this.setState({ isEdit: true, buttonType: true, isNewSave: false });
  };
  //列表页数据选择
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.props.dispatch({
      type: 'tableTemplate/save',
      payload: { selectDataDelete: selectedRows },
    });
    this.setState({ selectedRowKeys, isEdit: false });
  };
  onEditChange = (title, e) => {
    this.setState({ [title]: e.target.value, isOperate: true });
  };
  onInputNumberChange = (title, e) => {
    this.setState({ [title]: e, isOperate: true });
  };
  onDateChange = (title, e) => {
    this.setState({ [title]: moment(e).valueOf(), isOperate: true });
  };
  //select事件
  selectClick = value => {
    this.props.dispatch({ type: 'tableTemplate/getAutocomplate', payload: { value } });
  };
  onEditSearch = (value, data) => {
    this.props.dispatch({
      type: 'tableTemplate/getAutocomplate',
      payload: { value, searchData: data },
    });
  };
  onEditSelectChange = (value, e) => {
    this.setState({ [value.text]: e, isOperate: true });
  };
  detailCreate = () => {
    //用于获取最新的组件的管控状态
    this.props.dispatch({
      type: 'tableTemplate/getDetailPage',
      payload: {
        ObjectType: this.props.tableTemplate.detailColumns.objectType,
        pageId: this.props.tableTemplate.pageId,
      },
    });
    let newState = {};
    for (let i in this.state) {
      if (i === 'visible') {
        newState[i] = this.state[i];
      } else {
        newState[i] = undefined;
      }
    }
    this.setState({
      buttonType: false,
      disEditStyle: false,
      disSelectDate: true,
      isEditSave: true,
    });
  };
  detailEdit = () => {
    this.setState({ disEditStyle: false, buttonType: false });
    if (JSON.stringify(this.props.tableTemplate.selectDate) == '{}') {
      this.setState({ isNewSave: false, isEditSave: false });
    }
    this.props.dispatch({
      type: 'tableTemplate/getDetailPage',
      payload: {
        ID:
          JSON.stringify(this.props.tableTemplate.selectDate) != '{}'
            ? this.props.tableTemplate.selectDate.ID
            : this.props.tableTemplate.ID,
        ObjectType:
          JSON.stringify(this.props.tableTemplate.selectDate) != '{}'
            ? this.props.tableTemplate.selectDate.ObjectType
            : this.props.tableTemplate.objectType,
        pageId: this.props.tableTemplate.pageId,
      },
    });
  };
  onCancled = () => {
    // 列表页新增过来的
    if (this.state.isNewSave) {
      this.setState({ isEdit: false, disEditStyle: true, buttonType: false });
    } else {
      // 点击编辑进入
      let newState = {};
      for (let i in this.state) {
        if (i === 'visible') {
          newState[i] = this.state[i];
        } else {
          newState[i] = undefined;
        }
      }
      this.setState({
        ...newState,
        isEdit: true,
        disEditStyle: true,
        buttonType: true,
        disSelectDate: false,
        isEditSave: false,
      });
      this.props.dispatch({
        type: 'tableTemplate/getDetailPage',
        payload: {
          ID: this.props.tableTemplate.selectDate.ID,
          ObjectType: this.props.tableTemplate.detailColumns.objectType,
          pageId: this.props.tableTemplate.pageId,
        },
      });
    }
  };
  onEditSave = value => {
    // 列表页新增过来的
    let params = this.state;
    _.mapKeys(this.state, (value, key) => {
      if (typeof value === 'string') {
        const arr = value.split('--');
        const newValue = arr[arr.length - 1];
        if (arr.length > 0) {
          params[key] = parseInt(newValue) ? parseInt(newValue) : newValue;
        }
      }
    });
    if (this.state.isNewSave) {
      this.props.dispatch({
        type: 'tableTemplate/getDetailSave',
        payload: { value: this.state, type: 'save' },
        callback: res => {
          if (res.status == 'success') {
            let newState = {};
            for (let i in this.state) {
              if (i === 'visible') {
                newState[i] = this.state[i];
              } else {
                newState[i] = undefined;
              }
            }
            this.setState({ isEdit: true, disEditStyle: true, buttonType: true, isNewSave: false });
            this.props.dispatch({
              type: 'tableTemplate/getDetailPage',
              payload: {
                ID: this.props.tableTemplate.selectDate.ID,
                ObjectType: this.props.tableTemplate.detailColumns.objectType,
                pageId: this.props.tableTemplate.pageId,
              },
            });
          }
        },
      });
    } else {
      // 详情页点击编辑进入,根据isEditSave判断是新增方法还是编辑方法
      if (this.state.isEditSave) {
        this.props.dispatch({
          type: 'tableTemplate/getDetailSave',
          payload: { value: this.state, type: 'save' },
          callback: res => {
            if (res.status == 'success') {
              let newState = {};
              for (let i in this.state) {
                if (i === 'visible') {
                  newState[i] = this.state[i];
                } else {
                  newState[i] = undefined;
                }
              }
              this.setState({ ...newState, isEdit: true, disEditStyle: true, buttonType: true });
              this.props.dispatch({
                type: 'tableTemplate/getDetailPage',
                payload: {
                  ID: this.props.tableTemplate.selectDate.ID,
                  ObjectType: this.props.tableTemplate.detailColumns.objectType,
                  pageId: this.props.tableTemplate.pageId,
                },
              });
            }
          },
        });
      } else {
        this.props.dispatch({
          type: 'tableTemplate/getDetailSave',
          payload: { value: this.state, type: 'edit' },
          callback: res => {
            if (res.status == 'success') {
              let newState = {};
              for (let i in this.state) {
                if (i === 'visible') {
                  newState[i] = this.state[i];
                } else {
                  newState[i] = undefined;
                }
              }
              this.setState({ ...newState, isEdit: true, disEditStyle: true, buttonType: true });
            }
          },
        });
      }
    }
  };
  detailDelete = () => {
    const businessId = this.props.tableTemplate.selectDate.ID;
    this.props.dispatch({
      type: 'tableTemplate/getRemoveBusiness',
      payload: { businessId },
      callback: res => {
        if (res.status == 'success') {
          this.setState({ isEdit: false });
        }
      },
    });
  };
  editBack = () => {
    this.setState({ buttonType: true, isEdit: false, disEditStyle: true });
  };
  onInputBlur = () => {};
  //详情页的自定义按钮事件
  onButtonEvent = e => {
    this.props.dispatch({ type: 'tableTemplate/getTransactionProcess', payload: { Buttons: e } });
    this.props.dispatch({
      type: 'tableTemplate/getDetailPage',
      payload: {
        ID: this.props.tableTemplate.selectDate.ID,
        ObjectType: this.props.tableTemplate.detailColumns.objectType,
        pageId: this.props.tableTemplate.pageId,
      },
    });
  };
  //分页的函数
  onShowSizeChange = (current, pageSize) => {
    let pageId = this.props.tableTemplate.pageId;
    this.props.dispatch({
      type: 'tableTemplate/getPagination',
      payload: { pageId, current, pageSize },
    });
  };
  onPageChange = (page, pageSize) => {
    let pageId = this.props.tableTemplate.pageId;
    let current = page;
    this.props.dispatch({
      type: 'tableTemplate/getPagination',
      payload: { pageId, current, pageSize },
    });
  };
  //modal的函数
  showModal = (e, i) => {
    this.setState({
      visible: true,
      modalEvent: e,
      warning: i,
    });
  };
  handleOk = e => {
    if (this.state.modalEvent == 'tableDelete') {
      this.tableDelete();
    } else if (this.state.modalEvent == 'detailDelete') {
      this.detailDelete();
    } else if (this.state.modalEvent == 'onCancled') {
      this.onCancled();
    }
    this.setState({
      visible: false,
    });
  };
  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  handleSearch = e => {
    const pageId = this.props.location.query.PageId;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let searchParams = {};
      _.mapKeys(values, (value, key) => {
        if (value) {
          searchParams = _.assign(searchParams, { [key]: value });
        }
        return;
      });
      this.props.dispatch({
        type: 'tableTemplate/getPagination',
        payload: { pageId, current: 1, pageSize: 10, searchParams },
      });
    });
  };

  //列表页顶部搜索部分
  renderSearchForm = props => {
    const searchItems = _.filter(props, item => item.filterable === 'true');
    const count = this.state.expand
      ? searchItems.length
      : searchItems.length > 2
      ? 2
      : searchItems.length;
    const { getFieldDecorator } = this.props.form;
    const { currentKey, selectOption = [] } = this.props.tableTemplate;
    return (
      <Row>
        <Form onSubmit={this.handleSearch} layout="inline" className="login-form">
          <Col span={6}>
            <Form.Item>
              <Button onClick={this.tableCreate} style={{ marginRight: '5px' }} type="primary">
                新增
              </Button>
              <Button
                onClick={() => this.showModal('tableDelete', '确定要删除这些数据么？')}
                style={{ marginRight: '5px' }}
              >
                删除
              </Button>
              <Button onClick={this.tableExport} style={{ marginRight: '5px' }}>
                导出
              </Button>
            </Form.Item>
          </Col>
          {searchItems.length > 0 &&
            searchItems.map((value, index) => {
              if (value.widgetType === 'Select' && value.filterable === 'true') {
                // const optionChild = value.option.map((v,i)=>{
                //     return <Select.Option value={v.title} key={i}>{v.title}</Select.Option>
                // })
                return (
                  <Col span={6} key={value.dataIndex}>
                    <Form.Item
                      label={value.title}
                      style={{ display: index < count ? 'block' : 'none', marginRight: 0 }}
                    >
                      {getFieldDecorator(`${value.dataIndex}`, {})(
                        <Select
                          placeholder={`请选择${value.title}`}
                          style={{ minWidth: '165px' }}
                          onFocus={this.selectClick.bind(this, {
                            text: value.dataIndex,
                            key: currentKey,
                            value: null,
                          })}
                        >
                          {selectOption.length > 0
                            ? _.map(selectOption, (item, index) => {
                                return (
                                  <Select.Option key={item.value + item.text} value={item.value}>
                                    {item.text}
                                  </Select.Option>
                                );
                              })
                            : null}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                );
              } else if (value.widgetType === 'DatePicker' && value.filterable === 'true') {
                return (
                  <Col span={6} key={value.dataIndex}>
                    <Form.Item>
                      {getFieldDecorator(`${value.dataIndex}`, {})(
                        <RangePicker
                          defaultValue={[
                            moment('2015/01/01', dateFormat),
                            moment('2015/01/01', dateFormat),
                          ]}
                          format={dateFormat}
                        />
                      )}
                    </Form.Item>
                  </Col>
                );
              } else if (value.widgetType === 'Text' && value.filterable === 'true') {
                return (
                  <Col span={6} key={value.dataIndex}>
                    <Form.Item label={value.title}>
                      {getFieldDecorator(`${value.dataIndex}`, {})(
                        <Input placeholder={`请输入${value.title}`} />
                      )}
                    </Form.Item>
                  </Col>
                );
              } else if (value.widgetType === 'Number' && value.filterable === 'true') {
                return (
                  <Col span={6} key={value.dataIndex}>
                    <Form.Item label={value.title}>
                      {getFieldDecorator(`${value.dataIndex}`, {})(
                        <Input type="number" placeholder={`请输入${value.title}`} />
                      )}
                    </Form.Item>
                  </Col>
                );
              }
            })}
          {searchItems.length > 0 && (
            <Col span={6}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  <Icon type="search" />
                </Button>
                <span style={{ display: 'inlineblock', padding: '8px' }}>
                  <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
                    <Icon type={this.state.expand ? 'up' : 'down'} />
                  </a>
                </span>
              </Form.Item>
            </Col>
          )}
        </Form>
      </Row>
    );
  };

  render() {
    //列表页的表头，添加超链接功能
    this.props.tableTemplate.tableColumns.length != 0
      ? (this.props.tableTemplate.tableColumns[0].render = (text, record) => {
          return <a onClick={this.onJump.bind(this, record)}>{text}</a>;
        })
      : [];

    const { selectedRowKeys } = this.state;
    const dateFormat = 'YYYY/MM/DD';
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',
        name: record.name,
      }),
    };
    //列表页面包屑
    const Breadcrumbchild = this.props.Breadcrumb.map((value, index) => {
      return <Breadcrumb.Item key={index}>{value.title}</Breadcrumb.Item>;
    });
    //详情页面包屑
    const editBreadcrumbchild = this.props.editBreadcrumb.map((value, index) => {
      return <Breadcrumb.Item key={index}>{value.title}</Breadcrumb.Item>;
    });

    //详情页按钮字断
    const editButton =
      this.props.tableTemplate.detailData.length != 0
        ? this.props.tableTemplate.detailData.buttons.map((value, index) => {
            return (
              <Button
                disabled={value.READ_ONLY_CONDITION}
                onClick={() => this.onButtonEvent(value)}
                key={index}
                style={{
                  marginRight: '10px',
                  display: value.DISPLAY_CONDITION ? 'inline-block' : 'none',
                }}
              >
                {value.LABEL}
              </Button>
            );
          })
        : null;
    // console.log('循环的表头',this.props.tableTemplate.detailColumns.fields)
    // console.log('循环的数据',this.props.tableTemplate.detailData.policyFormFields)
    // console.log(this.state)
    const editFiles =
      this.props.tableTemplate.detailColumns.length != 0
        ? this.props.tableTemplate.detailColumns.fields.map((value, index) => {
            if (this.props.tableTemplate.detailData.length != 0) {
              if (value.type == 'Text') {
                var dataState;
                this.props.tableTemplate.detailData.policyFormFields.map((j, k) => {
                  if (j.FIELD_NAME == value.text) {
                    dataState = j;
                  }
                });
                // console.log('管控子段',dataState)
                return (
                  <Col
                    key={index}
                    span={10}
                    style={{
                      margin: '5px 0',
                      display:
                        dataState == undefined
                          ? 'block'
                          : dataState.DISPLAY_CONDITION
                          ? 'block'
                          : 'none',
                    }}
                  >
                    <span
                      style={{
                        width: '30%',
                        height: '32px',
                        lineHeight: '32px',
                        display: 'block',
                        float: 'left',
                        textAlign: 'right',
                        paddingRight: '10px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      <span
                        style={{
                          display:
                            dataState == undefined
                              ? 'inline'
                              : dataState.REQUIRED_CONDITION
                              ? 'inline'
                              : 'none',
                          color: 'red',
                        }}
                      >
                        *
                      </span>
                      {value.value}
                    </span>
                    {/* <Tooltip visible title="注意这是必填字断！"> */}
                    <Input
                      onBlur={this.onInputBlur}
                      disabled={this.state.disEditStyle ? true : dataState.READ_ONLY_CONDITION}
                      // value={this.state.disSelectDate ? this.state[value.value] : (this.state[value.value] === undefined ? this.props.tableTemplate.selectDate[value.text] : this.state[value.value])}
                      value={
                        this.state.disSelectDate
                          ? this.state[value.text]
                          : this.state[value.text] === undefined
                          ? this.props.tableTemplate.selectDate[value.text]
                          : this.state[value.text]
                      }
                      onChange={this.onEditChange.bind(this, value.text)}
                      style={{ width: '70%', float: 'left' }}
                    />
                    {/* </Tooltip> */}
                  </Col>
                );
              } else if (value.type == 'Select') {
                let defaultValue;
                // const optionChild = value.options.map((v,i)=>{
                //     return <Select.Option value={v.value} key={i}>{v.text}</Select.Option>
                // })
                let optionChild;
                if (this.props.tableTemplate.selectOption != null) {
                  optionChild = this.props.tableTemplate.selectOption.map((v, i) => {
                    return (
                      <Select.Option value={`${v.text}--${v.value}`} key={`${_.now()}${i}`}>
                        {v.text}
                      </Select.Option>
                    );
                  });
                }
                let selectState;
                // console.log(this.props.tableTemplate.detailData.policyFormFields)
                // console.log(value.text)
                this.props.tableTemplate.detailData.policyFormFields.map((j, k) => {
                  if (j.FIELD_NAME == value.text) {
                    selectState = j;
                  }
                });
                // console.log(selectState)
                // if(selectState.options != undefined){
                //     selectState.options.map((i,j)=>{
                //         if(i.value == selectState.FIELD_VALUE){
                //             defaultValue = i.text
                //         }
                //     })
                // }
                // console.log(this.props.tableTemplate.selectDate,value.text)
                // console.log(selectState.DISPLAY_NAME,this.state[value.text],this.props.tableTemplate.selectDate[value.text])
                if (!selectState) return;
                return (
                  <Col
                    key={index}
                    span={10}
                    style={{
                      margin: '5px 0',
                      display:
                        selectState == undefined
                          ? 'block'
                          : selectState.DISPLAY_CONDITION
                          ? 'block'
                          : 'none',
                    }}
                  >
                    <span
                      style={{
                        width: '30%',
                        height: '32px',
                        lineHeight: '32px',
                        display: 'block',
                        float: 'left',
                        textAlign: 'right',
                        paddingRight: '10px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      <span
                        style={{
                          display:
                            selectState == undefined
                              ? 'inline'
                              : selectState.REQUIRED_CONDITION
                              ? 'inline'
                              : 'none',
                          color: 'red',
                        }}
                      >
                        *
                      </span>
                      {value.value}
                    </span>
                    <Select
                      placeholder="请选择下拉框"
                      onFocus={this.selectClick.bind(this, value)}
                      showSearch={true}
                      onSearch={this.onEditSearch.bind(this, value)}
                      filterOption={false}
                      value={
                        this.state.disSelectDate
                          ? selectState.DISPLAY_NAME != undefined
                            ? selectState.DISPLAY_NAME
                            : this.state[value.text]
                          : this.state[value.text] === undefined
                          ? selectState.DISPLAY_NAME
                          : this.state[value.text]
                      }
                      // value={
                      //   this.state.disSelectDate
                      //     ? selectState.DISPLAY_NAME != undefined
                      //       ? selectState.DISPLAY_NAME
                      //       : this.state[value.text]
                      //     : this.state[value.text] === undefined
                      //     ? this.props.tableTemplate.selectDate[value.text] == undefined &&
                      //       selectState.DISPLAY_NAME != undefined
                      //       ? this.props.tableTemplate.selectDate[value.text]
                      //       : selectState.DISPLAY_NAME
                      //     : this.state[value.text]
                      // }
                      disabled={this.state.disEditStyle ? true : selectState.READ_ONLY_CONDITION}
                      onChange={e => this.onEditSelectChange(value, e)}
                      style={{ width: '70%', float: 'left' }}
                    >
                      <Select.Option style={{ height: '2em' }} value={null} key={-1}>
                        {''}
                      </Select.Option>
                      {optionChild}
                    </Select>
                  </Col>
                );
              } else if (value.type == 'Date') {
                let dateValue;
                this.props.tableTemplate.detailData.policyFormFields.map((j, k) => {
                  if (j.FIELD_NAME == value.text) {
                    dateValue = j;
                  }
                });
                if (!dateValue) return;
                return (
                  <Col
                    key={index}
                    span={10}
                    style={{
                      margin: '5px 0',
                      display:
                        dateValue == undefined
                          ? 'block'
                          : dateValue.DISPLAY_CONDITION
                          ? 'block'
                          : 'none',
                    }}
                  >
                    <span
                      style={{
                        width: '30%',
                        height: '32px',
                        lineHeight: '32px',
                        display: 'block',
                        float: 'left',
                        textAlign: 'right',
                        paddingRight: '10px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      <span
                        style={{
                          display:
                            dateValue == undefined
                              ? 'inline'
                              : dateValue.REQUIRED_CONDITION
                              ? 'inline'
                              : 'none',
                          color: 'red',
                        }}
                      >
                        *
                      </span>
                      {value.value}
                    </span>
                    <DatePicker
                      disabled={this.state.disEditStyle ? true : dateValue.READ_ONLY_CONDITION}
                      onChange={this.onDateChange.bind(this, value.text)}
                      value={
                        this.state.disSelectDate
                          ? dateValue.DISPLAY_NAME != undefined
                            ? dateValue.DISPLAY_NAME == 'null'
                              ? null
                              : moment(dateValue.DISPLAY_NAME)
                            : moment(this.state[value.text])
                          : this.state[value.text] == undefined
                          ? dateValue.DISPLAY_NAME == 'null'
                            ? null
                            : moment(dateValue.DISPLAY_NAME)
                          : moment(this.state[value.text])
                      }
                      format={dateFormat}
                      style={{ width: '70%', float: 'left' }}
                    />
                  </Col>
                );
              } else if (value.type == 'Number') {
                var numberState;
                this.props.tableTemplate.detailData.policyFormFields.map((j, k) => {
                  // console.log(value)
                  // console.log(j.FIELD_NAME,value.text)
                  if (j.FIELD_NAME == value.text) {
                    numberState = j;
                  }
                });
                return (
                  <Col
                    key={index}
                    span={10}
                    style={{
                      margin: '5px 0',
                      display:
                        numberState == undefined
                          ? 'block'
                          : numberState.DISPLAY_CONDITION
                          ? 'block'
                          : 'none',
                    }}
                  >
                    <span
                      style={{
                        width: '30%',
                        height: '32px',
                        lineHeight: '32px',
                        display: 'block',
                        float: 'left',
                        textAlign: 'right',
                        paddingRight: '10px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      <span
                        style={{
                          display:
                            numberState == undefined
                              ? 'inline'
                              : numberState.REQUIRED_CONDITION
                              ? 'inline'
                              : 'none',
                          color: 'red',
                        }}
                      >
                        *
                      </span>
                      {value.value}
                    </span>
                    {/* <Tooltip visible title="注意这是必填字断！"> */}
                    <InputNumber
                      onBlur={this.onInputBlur}
                      disabled={this.state.disEditStyle ? true : numberState.READ_ONLY_CONDITION}
                      value={
                        this.state.disSelectDate
                          ? this.state[value.text]
                          : this.state[value.text] == undefined
                          ? this.props.tableTemplate.selectDate[value.text]
                          : this.state[value.text]
                      }
                      onChange={this.onInputNumberChange.bind(this, value.text)}
                      style={{ width: '70%', float: 'left' }}
                    />
                    {/* </Tooltip> */}
                  </Col>
                );
              }
            }
          })
        : null;
    return (
      <div className={styles.SingleTableTemplateMain}>
        {/* 列表页 */}
        <div
          style={{ display: this.state.isEdit ? 'none' : 'block' }}
          className={styles.SingleTable}
        >
          <header className={styles.header}>
            <span className={styles.tableTitle}>{this.props.tableTitle}</span>
            <Breadcrumb className={styles.tableBreadcrumb}>{Breadcrumbchild}</Breadcrumb>
          </header>
          <hr style={{ backgroundColor: 'lightgray', height: '1px', border: 'none' }} />
          <div className="BasicDataBody" style={{ minHeight: '35px', display: 'flex' }}>
            {/* <div className='BasicDataButton' style={{float:'left',width:'30%', paddingTop: '4px'}}>
                            <Button onClick={this.tableCreate} style={{marginRight:'5px'}} type="primary">新增</Button>
                            <Button onClick={()=>this.showModal('tableDelete','确定要删除这些数据么？')} style={{marginRight:'5px'}}>删除</Button>
                            <Button onClick={this.tableExport} style={{marginRight:'5px'}} >导出</Button>
                        </div> */}
            <div className="BasicDataSearch" style={{ float: 'right', width: '100%' }}>
              {<div>{this.renderSearchForm(this.props.tableTemplate.tableColumns)}</div>}
            </div>
          </div>
          <hr style={{ backgroundColor: 'lightgray', height: '1px', border: 'none' }} />
          <div>
            <Table
              rowSelection={rowSelection}
              bordered
              scroll={{ x: true }}
              onRow={(e, record) => {
                return {
                  onDoubleClick: () => {
                    this.onJump(e, record);
                  },
                };
              }}
              columns={this.props.tableTemplate.tableColumns}
              dataSource={this.props.tableTemplate.pagination.list}
              pagination={{
                showSizeChanger: true,
                total: this.props.tableTemplate.pagination.totalRecord,
                current: this.props.tableTemplate.pagination.currentPage,
                pageSize: this.props.tableTemplate.pagination.pageSize,
                pageSizeOptions: ['10', '20', '30', '50', '100'],
                onShowSizeChange: this.onShowSizeChange,
                onChange: this.onPageChange,
                showTotal: total => `共${this.props.tableTemplate.pagination.totalRecord}条数据`,
              }}
            />
          </div>
        </div>
        {/* 详情页 */}
        {this.props.tableTemplate.detailColumns.length != 0 && (
          <div
            style={{ display: this.state.isEdit ? 'block' : 'none' }}
            className={styles.SingleTableDetail}
          >
            <header className={styles.header}>
              <span className={styles.tableTitle}>{this.props.editTitle}</span>
              <Breadcrumb className={styles.tableBreadcrumb}>{editBreadcrumbchild}</Breadcrumb>
            </header>
            <hr style={{ backgroundColor: 'lightgray', height: '1px', border: 'none' }} />
            <div
              className="BasicEditBody"
              style={{ display: this.state.buttonType ? 'block' : 'none' }}
            >
              <Button style={{ marginRight: '10px' }} onClick={this.detailCreate} type="primary">
                新增
              </Button>
              <Button style={{ marginRight: '10px' }} onClick={this.detailEdit}>
                编辑
              </Button>
              <Button
                style={{ marginRight: '10px' }}
                onClick={() => this.showModal('detailDelete', '确定要删除这条数据么？')}
              >
                删除
              </Button>
              {editButton}
              <Button style={{ marginRight: '10px' }} onClick={this.editBack}>
                返回
              </Button>
            </div>
            <div
              className="BasicEditBody"
              style={{ display: this.state.buttonType ? 'none' : 'block' }}
            >
              <Button
                onClick={() => this.onEditSave()}
                style={{ marginRight: '10px' }}
                type="primary"
              >
                保存
              </Button>
              <Button
                style={{ marginRight: '10px' }}
                onClick={
                  this.state.isOperate
                    ? () => this.showModal('onCancled', '确定要取消本次操作？')
                    : this.onCancled
                }
              >
                取消
              </Button>
            </div>
            <hr style={{ backgroundColor: 'lightgray', height: '1px', border: 'none' }} />
            <div className="BasicEditSearch">
              <span style={{ fontSize: '1.2rem' }}>{this.props.subtitle}</span>
              <Row>{editFiles}</Row>
            </div>
          </div>
        )}
        <Modal
          title="提示！"
          closable={false}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>{this.state.warning}</p>
        </Modal>
      </div>
    );
  }
}

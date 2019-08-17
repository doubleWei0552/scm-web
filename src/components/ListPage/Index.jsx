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
  Spin,
} from 'antd';
import RichEditor from '../BraftEditor/index';
import TableForm from '../TableForm/Index'; //子表table组件
import NTableForm from '../TableForm/TableForm';
import moment from 'moment';
import _ from 'lodash';
import styles from './Index.less';
const { RangePicker } = DatePicker

const SearchOptions = {}
// 子表列表页组件
@Form.create()
export default class ListPage extends React.Component {
  static defaultProps = {
    //---列表页----
    tableTitle: '新增子表', //列表页标题
    tableColumns: [], //列表页表头
    tableData: [], //列表页数据
  };
  state = {
    frameSelectedRowKeys: [], //选择的那个表格行数据
    visible: false, //用于控制modal是否显示
    warning: '确定执行本次操作？', //用于显示modal的提示信息
    modalEvent: null, //用于记录点击modal后执行的函数
    Data: [], //用于子表展示的数据
    expand: false,
    frameColumns: [], //弹框的表格表头
    frameData: [], //弹框的表格数据
    loading: true, // 弹框的loading
    searchData: [], //搜索框的参数
  };
  UNSAFE_componentWillMount = () => {
    let props = this.props.frameColumns.columns
    const searchItems = _.filter(props, item => item.filterable == true);
    const { currentKey } = this.props.tableTemplate
    if(searchItems.length > 0){
      searchItems.map((value, index) => {
        // console.log('value',value)
          if (
            value.widgetType === 'Select' ||
            value.widgetType === 'Reference' ||
            value.widgetType === 'ObjectSelector'
          ){
            this.getSearchBarOptions({ key: value.unique, text: value.dataIndex });
          }
      })
    }
  }
  UNSAFE_componentWillReceiveProps = newProps => {
    let { frameColumns, frameData, framePagination } = newProps;
    let listColumnData = [];
    !_.isEmpty(frameColumns) ? frameColumns.columns.map((item,index)=>{
      if (item.colorMark) {
        let list = {
          ...item,
          title: <Tooltip title={item.title + '[' + item.dataIndex + ']'}>
            <span>{item.title}</span>
          </Tooltip>,
          render: (text, record) => {
            if (!text) return;
            let color = text.split('-')[0];
            let newText = text.split('-')[text.split('-').length - 1];
            return (
              <span>
                <span
                  style={{
                    display: 'inline-block',
                    background: color,
                    width: '6px',
                    height: '6px',
                    marginRight: '5px',
                    marginBottom: '2px',
                    borderRadius: '50%',
                  }}
                />
                {newText}
              </span>
            );
          },
        };
        listColumnData.push(list);
      } else {
        let otherList = {
          ...item,
          title: <Tooltip title={item.title + '[' + item.dataIndex + ']'}>
            <span>{item.title}</span>
          </Tooltip>
        }
        listColumnData.push(otherList)
      }
    }) : null
    this.setState({
      frameColumns: listColumnData,
      frameData: framePagination.list,
      loading: false,
    });
  };
  tableExport = e => { };
  //列表页数据选择
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ frameSelectedRowKeys: selectedRowKeys });
  };
  onClearSelect = () => {
    this.setState({
      frameSelectedRowKeys: []
    })
  }
  onEditChange = (title, e) => {
    this.setState({ [title]: e.target.value });
  };
  onInputBlur = () => { };
  //分页的函数
  onShowSizeChange = (current, pageSize) => {
    let pageId = this.props.frameColumns.pageId;
    let { multiGroupName, multiObjectType } = this.props.HeaderData;
    this.props.dispatch({
      type: 'tableTemplate/getDetailList',
      payload: { pageId, multiGroupName, multiObjectType, pageSize: pageSize, current },
    });
  };
  onPageChange = (page, pageSize) => {
    let { multiGroupName, multiObjectType } = this.props.HeaderData;
    let pageId = this.props.frameColumns.pageId;
    let current = page;
    let searchParams = this.state.searchData
    this.props.dispatch({
      type: 'tableTemplate/getDetailList',
      payload: { pageId,searchParams, multiGroupName, multiObjectType, pageSize: pageSize, pageNum: page },
    });
  };
  //select事件
  selectClick = (e, value) => {
    if (!e) {
      value.FIELD_VALUE = '';
    }
    this.props.dispatch({ type: 'tableTemplate/getAutocomplate', payload: { value } });
  };
  //modal的函数
  showModal = (e, i) => {
    this.setState({
      visible: true,
      modalEvent: e,
      warning: i,
    });
  };

  getSearchBarOptions = e => {
    let options = [];
    this.props.dispatch({
      type: 'tableTemplate/getAutocomplate',
      payload: { value: e },
      callback: response => {
        if (response.status === 'success') {
          options = response.data.options;
          SearchOptions[response.data.field] = response.data.options;
        }
      },
    });
    return options;
  };

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  handleSearch = e => {
    let pageId = this.props.frameColumns.pageId;
    let { multiGroupName, multiObjectType } = this.props.HeaderData;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let searchParams = {};
      _.mapKeys(values, (value, key) => {
        if (value) {
          searchParams = _.assign(searchParams, { [key]: value });
        }
        return;
      })
      this.setState({
        searchData:searchParams
      })
      this.props.dispatch({
        type: 'tableTemplate/getDetailList',
        payload: { pageId, multiGroupName, multiObjectType, current: 1, pageSize: 10, searchParams },
      });
    });
  };

  //列表页顶部搜索部分
  renderSearchForm = (props = []) => {
    // console.log('搜索模块表头数据',props,'this.props',this.props,this.props.currentKey, this.props.selectOption)
    const searchItems = _.filter(props, item => item.filterable == true);
    const count = this.state.expand
      ? searchItems.length
      : searchItems.length > 2
        ? 2
        : searchItems.length;
    const { getFieldDecorator } = this.props.form;
    const { currentKey, selectOption = [] } = this.props;
    return (
      <Row>
        <Form
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end' }}
          onSubmit={this.handleSearch}
          layout="inline"
          className="login-form"
        >
          {searchItems.length > 0 &&
            searchItems.map((value, index) => {
              if (index >= count) return;
              if (
                value.widgetType === 'Select' ||
                value.widgetType === 'Reference' ||
                value.widgetType === 'ObjectSelector'
              ) {
                return (
                  <Col span={8} key={value.dataIndex} style={{ textAlign: 'right' }}>
                    <Form.Item
                      label={value.title}
                      style={{ display: index < count ? '' : 'none', display: 'flex' }}
                      key={value.dataIndex}
                    >
                      {getFieldDecorator(`${value.dataIndex}`, {})(
                        <Select
                          placeholder={`请选择${value.title}`}
                          style={{ width: '165px', textOverflow: 'ellipsis' }}
                          onFocus={this.selectClick.bind(this, {
                            text: value.dataIndex,
                            key: currentKey,
                            value: null,
                          })}
                          allowClear
                          showSearch
                          filterOption={(inputValue, option) =>
                            _.includes(option.props.children, inputValue)
                          }
                        >
                          {SearchOptions[value.dataIndex] &&
                              SearchOptions[value.dataIndex].length > 0
                              ? _.map(SearchOptions[value.dataIndex], (item, index) => {
                                return (
                                  <Select.Option
                                    title={item.text}
                                    key={item.value + item.text}
                                    value={item.value}
                                  >
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
              } else if (value.widgetType === 'DateTime') {
                return (
                  <Col span={13} key={value.dataIndex}>
                    <Form.Item
                      label={value.title}
                      key={value.dataIndex}
                      // {...formItemLayout}
                      style={{ marginRight: 0, display: 'flex' }}
                    >
                      {getFieldDecorator(`${value.dataIndex}`, {})(
                        <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />
                      )}
                    </Form.Item>
                  </Col>
                );
              } else if (value.widgetType === 'Text') {
                return (
                  <Col span={8} key={value.dataIndex} style={{ textAlign: 'right' }}>
                    <Form.Item
                      label={value.title}
                      key={value.dataIndex}
                      // {...formItemLayout}
                      style={{ marginRight: 0, display: 'flex' }}
                    >
                      {getFieldDecorator(`${value.dataIndex}`, {})(
                        <Input
                          placeholder={`请输入${value.title}`}
                          style={{ width: '165px', textOverflow: 'ellipsis' }}
                        />
                      )}
                    </Form.Item>
                  </Col>
                );
              } else if (value.widgetType === 'Number') {
                return (
                  <Col span={8} key={value.dataIndex} style={{ textAlign: 'right' }}>
                    <Form.Item
                      label={value.title}
                      key={value.dataIndex}
                      // {...formItemLayout}
                      style={{ marginRight: 0, display: 'flex' }}
                    >
                      {getFieldDecorator(`${value.dataIndex}`, {})(
                        <Input
                          type="number"
                          placeholder={`请输入${value.title}`}
                          style={{ width: '165px', textOverflow: 'ellipsis' }}
                        />
                      )}
                    </Form.Item>
                  </Col>
                );
              }
            })}
          {searchItems.length > 0 && (
            <Col span={3} style={{ textAlign: 'left' }}>
              <Form.Item style={{ marginRight: 0 }}>
                <Button type="default" htmlType="submit">
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
    console.log('选择的值',this.state.frameSelectedRowKeys)
    const { RangePicker } = DatePicker;
    const dateFormat = 'YYYY/MM/DD';
    const { frameSelectedRowKeys } = this.props;
    const rowSelection = {
      selectedRowKeys: frameSelectedRowKeys,
      onChange: this.props.onSelectChange
    }
    return (
      <div>
        <div className={styles.SingleTable}>
          <header className={styles.header}>
            <span style={{ fontSize: '1.3rem' }}>{this.props.tableTitle}</span>
          </header>
          <hr style={{ backgroundColor: 'lightgray', height: '1px', border: 'none' }} />
          {/* 搜索模块 */}
          <div className="BasicDataBody" style={{ minHeight: '35px', display: 'flex' }}>
            <div className="BasicDataSearch" style={{ float: 'right', width: '100%' }}>
              {<div>{this.renderSearchForm(this.props.frameColumns.columns)}</div>}
            </div>
          </div>
          <hr style={{ backgroundColor: 'lightgray', height: '1px', border: 'none' }} />
          <div>
            <Spin tip="Loading..." spinning={this.state.loading}>
              <Table
                rowSelection={rowSelection}
                bordered
                scroll={{ x: true }}
                columns={this.state.frameColumns}
                dataSource={this.state.frameData}
                pagination={{
                  showSizeChanger: true,
                  total: this.props.framePagination.totalRecord,
                  current: this.props.framePagination.currentPage,
                  pageSize: this.props.framePagination.pageSize,
                  pageSizeOptions: ['10', '20', '50', '100', '300'],
                  onShowSizeChange: this.onShowSizeChange,
                  onChange: this.onPageChange,
                  showTotal: total => `共${this.props.framePagination.totalRecord}条数据`,
                }}
              />
            </Spin>
          </div>
        </div>
      </div>
    );
  }
}

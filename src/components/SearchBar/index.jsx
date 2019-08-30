import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import { Form, Row, Col, Select, Input, Button, Icon, DatePicker } from 'antd';

const SearchOptions = {};

@Form.create()
@connect(({ tableTemplate, loading }) => ({
  tableTemplate,
  loadingG: loading.effects['tableTemplate/getDetailPage'],
}))
class SearchBar extends PureComponent {
  state = {
    // readOnlyFields: [],
    expand: false,
    start: null,
    end: null,
  };

  componentDidMount() {
    const { tableColumns = [], currentKey } = this.props.tableTemplate;
      const searchItems = _.filter(tableColumns, item => item.filterable === true);
      _.map(searchItems, item => {
        if (
          item.widgetType === 'Select' ||
          item.widgetType === 'Reference' ||
          item.widgetType === 'ObjectSelector' || 
          item.widgetType === 'TreeSelector'
        ) {
          this.getSearchBarOptions({ key: currentKey, text: item.dataIndex });
        }
      });
  }

  

  componentWillReceiveProps(newProps) {
    if (newProps.tableTemplate.tableColumns !== this.props.tableTemplate.tableColumns) {
      const { tableColumns = [], currentKey } = newProps.tableTemplate;
      const searchItems = _.filter(tableColumns, item => item.filterable === true);
      _.map(searchItems, item => {
        if (
          item.widgetType === 'Select' ||
          item.widgetType === 'Reference' ||
          item.widgetType === 'ObjectSelector' || 
          item.widgetType === 'TreeSelector'
        ) {
          this.getSearchBarOptions({ key: currentKey, text: item.dataIndex });
        }
      });
    }
  }

  // 获取搜索栏Options
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

  handleChange = (e, key) => {
    this.setState({
      [key]: moment(e).valueOf(),
    });
  };

  // 对日期管控的函数👇
  disabledStartDate = (e, value) => {
    const endValue = this.state[`${value.FIELD_NAME}-end`];
    if (!e || !endValue) {
      return false;
    }
    return e.valueOf() > endValue.valueOf();
  };

  disabledEndDate = (e, value) => {
    const startValue = this.state[`${value.FIELD_NAME}-start`];
    if (!e || !startValue) {
      return false;
    }
    return e.valueOf() <= startValue.valueOf();
  };

  onDateChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = (e, value) => {
    this.onDateChange(`${value.FIELD_NAME}-start`, e);
  };

  onEndChange = (e, value) => {
    this.onDateChange(`${value.FIELD_NAME}-end`, e);
  };

  // 对日期管控的函数👆

  disabledDate = (current, key) => {
    const { start, end } = this.state;
    if (key === 'start' && end) {
      return current && current > moment(end).startOf('day');
    }
    if (key === 'end' && start) {
      return current && current < moment(start).endOf('day');
    }
  };

  handleSearch = e => {
    const { pageId } = this.props.tableTemplate;
    const { tableColumns = [], summarySort, pageSize } = this.props.tableTemplate;
    const { start, end } = this.state;
    let searchParams = {};
    const idx = _.findIndex(
      tableColumns,
      item =>
        item.filterable === true && (item.widgetType === 'DateTime' || item.widgetType === 'Date')
    );
    // if (idx > -1) {
    //   // if()
    //   searchParams = _.assign(searchParams, { [tableColumns[idx].dataIndex]: { start, end } });
    // }
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      for (let gg in values) {
        //去除前后的空格
        if (values[gg] && typeof values[gg] == 'string') {
          values[gg] = values[gg].replace(/(^\s*)|(\s*$)/g, '');
        }
      }
      _.mapKeys(values, (value, key) => {
        var objKeys = Object.keys(values);
        for (var i = 0; i < objKeys.length; i++) {
          var keys = objKeys[i].split('-');
          if (!searchParams[keys[0]] && typeof searchParams[keys[0]] !== 'number')
            searchParams[keys[0]] = { start: null, end: null };
          if (keys.length > 1)
            searchParams[keys[0]][keys[1]] = moment(values[objKeys[i]]).valueOf();
          else searchParams[objKeys[i]] = values[objKeys[i]];
        }
        return;
      });
      this.props.dispatch({
        type: 'tableTemplate/getPagination',
        payload: { pageId, current: 1, pageSize, searchParams, summarySort },
      });
      // this.props.searchParamsChange(searchParams)
      this.props.dispatch({
        type: 'tableTemplate/changeState',
        payload: { searchParams },
      });
    });
  };

  render() {
    // tableColumns = { this.props.tableTemplate.tableColumns }
    const { tableColumns = [] } = this.props.tableTemplate;
    const { expand } = this.state;
    const searchItems = _.filter(tableColumns, item => item.filterable === true);
    const count = expand ? searchItems.length : 2;
    const { getFieldDecorator } = this.props.form;
    const dateIdx = _.findIndex(searchItems, item => {
      return item.widgetType === 'DateTime' || item.widgetType === 'Date';
    });
    return (
      <div>
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
                  value.widgetType === 'ObjectSelector' || 
                  value.widgetType === 'TreeSelector' 
                ) {
                  return (
                    <Col key={value.dataIndex} style={{ textAlign: 'left' }}>
                      <Form.Item
                        label={value.title}
                        // style={{ display: 'flex' }}
                        style={{
                          display: expand
                            ? 'flex'
                            : dateIdx === 0
                            ? index + 1 < count
                              ? ''
                              : 'none'
                            : index < count
                            ? ''
                            : 'none',
                        }}
                        key={value.dataIndex}
                      >
                        {getFieldDecorator(`${value.dataIndex}`, {
                          // initialValue: '',
                        })(
                          <Select
                            placeholder={`请选择${value.title}`}
                            showSearch={value.widgetType != 'Select'}
                            allowClear={true}
                            style={{ width: '195px', textOverflow: 'ellipsis' }}
                            filterOption={(inputValue, option) =>
                              _.includes(option.props.children, inputValue)
                            }
                            // suffixIcon={
                            //   value.widgetType !== 'Select' && <Icon type="search" />
                            // }
                            // onFocus={this.selectClick.bind(this, {
                            //   text: value.dataIndex,
                            //   key: currentKey,
                            //   value: null,
                            // })}
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
                } else if (value.widgetType === 'DateTime' || value.widgetType === 'Date') {
                  let Date = [
                    {
                      ...value,
                      title: `起始${value.title}`,
                      DateType: 'start',
                    },
                    {
                      ...value,
                      title: `结束${value.title}`,
                      FIELD_VALUE: null,
                      DateType: 'end',
                    },
                  ];
                  return Date.map((kk, gg) => {
                    let type = kk.DateType;
                    switch (type) {
                      case 'start':
                        return (
                          <Col style={{ textAlign: 'left' }} key={kk.sequence + gg}>
                            <Form.Item
                              label={kk.title}
                              style={{ display: expand ? 'flex' : index + 1 < count ? '' : 'none' }}
                            >
                              {getFieldDecorator(`${value.dataIndex}-${kk.DateType}`, {
                                initialValue: null,
                              })(
                                <DatePicker
                                  allowClear={true}
                                  placeholder={`请选择${kk.title}`}
                                  format="YYYY-MM-DD"
                                  placeholder={`请选择${kk.title}`}
                                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                  style={{ width: '195px' }}
                                  onChange={e => {
                                    this.handleChange(e, kk.title);
                                    this.onStartChange(e, kk);
                                  }}
                                  disabledDate={e => this.disabledStartDate(e, kk)}
                                />
                              )}
                            </Form.Item>
                          </Col>
                        );
                        break;
                      case 'end':
                        return (
                          <Col style={{ textAlign: 'left' }} key={kk.sequence + gg}>
                            <Form.Item
                              label={kk.title}
                              style={{ display: expand ? 'flex' : index + 1 < count ? '' : 'none' }}
                            >
                              {getFieldDecorator(`${value.dataIndex}-${kk.DateType}`, {
                                initialValue: null,
                              })(
                                <DatePicker
                                  placeholder={`请选择${kk.title}`}
                                  format="YYYY-MM-DD"
                                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                                  style={{ width: '195px' }}
                                  allowClear={true}
                                  onChange={e => {
                                    console.log(e);
                                    this.handleChange(e, kk.title);
                                    this.onEndChange(e, kk);
                                  }}
                                  disabledDate={e => this.disabledEndDate(e, kk)}
                                  // value={this.state[`${kk.FIELD_NAME}-end`]}
                                  // onChange={(e)=>this.onEndChange(e,kk)}
                                />
                              )}
                            </Form.Item>
                          </Col>
                        );
                        break;
                      default:
                        break;
                    }
                  });
                  // const rangeTime = [
                  //   { label: `起始${value.title}`, value: `${value.dataIndex}start` },
                  //   { label: `结束${value.title}`, value: `${value.dataIndex}end` },
                  // ];
                  // return _.map(rangeTime, (item, i) => {
                  //   return (
                  //     <Col key={`${value.dataIndex}-${i}`} style={{ textAlign: 'left' }}>
                  //       <Form.Item
                  //         label={item.label}
                  //         key={value.dataIndex}
                  //         // {...formItemLayout}
                  //         style={{ display: expand ? 'flex' : index + i < count ? '' : 'none' }}
                  //       >
                  //         <DatePicker
                  //           allowClear
                  //           showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  //           // disabledDate={current => this.disabledDate(current, item.value)}
                  //           placeholder={`请选择${item.label}`}
                  //           onChange={e => this.handleChange(e, item.value)}
                  //           style={{ width: '195px' }}
                  //         />
                  //       </Form.Item>
                  //     </Col>
                  //   );
                  // });
                } else if (value.widgetType === 'Text') {
                  return (
                    <Col key={value.dataIndex} style={{ textAlign: 'left' }}>
                      <Form.Item
                        label={value.title}
                        key={value.dataIndex}
                        // {...formItemLayout}
                        style={{
                          display: expand
                            ? 'flex'
                            : dateIdx === 0
                            ? index + 1 < count
                              ? ''
                              : 'none'
                            : index < count
                            ? ''
                            : 'none',
                        }}
                      >
                        {getFieldDecorator(`${value.dataIndex}`, {
                          initialValue: '',
                        })(
                          <Input
                            allowClear={true}
                            placeholder={`请输入${value.title}`}
                            style={{ width: '195px', textOverflow: 'ellipsis' }}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  );
                } else if (value.widgetType === 'Number') {
                  return (
                    <Col key={value.dataIndex} style={{ textAlign: 'left' }}>
                      <Form.Item
                        label={value.title}
                        key={value.dataIndex}
                        // {...formItemLayout}
                        style={{
                          display: expand
                            ? 'flex'
                            : dateIdx === 0
                            ? index + 1 < count
                              ? ''
                              : 'none'
                            : index < count
                            ? ''
                            : 'none',
                        }}
                      >
                        {getFieldDecorator(`${value.dataIndex}`, {
                          initialValue: '',
                        })(
                          <Input
                            type="number"
                            min={0}
                            // allowClear={true}
                            placeholder={`请输入${value.title}`}
                            style={{ width: '195px', textOverflow: 'ellipsis' }}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  );
                }
              })}
            {searchItems.length > 0 && (
              <Col style={{ textAlign: 'right' }}>
                <Form.Item
                  style={{
                    width: this.state.expand && searchItems.length > 2 ? 315 : 100,
                    textAlign: 'left',
                    // paddingLeft: '10px',
                    paddingLeft: this.state.expand && searchItems.length > 2 ? 50 : 10,
                  }}
                >
                  <Button type="default" htmlType="submit">
                    <Icon type="search" />
                  </Button>

                  <span style={{ display: 'inlineblock', padding: '8px' }}>
                    <a
                      style={{
                        marginLeft: 8,
                        fontSize: 12,
                        display:
                          searchItems.length === 1 || (searchItems.length === 2 && dateIdx === -1)
                            ? 'none'
                            : null,
                        cursor:
                          searchItems.length === 1 || (searchItems.length === 2 && dateIdx === -1)
                            ? 'not-allowed'
                            : 'pointer',
                      }}
                      onClick={
                        !(
                          searchItems.length === 1 ||
                          (searchItems.length === 2 && dateIdx === -1)
                        ) && this.toggle
                      }
                    >
                      <Icon type={this.state.expand ? 'up' : 'down'} />
                    </a>
                  </span>
                </Form.Item>
              </Col>
            )}
          </Form>
        </Row>
      </div>
    );
  }
}

export default SearchBar;

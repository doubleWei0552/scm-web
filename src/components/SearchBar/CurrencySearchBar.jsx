import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import { Form, Row, Col, Select, Input, Button, Icon, DatePicker } from 'antd';

const SearchOptions = {};

@Form.create()
export default class CurrencySearchBar extends PureComponent {
  state = {
    // readOnlyFields: [],
    expand: false,
    start: null,
    end: null,
  };

  componentDidMount() { }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.tableTemplate.tableColumns !== this.props.tableTemplate.tableColumns) {
      const { tableColumns = [], currentKey } = newProps.tableTemplate;
      const searchItems = _.filter(tableColumns, item => item.filterable === true);
      _.map(searchItems, item => {
        if (
          item.widgetType === 'Select' ||
          item.widgetType === 'Reference' ||
          item.widgetType === 'ObjectSelector'
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
    const { tableColumns = [] } = this.props.tableTemplate;
    const { start, end } = this.state;
    let searchParams = {};
    const idx = _.findIndex(
      tableColumns,
      item =>
        item.filterable === true && (item.widgetType === 'DateTime' || item.widgetType === 'Date')
    );
    if (idx > -1) {
      // if()
      searchParams = _.assign(searchParams, { [tableColumns[idx].dataIndex]: { start, end } });
    }
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      _.mapKeys(values, (value, key) => {
        if (value && typeof value[0] !== 'object') {
          searchParams = _.assign(searchParams, { [key]: value });
        }
        return;
      });
      this.props.dispatch({
        type: 'tableTemplate/getPagination',
        payload: { pageId, current: 1, pageSize: 10, searchParams },
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
    const count = expand ? searchItems.length : searchItems.length > 2 ? 2 : searchItems.length;
    const { getFieldDecorator } = this.props.form;
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
                  value.widgetType === 'ObjectSelector'
                ) {
                  return (
                    <Col key={value.dataIndex} style={{ textAlign: 'left' }}>
                      <Form.Item
                        label={value.title}
                        // style={{ display: 'flex' }}
                        style={{ display: expand ? 'flex' : index < count ? '' : 'none' }}
                        key={value.dataIndex}
                      >
                        {getFieldDecorator(`${value.dataIndex}`, {
                          // initialValue: '',
                        })(
                          <Select
                            placeholder={`请选择${value.title}`}
                            showSearch={value.widgetType !== 'Select'}
                            allowClear
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
                  const rangeTime = [
                    { label: '起始时间', value: 'start' },
                    { label: '结束时间', value: 'end' },
                  ];
                  return _.map(rangeTime, (item, i) => {
                    return (
                      <Col key={`${value.dataIndex}-${i}`} style={{ textAlign: 'left' }}>
                        <Form.Item
                          label={item.label}
                          key={value.dataIndex}
                          // {...formItemLayout}
                          style={{ display: expand ? 'flex' : index + i < count ? '' : 'none' }}
                        >
                          <DatePicker
                            allowClear
                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                            disabledDate={current => this.disabledDate(current, item.value)}
                            placeholder={`请选择${item.label}`}
                            onChange={e => this.handleChange(e, item.value)}
                            style={{ width: '195px' }}
                          />
                        </Form.Item>
                      </Col>
                    );
                  });
                } else if (value.widgetType === 'Text') {
                  return (
                    <Col key={value.dataIndex} style={{ textAlign: 'left' }}>
                      <Form.Item
                        label={value.title}
                        key={value.dataIndex}
                        // {...formItemLayout}
                        style={{ display: expand ? 'flex' : index < count ? '' : 'none' }}
                      >
                        {getFieldDecorator(`${value.dataIndex}`, {
                          initialValue: '',
                        })(
                          <Input
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
                        style={{ display: expand ? 'flex' : index < count ? '' : 'none' }}
                      >
                        {getFieldDecorator(`${value.dataIndex}`, {
                          initialValue: '',
                        })(
                          <Input
                            type="number"
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
                    width: this.state.expand && searchItems.length > 2 ? 277 : 100,
                    textAlign: 'left',
                    paddingLeft: '10px',
                    // paddingLeft: this.state.expand && searchItems.length > 2 ? 80 : 0,
                  }}
                >
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
      </div>
    );
  }
}

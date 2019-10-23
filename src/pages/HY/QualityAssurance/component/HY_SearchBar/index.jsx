import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import { Form, Row, Col, Select, Input, Button, Icon, DatePicker } from 'antd';
import styles from './index.less'

@Form.create()
@connect(({ loading, quality }) => ({
  quality,
  loadingG: loading.effects['quality/getDataList'],
}))
class SearchBar extends React.Component {
  state = {
    expand: false, //按钮状态
    start: null,
    end: null,
  };

  //搜索方法
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      for (let gg in values) {
        //去除前后的空格
        if (values[gg] && typeof values[gg] == 'string') {
          values[gg] = values[gg].replace(/(^\s*)|(\s*$)/g, '');
        }
        if (values[gg] != null && typeof values[gg] == 'object') {
          values[gg] = moment(values[gg]).valueOf()
        }
      }
      this.props.queryDatas(values)
      console.log('搜索条件', values)
    });
  };

  // 对日期管控的函数👇
  handleChange = (e, key) => {
    this.setState({
      [key]: moment(e).valueOf(),
    });
  };

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

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  render() {
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
    const { tableColumns = [] } = this.props;
    const { expand } = this.state;
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
            {
              tableColumns.map((item, index) => {
                switch (item.widgetType) {
                  case 'Text':
                    if (!item.disabled) return
                    return <Col span={expand ? 13 : 9} key={item.dataIndex} style={{ textAlign: 'left', display: expand ? 'flex' : index + 1 < 3 ? null : 'none' }}>
                      <Form.Item
                        label={item.title}
                        key={item.dataIndex}
                        {...formItemLayout}
                        style={{ width: '100%' }}
                      >
                        {getFieldDecorator(`${item.dataIndex}`, {
                          initialValue: '',
                        })(
                          <Input
                            allowClear={true}
                            placeholder={`请输入${item.title}`}
                            style={{ width: '100%', textOverflow: 'ellipsis' }}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    break
                  case 'Number':
                    if (!item.disabled) return
                    return <Col span={expand ? 13 : 9} key={item.dataIndex} style={{ textAlign: 'left', display: expand ? 'flex' : index + 1 < 3 ? null : 'none' }}>
                      <Form.Item
                        label={item.title}
                        key={item.dataIndex}
                        {...formItemLayout}
                        style={{ width: '100%' }}
                      >
                        {getFieldDecorator(`${item.dataIndex}`, {
                          initialValue: '',
                        })(
                          <Input
                            type="number"
                            // allowClear={true}
                            placeholder={`请输入${item.title}`}
                            style={{ width: '100%', textOverflow: 'ellipsis' }}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    break
                  case 'Date':
                    let Date = [
                      {
                        ...item,
                        title: `起始${item.title}`,
                        DateType: 'start',
                      },
                      {
                        ...item,
                        title: `结束${item.title}`,
                        FIELD_VALUE: null,
                        DateType: 'end',
                      },
                    ];
                    if (!item.disabled) return
                    return Date.map((kk, gg) => {
                      let type = kk.DateType;
                      switch (type) {
                        case 'start':
                          return (
                            <Col span={expand ? 13 : 9} style={{ textAlign: 'left', display: expand ? 'flex' : index + 1 < 3 ? null : 'none' }} key={kk.dataIndex + gg}>
                              <Form.Item
                                label={kk.title}
                                {...formItemLayout}
                                style={{ width: '100%' }}
                              >
                                {/* {getFieldDecorator(`${kk.DateType}-${item.dataIndex}`, { */}
                                {getFieldDecorator(`Start_date`, {
                                  initialValue: null,
                                })(
                                  <DatePicker
                                    allowClear={true}
                                    placeholder={`请选择${kk.title}`}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder={`请选择${kk.title}`}
                                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                    style={{ width: '100%' }}
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
                            <Col span={expand ? 13 : 9} style={{ textAlign: 'left', display: expand ? 'flex' : index + 1 < 3 ? null : 'none' }} key={kk.dataIndex + gg}>
                              <Form.Item
                                label={kk.title}
                                {...formItemLayout}
                                style={{ width: '100%' }}
                              >
                                {/* {getFieldDecorator(`${kk.DateType}-${item.dataIndex}`, { */}
                                {getFieldDecorator(`end_date`, {
                                  initialValue: null,
                                })(
                                  <DatePicker
                                    placeholder={`请选择${kk.title}`}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                                    style={{ width: '100%' }}
                                    allowClear={true}
                                    onChange={e => {
                                      console.log(e);
                                      this.handleChange(e, kk.title);
                                      this.onEndChange(e, kk);
                                    }}
                                    disabledDate={e => this.disabledEndDate(e, kk)}
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
                    break
                  case 'Select':
                    if (!item.disabled) return
                    return <Col span={expand ? 13 : 9} key={item.dataIndex}
                      style={{ textAlign: 'left', display: expand ? 'flex' : index + 1 < 3 ? null : 'none' }}>
                      <Form.Item
                        label={item.title}
                        key={item.dataIndex}
                        {...formItemLayout}
                        style={{ width: '100%' }}
                      >
                        {getFieldDecorator(`${item.dataIndex}`, {
                          initialValue: undefined,
                        })(
                          <Select
                            placeholder={`请选择${item.title}`}
                            allowClear={true}
                            style={{ width: '100%', textOverflow: 'ellipsis' }}
                            filterOption={(inputValue, option) =>
                              _.includes(option.props.children, inputValue)
                            }
                            onSearch={true}
                          >
                            {_.map(item.options, (ii, jj) => {
                              return (
                                <Select.Option
                                  title={ii.text}
                                  key={ii.value + _.now()}
                                  value={ii.value}
                                >
                                  {ii.text}
                                </Select.Option>
                              );
                            })
                            }
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    break
                  default:
                    break
                }
              })
            }
            {
              <Col span={expand ? 13 : 9} key={'库位'} style={{ textAlign: 'left', display: expand ? 'flex' : expand ? null : 'none' }}>
                <Form.Item
                  label='库位'
                  key={'库位'}
                  {...formItemLayout}
                  style={{ width: '100%' }}
                >
                  {getFieldDecorator('Storehouse', {
                    initialValue: '',
                  })(
                    <Input
                      allowClear={true}
                      placeholder={`请输入库位`}
                      style={{ width: '100%', textOverflow: 'ellipsis' }}
                    />
                  )}
                </Form.Item>
              </Col>
            }
            {
              <Col span={expand ? 13 : null} style={{ textAlign: 'right' }}>
                <Form.Item
                  style={{
                    // width: this.state.expand ? 315 : 100,
                    textAlign: 'left',
                    paddingLeft: this.state.expand ? 50 : 10,
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
                        cursor: 'pointer',
                      }}
                      onClick={() => this.toggle()}
                    >
                      <Icon type={this.state.expand ? 'up' : 'down'} />
                    </a>
                  </span>
                </Form.Item>
              </Col>
            }
          </Form>
        </Row>
      </div>
    );
  }
}

export default SearchBar;

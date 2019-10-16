import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import {
  Modal,
  Form,
  Input,
  Card,
  Button,
  Col,
  Row,
  DatePicker,
  Icon,
  Table,
  InputNumber,
  Spin,
  message,
  notification,
} from 'antd';

const FormItem = Form.Item;
import styles from '../Index.less';

const { RangePicker } = DatePicker;

// 个人中心弹窗
@connect(({ hydeliveryorder, loading }) => ({
  hydeliveryorder,
  loading: loading.models.hydeliveryorder,
}))
class DeliveryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      dataList: [],
      selectDatas: [],
    };
  }

  // 初始数据加载
  componentDidMount() {
    this.setState({
      visible: true,
    });
  }

  setSelectValue(name, operatorId) {
    const { setOperatorName } = this.props;
    setOperatorName(name, operatorId);
    this.hideModelHandler();
  }

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  showModelHandler = e => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  handleSearch = e => {
    const { dispatch } = this.props;
    console.log('modal', this.props);
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      const DEMAND_DATE = {
        start: moment(_.get(values, 'DEMAND_DATE[0]')).valueOf(),
        end: moment(_.get(values, 'DEMAND_DATE[1]')).valueOf(),
      };
      const { MATERIAL_CODE, QUANTITY, SPEC } = values;
      const data = _.get(values, 'DEMAND_DATE[0]')
        ? _.assign({}, { MATERIAL_CODE, QUANTITY, SPEC, DEMAND_DATE })
        : _.assign({}, { MATERIAL_CODE, QUANTITY, SPEC });
      dispatch({
        type: 'hydeliveryorder/getModalList',
        payload: data,
        callback: response => {
          this.setState({
            dataList: response,
          });
        },
      });
    });
  };

  handleNumberChange = (e, record) => {
    const { dataList } = this.state;
    console.log('eeeee', e);
    const value = e || 0;
    record.UNMATCHQUANTITY =
      value * 1 < record.UNDELIVEREDQUANTITY * 1 ? value * 1 : record.UNDELIVEREDQUANTITY * 1;
    const index = _.findIndex(dataList, data => data.ID === record.ID);
    dataList[index] = record;
    this.setState({
      dataList,
    });
  };

  handleSubmit = () => {
    const { selectDatas } = this.state;
    this.setState(
      {
        visible: false,
      },
      () => this.props.handleOk(selectDatas)
    );
  };

  render() {
    const { title, form, loading, hydeliveryorder } = this.props;
    const { dataList } = this.state;
    const { modalDeliveryOrderList } = hydeliveryorder;
    const { getFieldDecorator } = form;
    console.log('ssssss', dataList);
    const columns = [
      {
        title: '采购订单',
        className: 'column-money',
        dataIndex: 'PURCHASE_ORDER_CODE',
      },
      {
        title: '采购项次',
        dataIndex: 'SERIAL_NUMBER',
      },
      {
        title: '需求日期',
        dataIndex: 'DELIVERY_DATE',
        render: text => <span>{moment(text).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '料号',
        dataIndex: 'PRODUCT_CODE',
      },
      {
        title: '品名',
        dataIndex: 'PRODUCT_NAME',
      },
      {
        title: '规格',
        dataIndex: 'SPECIFICATIONS',
      },
      {
        title: '单位',
        dataIndex: 'UNIT_CODE',
      },
      {
        title: '采购量',
        dataIndex: 'QUANTITY',
      },
      {
        title: '未交量',
        dataIndex: 'UNDELIVEREDQUANTITY',
      },
      {
        title: '数量',
        dataIndex: 'UNMATCHQUANTITY',
        render: (text, record) => (
          <InputNumber
            min={0}
            max={record.QUANTITY}
            step={1}
            value={record.UNMATCHQUANTITY}
            onChange={e => this.handleNumberChange(e, record)}
          />
        ),
      },
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({
          selectDatas: selectedRows,
        });
      },
      getCheckboxProps: record => ({
        disabled: !record.UNMATCHQUANTITY, // Column configuration not to be checked
        // name: record.name,
      }),
    };

    return (
      <span>
        <Modal
          title={title}
          destroyOnClose
          visible={this.state.visible}
          onOk={this.handleSubmit}
          onCancel={this.hideModelHandler}
          className="deliveryModal"
          width={1200}
        >
          <div>
            <div style={{ padding: '10px' }}>
              <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row gutter={6} style={{ display: 'flex' }}>
                  <Form.Item label="物料编码" style={{ marginBottom: 5, marginRight: '16px' }}>
                    {getFieldDecorator(`MATERIAL_CODE`, {
                      rules: [],
                    })(<Input placeholder="请输入物料编码" />)}
                  </Form.Item>
                  <Form.Item label="规格" style={{ marginBottom: 5, marginRight: '16px' }}>
                    {getFieldDecorator(`SPEC`, {
                      rules: [],
                    })(<Input placeholder="请输入规格" />)}
                  </Form.Item>
                  <Form.Item label="数量" style={{ marginBottom: 5, marginRight: '16px' }}>
                    {getFieldDecorator(`QUANTITY`, {
                      rules: [],
                    })(<Input placeholder="请输入数量" />)}
                  </Form.Item>
                  <Form.Item label="需求日期" style={{ marginBottom: 5, marginRight: '16px' }}>
                    {getFieldDecorator('DEMAND_DATE', {
                      rules: [{ type: 'array', message: '请选择需求日期' }],
                    })(<RangePicker />)}
                  </Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ position: 'relative', top: '3px' }}
                  >
                    <Icon type="search" />
                  </Button>
                </Row>
              </Form>
            </div>
            <Card style={{ padding: 0 }}>
              <Table
                loading={loading}
                columns={columns}
                dataSource={dataList}
                bordered
                rowSelection={rowSelection}
                scroll={{ x: true }}
                // title={() => 'Header'}
                // footer={() => 'Footer'}
                pagination={false}
              />
            </Card>
          </div>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(DeliveryModal);

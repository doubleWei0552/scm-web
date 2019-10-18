import React from 'react';
import MultiTableTemplate from '@/components/HY/DeliveryOrderTemplate/MultiTableTemplate';
import router from 'umi/router';
import CatchError from '@/components/CatchError';
import { connect } from 'dva';
import moment from 'moment'
import { Card, Table, Button, Select, Checkbox, InputNumber, Input, Pagination, Col } from 'antd';
import CustomerHeader from '@/components/CustomerHeader'; //头部组件
import SearchBar from '@/pages/HY/QualityAssurance/component/HY_SearchBar'; //搜索栏

import styles from './style.less'

@connect(({ quality, loading, tableTemplate }) => ({
  quality,
  tableTemplate,
  loading: loading.models.quality,
}))

//DeliveryOreer
export default class QualityAssurance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      paganition: {},
      selectDatas: [],
      searchParams: {},
    };
  }

  componentDidMount() {
    let pageId = this.props.location.query.PageId * 1
    this.props.dispatch({ type: 'tableTemplate/getReportForm', payload: { pageId } }); // 👈拿面包屑数据
    this.queryDatas()
  };

  // 获取分页数据
  queryDatas = (value) => {
    let { searchParams } = this.state
    console.log('value', value)
    if (value) {
      this.setState({
        searchParams: value
      })
    }
    const { dispatch } = this.props;
    let pageId = this.props.location.query.PageId * 1;
    dispatch({
      type: 'quality/getDataList',
      payload: { PageIndex: 1, PageCount: 10, searchParams: value ? value : searchParams ? searchParams : null },
      callback: response => {
        this.setState({
          dataList: response.list,
          paganition: response.page
        })
      }
    });
  }

  // 状态
  handleStatusChange = (value, record) => {
    console.log(`selected ${value}`);
    const { dataList } = this.state;

    record.QUALITY_STATUS = value
    if (value == 1) {
      record.HG_NUM = record.RECEIVED_NUM;
      record.YT_NUM = 0
    }

    const index = _.findIndex(dataList, data => data.ID === record.ID);

    dataList[index] = record;
    this.setState({
      dataList,
    });
  };

  onCheckboxChange = (text, index, dataIndex) => {
    let { dataSource } = this.state;
    dataSource.map(item => {
      if (item.id == index.id) {
        item[dataIndex] = !text;
      }
    });
    this.setState({
      dataSource,
    });
  };

  handleNumberChange = (e, record) => {
    const { dataList } = this.state;
    console.log('eeeee', e);
    const value = e || 0;
    record.HG_NUM =
      value * 1 < record.RECEIVED_NUM * 1 ? value * 1 : record.RECEIVED_NUM * 1;
    const index = _.findIndex(dataList, data => data.ID === record.ID);
    record.YT_NUM = record.RECEIVED_NUM - record.HG_NUM;
    dataList[index] = record;
    this.setState({
      dataList,
    });
  }

  // 验退理由
  handleReasonChange = (e, record) => {
    const { dataList } = this.state;
    record.CHECK_REASON = e.target.value;
    const index = _.findIndex(dataList, data => data.ID === record.ID);
    dataList[index] = record;
    this.setState({
      dataList,
    });
  }

  // 审核
  handleQuality = () => {
    const { selectDatas } = this.state
    const { dispatch } = this.props
    dispatch({
      type: 'quality/handleQuality',
      payload: { list: selectDatas },
      callback: response => {
        console.log('callback', response)
        this.queryDatas()
      }
    });
  }

  // 撤回
  handleResetQuality = () => {
    const { selectDatas } = this.state
    const { dispatch } = this.props
    dispatch({
      type: 'quality/handleResetQuality',
      payload: { list: selectDatas },
      callback: response => {
        console.log('callback', response)
        this.queryDatas()
      }
    });
  }


  onShowSizeChange = (current, pageSize) => {
    let { searchParams } = this.state
    const { dispatch } = this.props;
    let pageId = this.props.location.query.PageId * 1;
    dispatch({
      type: 'quality/getDataList',
      payload: { PageIndex: current, PageCount: pageSize, searchParams },
      callback: response => {
        this.setState({
          dataList: response.list,
          paganition: response.page
        })
      }
    });

  }

  render() {
    const { loading } = this.props;
    let { dataList, paganition } = this.state;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectDatas: selectedRows,
        });
      },
      getCheckboxProps: record => ({
        disabled: !record.QUALITY_STATUS,
        name: record.name,
      }),
    };

    let today = moment().startOf('day').valueOf()
    const columns = [
      {
        title: '送货单号',
        dataIndex: 'DELIVERY_OREER_CODE',
        key: 'DELIVERY_OREER_CODE',
        widgetType: 'Text',
        fixed: 'left',
        disabled: true,
        className: 'color',
        render: (text, record) => {
          if (record.SH_DATE) {
            const date = moment(record.SH_DATE).valueOf()
            if (date > today) {
              return <div style={{ padding: '16px', }}>{text}</div>
            } else if (date > (today - 86400000 * 3)) {
              return <div style={{ padding: '16px', background: 'lightyellow' }}>{text}</div>
            } else {
              return <div style={{ padding: '16px', background: '#ff3535', }}>{text}</div>
            }
          } else {
            return (
              <div style={{ padding: '16px', }}>{text}</div>
            )
          }
        }
      },
      {
        title: '项次',
        dataIndex: 'SERIAL_NUMBER',
        key: 'SERIAL_NUMBER',
        className: 'nocolor',
        widgetType: 'Text',
        disabled: true,
        align: 'center'
      },
      {
        title: '料号',
        dataIndex: 'MATERIAL_CODE',
        key: 'MATERIAL_CODE',
        widgetType: 'Text',
        disabled: true,
        className: 'nocolor',
      },
      {
        title: '品名',
        dataIndex: 'MATERIAL_NAME',
        key: 'MATERIAL_NAME',
        disabled: false,
        widgetType: 'Text',
        className: 'nocolor',
      },
      {
        title: '规格',
        dataIndex: 'MATERIAL_SPEC',
        key: 'MATERIAL_SPEC',
        disabled: false,
        className: 'nocolor',
        widgetType: 'Text',
      },
      {
        title: '单位',
        dataIndex: 'UNIT_CODE',
        key: 'UNIT_CODE',
        disabled: false,
        className: 'nocolor',
        widgetType: 'Text',
      },
      {
        title: '收货量',
        dataIndex: 'RECEIVED_NUM',
        key: 'RECEIVED_NUM',
        className: 'nocolor',
        disabled: false,
        widgetType: 'Text',
      },
      {
        title: '收货日期',
        dataIndex: 'SH_DATE',
        key: 'receivedDate',
        widgetType: 'Date',
        disabled: true,
        className: 'nocolor',
        render: text => <span>{text ? moment(text).format('YYYY-MM-DD') : null}</span>
      },
      {
        title: '检查状态',
        dataIndex: 'QUALITY_STATUS',
        key: 'CheckState',
        disabled: false,
        className: 'nocolor',
        options: [{ text: "待检", value: "0" },
        { text: "合格", value: "1" },
        { text: "验退", value: "2" },
        { text: "特采", value: "3" },
        { text: "待判", value: "9" }],
        widgetType: 'Select',
        render: (text, record) => {
          return (
            <Select defaultValue={text ? text : '0'} style={{ width: 120, display: 'block' }} onChange={(value) => this.handleStatusChange(value, record)}>
              <Select.Option value={'0'}>待检</Select.Option>
              <Select.Option value={'1'}>合格</Select.Option>
              <Select.Option value={'2'}>验退</Select.Option>
              <Select.Option value={'3'}>特采</Select.Option>
              <Select.Option value={'9'}>待判</Select.Option>
            </Select>
          );
        },
      },
      {
        title: '合格量',
        dataIndex: 'HG_NUM',
        key: 'QualifiedQuantity',
        widgetType: 'Number',
        disabled: false,
        className: 'nocolor',
        render: (text, record) => (
          <InputNumber
            min={0}
            max={record.QUANTITY}
            step={1}
            disabled={!record.QUALITY_STATUS || record.QUALITY_STATUS === 0 || record.QUALITY_STATUS === 1 || record.QUALITY_STATUS === 9}
            value={record.HG_NUM}
            onChange={e => this.handleNumberChange(e, record)}
          />
        ),
      },
      {
        title: '验退量',
        dataIndex: 'YT_NUM',
        disabled: false,
        key: 'YieldTested',
        className: 'nocolor',
        widgetType: 'Number',
        render: (text, record) => (
          <InputNumber
            min={0}
            max={record.QUANTITY}
            step={1}
            value={record.YT_NUM}
            disabled
          />
        ),
      },
      {
        title: '验退理由',
        dataIndex: 'CHECK_REASON',
        key: 'ReasonsForRetirement',
        className: 'nocolor',
        disabled: false,
        widgetType: 'Text',
        width: 200,
        render: (text, record) => (
          <Input
            value={record.CHECK_REASON}
            // disabled
            style={{ width: '200px' }}
            onChange={e => this.handleReasonChange(e, record)}
          />
        ),
      },
      {
        title: '质检人员',
        dataIndex: 'STAFF_CODE',
        key: 'QualityInspector',
        disabled: false,
        className: 'nocolor',
        widgetType: 'Text',
      },
      {
        title: '质检时间',
        dataIndex: 'ZJ_DATA',
        key: 'QualityInspectionTime',
        disabled: false,
        widgetType: 'Date',
        className: 'nocolor',
        render: text => <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null}</span>
      },
      {
        title: '收货单号',
        dataIndex: 'TASK_SHEET_CODE',
        key: 'ReceiptAccount',
        disabled: false,
        className: 'nocolor',
        widgetType: 'Text',
      },
      {
        title: '收货单项次',
        dataIndex: 'SOURCE_SEQ_NUM',
        key: 'ReceiptItem',
        disabled: false,
        className: 'nocolor',
        widgetType: 'Text',
      },
      {
        title: '已同步',
        dataIndex: 'TB_SDH',
        key: 'AlreadySynchronized',
        align: 'center',
        disabled: false,
        widgetType: 'Select',
        options: [{ text: "是", value: "0" },
        { text: "否", value: "1" }],
        // className: 'nocolor',
        render: (text, record) => {
          return (
            <Checkbox
              checked={text}
              disabled
              onChange={() => this.onCheckboxChange(text, record, 'AlreadySynchronized')}
            />
          );
        },
      },
    ]

    return (
      <div className={styles.qualityPage}>
        <div style={{ borderRadius: '5px', background: 'white', padding: '10px' }}>
          <CustomerHeader />
          <Col span={6} style={{ lineHeight: '41px', whiteSpace: 'nowrap', zIndex: 1 }}>
            <div style={{ margin: '10px 0' }}>
              <Button onClick={() => this.handleQuality()} style={{ marginRight: '1rem' }} type="primary">
                审核
              </Button>
              <Button onClick={this.handleResetQuality} type="primary">撤回</Button>
            </div>
          </Col>
          <Col span={18} style={{ margin: '10px 0', zIndex: 1000, }}>
            <SearchBar tableColumns={columns} queryDatas={(e) => this.queryDatas(e)} />
          </Col>
          <Table
            loading={loading}
            rowSelection={rowSelection}
            dataSource={dataList}
            scroll={{ x: true }}
            columns={columns}
            bordered
            pagination={false}
          />
          <Pagination
            showSizeChanger
            onShowSizeChange={(current, pageSize) => this.onShowSizeChange(current, pageSize)}
            defaultCurrent={1}
            total={paganition.totalPage}
            onChange={(current, pageSize) => this.onShowSizeChange(current, pageSize)}
          />
        </div>
      </div>
    );
  }
}

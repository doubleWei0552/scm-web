import React from 'react';
import MultiTableTemplate from '@/components/HY/DeliveryOrderTemplate/MultiTableTemplate';
import router from 'umi/router';
import CatchError from '@/components/CatchError';
import { connect } from 'dva';
import { Card,Table,Button, Select,Checkbox } from 'antd';
import CustomerHeader from '@/components/CustomerHeader'; //头部组件

@connect(({ tableTemplate, functionSet }) => ({
  tableTemplate,
  functionSet,
}))

//DeliveryOreer
export default class QualityAssurance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource : [
        {
          key: '1',
          id:1,
          name: '胡彦斌',
          age: 32,
          address: '西湖区湖底公园1号',
          CheckState:0,
          AlreadySynchronized:true
        },
        {
          key: '2',
          id:2,
          name: '胡彦祖',
          age: 42,
          address: '西湖区湖底公园1号',
          CheckState:1,
          AlreadySynchronized:false
        },
        {
          key: '3',
          id:3,
          name: '胡彦祖',
          age: 42,
          address: '西湖区湖底公园1号',
          CheckState:1,
          AlreadySynchronized:false
        },
      ],
      columns : [
        {
          title: '送货单号',
          dataIndex: 'DELIVERY_OREER_CODE',
          key: 'DELIVERY_OREER_CODE',
        },
        {
          title: '项次',
          dataIndex: 'SERIAL_NUMBER',
          key: 'SERIAL_NUMBER',
        },
        {
          title: '料号',
          dataIndex: 'MATERIAL_CODE',
          key: 'MATERIAL_CODE',
        },
        {
          title: '品名',
          dataIndex: 'MATERIAL_NAME',
          key: 'MATERIAL_NAME',
        },
        {
          title: '规格',
          dataIndex: 'MATERIAL_SPEC',
          key: 'MATERIAL_SPEC',
        },
        {
          title: '单位',
          dataIndex: 'UNIT_CODE',
          key: 'UNIT_CODE',
        },
        {
          title: '收货量',
          dataIndex: 'RECEIVED_NUM',
          key: 'RECEIVED_NUM',
        },
        {
          title: '收货日期',
          dataIndex: 'receivedDate',
          key: 'receivedDate',
        },
        {
          title: '检查状态',
          dataIndex: 'CheckState',
          key: 'CheckState',
          render:text => {
            return (<Select defaultValue={text} style={{ width: 120 }} onChange={this.handleChange}>
              <Select.Option value={0}>合格</Select.Option>
              <Select.Option value={1}>不合格</Select.Option>
            </Select>)
          }
        },
        {
          title: '合格量',
          dataIndex: 'QualifiedQuantity',
          key: 'QualifiedQuantity',
        },
        {
          title: '验退量',
          dataIndex: 'YieldTested',
          key: 'YieldTested',
        },
        {
          title: '验退理由',
          dataIndex: 'ReasonsForRetirement',
          key: 'ReasonsForRetirement',
        },
        {
          title: '质检人员',
          dataIndex: 'QualityInspector',
          key: 'QualityInspector',
        },
        {
          title: '质检时间',
          dataIndex: 'QualityInspectionTime',
          key: 'QualityInspectionTime',
        },
        {
          title: '收货单号',
          dataIndex: 'ReceiptAccount',
          key: 'ReceiptAccount',
        },
        {
          title: '收货单项次',
          dataIndex: 'ReceiptItem',
          key: 'ReceiptItem',
        },
        {
          title: '已同步',
          dataIndex: 'AlreadySynchronized',
          key: 'AlreadySynchronized',
          render:(text,record) => {
            return <Checkbox checked={text} onChange={()=>this.onCheckboxChange(text,record,'AlreadySynchronized')} />
          }
        }
      ]
    };
  }

  componentDidMount=()=>{
    let pageId = this.props.location.query.PageId*1
    this.props.dispatch({ type: 'tableTemplate/getReportForm',payload:{pageId}});
  }

  handleChange=(value)=> {
    console.log(`selected ${value}`);
  }

  onCheckboxChange=(text,index,dataIndex) => {
    let { dataSource } = this.state
    dataSource.map(item => {
      if(item.id == index.id){
        item[dataIndex] = !text
      }
    })
    this.setState({
      dataSource
    })
  }

  render() {
    const pageId = this.props.location.query.PageId;
    let { dataSource,columns } = this.state
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',
        name: record.name,
      }),
    };
        
    return (
      <div style={{borderRadius:'5px',background:'white',padding:'10px'}}>
        <CustomerHeader />
        {/* <Card> */}
          <div style={{margin:'10px 0'}}>
            <Button style={{marginRight:'1rem'}} type="primary">审核</Button>
            <Button type="primary">同步</Button>
          </div>
          <Table rowSelection={rowSelection} dataSource={dataSource} scroll={{ x: true }} columns={columns} bordered/>
        {/* </Card> */}
      </div>
    );
  }
}

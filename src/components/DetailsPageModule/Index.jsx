import React from 'react'
import _ from 'lodash';
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
  Tabs,
  Divider,
} from 'antd';
import ReportTable from '../ReportTable/index';// 报表组件
import NewBreadcrumb from '@/components/Breadcrumb/Index'; //面包屑组件
import CustomerHeader from '@/components/CustomerHeader'; //头部组件
import DetailPage from '../DetailPage/Index'; // 主表详情组件
import ChildTable from '../ChildTable/Index'; //子表组件
import Detailbuttons from '@/components/DetailButtons'; // 详情页头部的按钮栏
import { connect } from 'dva';
import styles from './Index.less'

@Form.create()
@connect(({ tableTemplate, loading }) => ({
  tableTemplate,
  loadingG:
    loading.effects['tableTemplate/getDetailPageConfig'] ||
    loading.effects['tableTemplate/save'] ||
    loading.effects['tableTemplate/getDetailPage'] ||
    loading.effects['tableTemplate/getSummaryPageConfig'] ||
    loading.effects['tableTemplate/getDetailSave']
}))

//详情页模块
export default class DetailsPageModule extends React.Component {
  getMasterTable=()=>{
    let MasterTable = this.DetailPage.getFieldsValue()
    return MasterTable
  }
  render() {
    return (
      <div>
        {/* 报表部分 */}
        {this.props.tableTemplate.reportFormURL && (
          <ReportTable />
        )}
        {/* 详情页部分 */}
        {!this.props.tableTemplate.reportFormURL && (
          <div
            style={{ display: this.props.tableTemplate.isEdit ? 'block' : 'none' }}
            className={styles.SingleTableDetail}
          >
            {/* 头部title/面包屑 */}
            <CustomerHeader />
            <div>
              <Detailbuttons detailForm={this.DetailPage} />
            </div>
            < hr
              style={{ backgroundColor: '#d3d3d3', margin: '0', height: '1px', border: 'none', marginBottom: '5px', marginTop: 0 }}
            />
            <div className="BasicEditSearch">
              <span style={{ fontSize: '1.2rem' }}>{this.props.subtitle}</span>
              {/* 主表内容 */}
              <DetailPage
                ref={dom => (this.DetailPage = dom)}
                disabled={this.props.tableTemplate.disEditStyle}
              />
            </div>
            {/* 子表表格 */}
            <Card
              style={{ width: '100%', marginTop: '1.2rem', }}
              bodyStyle={{
                paddingTop: 0,
                paddingLeft: '16px',
                paddingRight: '16px',
                paddingBottom: '16px',
                display: this.props.tableTemplate.detailColumns.child ? 'block' : 'none',
              }}
            >
              <div style={{ marginTop: '5px' }}>
                <ChildTable getMasterTable={(value)=>this.getMasterTable(value)} />
              </div>
            </Card>
          </div>
          )}
      </div>
    )
  }
}
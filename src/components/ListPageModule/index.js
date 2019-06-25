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
  Spin,
  Tabs,
  Divider,
} from 'antd';
import ReportTable from '@/components/ReportTable/index';// 报表组件
import NewBreadcrumb from '@/components/Breadcrumb/Index'; //面包屑组件
import CustomerHeader from '@/components/CustomerHeader'; //头部组件
import DetailPage from '@/components/DetailPage/Index'; // 主表详情组件
import ChildTable from '@/components/ChildTable/Index'; //子表组件
import Detailbuttons from '@/components/DetailButtons'; // 详情页头部的按钮栏
import TableButtons from '@/components/TableButtons'; // 列表页头部的按钮栏
import SearchBar from '@/components/SearchBar/index'; //搜索栏
import TableList from '@/components/TableList/index';//列表表格



import { connect } from 'dva';
import styles from './Index.less'

@Form.create()
@connect(({ tableTemplate, loading }) => ({
  tableTemplate,
  loadingG:
    loading.effects['tableTemplate/getDetailPageConfig'] ||
    loading.effects['tableTemplate/save'] ||
    loading.effects['tableTemplate/getDetailPage'] ||
    loading.effects['tableTemplate/getSummaryPageConfig'],
}))

//详情页模块
export default class DetailsPageModule extends React.Component {

  render() {
    const { isEdit } = this.props.tableTemplate;
    return (
      <div
        style={{ display: isEdit ? 'none' : 'block' }}
        className={styles.SingleTable}
      >
        {/* 头部title/面包屑 */}
        <CustomerHeader />

        <div
          className="BasicDataBody"
          style={{ minHeight: '35px', display: 'flex', flexWrap: 'wrap' }}
        >
          <Col span={7} style={{ lineHeight: '41px', whiteSpace: 'nowrap' }}>
            <TableButtons />
          </Col>
          <Col span={17}>
            <SearchBar />
          </Col>
        </div>
        <hr style={{ backgroundColor: '#d3d3d3', height: '1px', border: 'none', marginBottom: '5px', marginTop: 0 }} />
        <div>
          <TableList />
        </div>
      </div>
    )
  }
}
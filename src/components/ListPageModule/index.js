import React from 'react';
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
import moment from 'moment';
import ReportTable from '@/components/ReportTable/index'; // 报表组件
import NewBreadcrumb from '@/components/Breadcrumb/Index'; //面包屑组件
import CustomerHeader from '@/components/CustomerHeader'; //头部组件
import DetailPage from '@/components/DetailPage/Index'; // 主表详情组件
import ChildTable from '@/components/ChildTable/Index'; //子表组件
import Detailbuttons from '@/components/DetailButtons'; // 详情页头部的按钮栏
import TableButtons from '@/components/TableButtons'; // 列表页头部的按钮栏
import SearchBar from '@/components/SearchBar/index'; //搜索栏
import TableList from '@/components/TableList/EditTable'; //列表表格
import TestTableList from '@/components/TableList/TestIndex'; //测试页面
import SkeletonCom from '@/components/Skeleton/Index';

import { connect } from 'dva';
import styles from './Index.less';

@Form.create()
@connect(({ tableTemplate, loading }) => ({
  tableTemplate,
  loadingG:
    loading.effects['tableTemplate/getDetailPageConfig'] ||
    loading.effects['tableTemplate/getDetailPage'] ||
    loading.effects['tableTemplate/getSummaryPageConfig'],
}))

//详情页模块
export default class DetailsPageModule extends React.Component {
  state = {
    selectedRowKeys: [],
    isSkeleton: true,
  };
  componentWillReceiveProps = newProps => {
    if (newProps.loadingGG != this.state.isSkeleton) {
      this.setState({
        isSkeleton: newProps.loadingGG,
      });
    }
  };
  onJump = e => {
    this.props.dispatch({
      type: 'tableTemplate/changeState',
      payload: { disEditStyle: true },
    });
    this.props.dispatch({ type: 'tableTemplate/save', payload: { selectDate: e } });
    this.props.dispatch({
      type: 'tableTemplate/getDetailPage',
      payload: { ID: e.ID, ObjectType: e.ObjectType, pageId: this.props.tableTemplate.pageId },
      callback: res => {
        if (res.status === 'success') {
          this.props.dispatch({ type: 'tableTemplate/getChildTable' });
        }
      },
    });
    // 改变组件状态
    this.props.dispatch({
      type: 'tableTemplate/changeState',
      payload: { isEdit: true, buttonType: true, isNewSave: false },
    });
  };
  renderColumn = (text, item, record) => {
    // debugger
    if (!text || !item.widgetType) {
      return (
        <span style={{ display: 'inline-block', width: '100%', textAlign: 'right' }}>{text}</span>
      );
    }
    if (item.hyperLink && item.widgetType === 'Date') {
      return (
        <a onClick={this.onJump.bind(this, record)}>
          {text ? moment(text).format('YYYY-MM-DD') : null}
        </a>
      );
    } else if (item.hyperLink && item.widgetType === 'DateTime') {
      return (
        <a onClick={this.onJump.bind(this, record)}>
          {text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null}
        </a>
      );
    } else if (item.hyperLink) {
      return <a onClick={this.onJump.bind(this, record)}>{text}</a>;
    } else if (item.widgetType === 'Date') {
      return <span>{text ? moment(text).format('YYYY-MM-DD') : null}</span>;
    } else if (item.widgetType === 'DateTime') {
      return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null}</span>;
    } else if (item.widgetType === 'Number') {
      return (
        <span style={{ display: 'inline-block', width: '100%', textAlign: 'right' }}>{text}</span>
      );
    } else {
      return <span>{text}</span>;
    }
  };
  render() {
    const { selectedRowKeys, isSkeleton } = this.state;
    const { isEdit } = this.props.tableTemplate;
    return (
      <div style={{ display: isEdit ? 'none' : 'block' }} className={styles.SingleTable}>
        <SkeletonCom type="listPage" loading={this.props.loadingGG || false} />
        <div style={{ display: isSkeleton ? 'none' : 'block' }}>
          {/* 头部title/面包屑 */}
          <CustomerHeader />
          {!this.props.tableTemplate.reportFormURL && (
            <div>
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
              <hr
                style={{
                  backgroundColor: '#d3d3d3',
                  height: '1px',
                  border: 'none',
                  marginBottom: '5px',
                  marginTop: 0,
                }}
              />
              <div>
                <TableList onJump={this.onJump} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

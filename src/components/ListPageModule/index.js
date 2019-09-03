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
import TableList from '@/components/TableList/index'; //列表表格

import { connect } from 'dva';
import styles from './Index.less';

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
  state={
    selectedRowKeys: [],
  }
  onJump = e => {
    this.props.dispatch({
      type: 'tableTemplate/changeState',
      payload: { disEditStyle: true }
    })
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
      payload: { isEdit: true, buttonType: true, isNewSave: false }
    })
  };
  renderColumn = (text, item, record) => {
    // debugger
    if (!text || !item.widgetType) {
      return (<span
        style={{ display: 'inline-block', width: '100%', textAlign: 'right' }}
      >
        {text}
      </span>)
    }
    if (item.hyperLink && item.widgetType === 'Date') {
      return (
        <a onClick={this.onJump.bind(this, record)}>
          {text ? moment(text).format('YYYY-MM-DD') : null}
        </a>
      )
    } else if (item.hyperLink && item.widgetType === 'DateTime') {
      return (
        <a onClick={this.onJump.bind(this, record)}>
          {text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null}
        </a>
      )
    } else if (item.hyperLink) {
      return <a onClick={this.onJump.bind(this, record)}>{text}</a>
    } else if (item.widgetType === 'Date') {
      return (
        <span>{text ? moment(text).format('YYYY-MM-DD') : null}</span>
      )
    } else if (item.widgetType === 'DateTime') {
      return (
        <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null}</span>
      )
    } else if (item.widgetType === 'Number') {
      return (
        <span
          style={{ display: 'inline-block', width: '100%', textAlign: 'right' }}
        >
          {text}
        </span>
      )
    } else {
      return (
        <span>
          {text}
        </span>
      )
    }
  }
  render() {
    //test -------------------------------
    let listColumnData = [];
    _.get(this.props.tableTemplate, 'tableColumns').map((item, index) => {
      if (item.colorMark) {
        let list = {
          ...item,
          title: <Tooltip title={item.title + '[' + item.dataIndex + ']'}>
            <span>{item.title}</span>
          </Tooltip>,
          width: 200,
          sorter: item.sorTable ? true : false,
          sortDirections: ['descend', 'ascend'],
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
        if(index == 0){
          delete list.width
        }
        listColumnData.push(list);
        
      } else {
        let column = {
          ...item,
          title: <Tooltip title={item.title + '[' + item.dataIndex + ']'}>
            <span>{item.title}</span>
          </Tooltip>,
          width: 200,
          sorter: item.sorTable ? true : false,
          sortDirections: ['descend', 'ascend'],
          render: (text, record) =>
            this.renderColumn(text, item, record)
        }
        if(index == 0){
          delete column.width
        }
        listColumnData.push(column);
      }
    });
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',
        name: record.name,
      }),
    };
    ///test --------------------------------
    const { isEdit } = this.props.tableTemplate;
    return (
      <div style={{ display: isEdit ? 'none' : 'block' }} className={styles.SingleTable}>
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
              <TableList columns={listColumnData}/>
            </div>
          </div>
        )}
      </div>
    );
  }
}

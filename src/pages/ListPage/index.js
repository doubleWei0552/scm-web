import React from 'react';
import _ from 'lodash';
import {
  Button,
  Select,
  Row,
  Col,
  Table,
  Tooltip,
  Form,
} from 'antd';
import moment from 'moment';
import router from 'umi/router';
import ReportTable from '@/components/ReportTable/index'; // 报表组件
import NewBreadcrumb from '@/components/Breadcrumb/Index'; //面包屑组件
import CustomerHeader from '@/components/CustomerHeader/newIndex'; //头部组件
import TableButtons from '@/components/TableButtons'; // 列表页头部的按钮栏
import SearchBar from '@/components/SearchBar/index'; //搜索栏
import TestTableList from '@/components/TableList/TestIndex'; //测试页面
import SkeletonCom from '@/components/Skeleton/Index' //骨架屏组件

import { connect } from 'dva';
import { withRouter } from 'react-router'
import styles from './Index.less';

@Form.create()
@connect(({ listPage, loading }) => ({
  listPage,
  loadingG:
    loading.effects['listPage/getPagelist'] ||
    loading.effects['listPage/save'] ||
    loading.effects['listPage/getSummaryPageConfig']
}))

//列表页模块
class ListPageModule extends React.Component {
  state={
    selectedRowKeys: [],
  }
  componentDidMount = () => {
    const pageId = this.props.location.query.PageId*1;
    let PageIdOld = this.props.listPage.pageId
    if(pageId != PageIdOld){
      this.props.dispatch({ type: 'listPage/save', payload: { pageId } });
      this.props.dispatch({
        type: 'listPage/getPagelist',
        payload: { pageId },
      });
      this.props.dispatch({ type: 'listPage/getSummaryPageConfig',payload:{pageId:pageId} });
    }
    this.props.dispatch({
      type:'listPage/save',
      payload:{
        pageId
      }
    })
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname != this.props.location.pathname) {
      const pageId = nextProps.location.query.PageId*1;
      this.props.dispatch({ type: 'listPage/save', payload: { pageId } });
      this.props.dispatch({
        type: 'listPage/getPagelist',
        payload: { pageId },
      });
      this.props.dispatch({ type: 'listPage/getSummaryPageConfig',payload:{pageId:pageId} });
    } 
  }

  componentDidUpdate=()=>{
    // const pageId = this.props.location.query.PageId*1;
    // this.props.dispatch({ type: 'listPage/save', payload: { pageId } });
    // this.props.dispatch({
    //   type: 'listPage/getPagelist',
    //   payload: { pageId },
    // });
    // this.props.dispatch({ type: 'listPage/getSummaryPageConfig',payload:{pageId:pageId} });
  }

  onJump = e => {
    let {pathname,search} = this.props.location
    let replaceData = `detailSee/${e.ID}`
    let newPathName = pathname.replace(/list/g,`${replaceData}`) + search
    router.push(newPathName)
  }

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
    let { loadingG } = this.props
    let listColumnData = [];
    _.get(this.props.listPage, 'tableColumns').map((item, index) => {
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
    return (
      <div style={{background:'white',padding:'10px'}} className={styles.SingleTable}>
        <SkeletonCom loading={loadingG || false}/>
        <div style={{ display: loadingG ? 'none' : 'block' }}>
          {/* 头部title/面包屑 */}
          <CustomerHeader />
          <div className="BasicDataBody" style={{ minHeight: '35px', display: 'flex', flexWrap: 'wrap' }}>
          <Col span={7} style={{ lineHeight: '41px', whiteSpace: 'nowrap' }}>
              <TableButtons location={this.props.location} />
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
              marginTop: 0,
          }}
          />
          <div>
          <TestTableList onJump={this.onJump} columns={listColumnData}/>
          </div>
        </div>
        
      </div>
    );
  }
}

export default withRouter(ListPageModule)
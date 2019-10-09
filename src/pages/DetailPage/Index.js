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
import NewBreadcrumb from '@/components/Breadcrumb/Index'; //面包屑组件
import CustomerHeader from '@/components/CustomerHeader/newIndex'; //头部组件
import DetailPage from '@/components/DetailPage/Index'; // 主表详情组件
import ChildTable from '@/components/ChildTable/Index'; //子表组件
import NewChildTableEdit from '@/components/NewChildTable/NewChildTableEdit.jsx'; //重构的子表部分
import Detailbuttons from '@/components/DetailButtons'; // 详情页头部的按钮栏
import SkeletonCom from '@/components/Skeleton/Index'
import { connect } from 'dva';
import styles from './Index.less'

let child={}

@Form.create()
@connect(({ detailPage, loading }) => ({
  detailPage,
  loadingG:
    loading.effects['detailPage/getDetailPageConfig'] ||
    loading.effects['detailPage/save'] ||
    loading.effects['detailPage/getDetailPage']
}))

//详情页编辑模块
export default class EditDetailPage extends React.Component {
  componentDidMount=()=>{
    let { detailId } = this.props.match.params
    let { ObjectType,PageId } = this.props.location.query
    let { detailIdOld,PageIdOld } = this.props.detailPage
    if((detailIdOld != detailId) && (PageIdOld != PageId)){
      this.props.dispatch({
          type:'detailPage/getDetailPageConfig',
          payload:{pageId:PageId*1}
      })
      this.props.dispatch({ type: 'listPage/getSummaryPageConfig',payload:{pageId:PageId*1} })
      this.props.dispatch({
          type:'detailPage/getDetailPage',
          payload:{
              ID: detailId*1,
              ObjectType,
              pageId: PageId*1,
          }
      })
    }
    this.props.dispatch({
      type:'detailPage/save',
      payload:{
        detailIdOld: detailId ,
        PageIdOld: PageId,
      }
    })
  }
  getMasterTable = () => {
    let MasterTable = this.DetailPage.getFieldsValue()
    return MasterTable
  }
  onRef = (ref) => {
    child = ref
  }
  render() {
    let { loadingG } = this.props
    return (
        <div className={styles.DetailMain} >
        <SkeletonCom type='detailPage' loading={loadingG || false}/>
        <div style={{ display: loadingG ? 'none' : 'block' }}>
          {/* 头部title/面包屑 */}
          <CustomerHeader/>
          <div>
              <Detailbuttons saveType='edit' location={this.props.location}  detailForm={this.DetailPage} />
          </div>
          < hr style={{ backgroundColor: '#d3d3d3', margin: '0', height: '1px', border: 'none', marginBottom: '5px', marginTop: 0 }} />
          <div className="BasicEditSearch">
              <span style={{ fontSize: '1.2rem' }}>{this.props.subtitle}</span>
              {/* 主表内容 */}
              <DetailPage onRef={this.onRef} 
              ref={dom => (this.DetailPage = dom)}
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
              display: this.props.detailPage.detailColumns.child ? 'block' : 'none',
              }}
          >
              {/* <div style={{ marginTop: '5px' }}>
              <ChildTable disEditStyle={false} getMasterTable={(value) => this.getMasterTable(value)} />
            </div> */}
              <NewChildTableEdit dispatch={this.props.dispatch}/>
          </Card>
        </div>
        </div>
    )
  }
}
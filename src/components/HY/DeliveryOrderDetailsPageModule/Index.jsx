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
  Spin,
  InputNumber,
  Card,
  Popconfirm,
  message,
  Tabs,
  Divider,
} from 'antd';
import ReportTable from '@/components/ReportTable/index'; // 报表组件
import NewBreadcrumb from '@/components/Breadcrumb'; //面包屑组件
import CustomerHeader from '@/components/CustomerHeader'; //头部组件
import DetailPage from '@/components/DetailPage/Index'; // 主表详情组件
// import ChildTable from '@/components/HY/DeliveryChildTable/Index'; //子表组件
import ChildTable from '@/components/HY/ChildTable/Index'; //子表组件

import Detailbuttons from '@/components/HY/DeliveryDetailButtons'; // 详情页头部的按钮栏
import SkeletonCom from '@/components/Skeleton';
import { connect } from 'dva';
import styles from './Index.less';

let child = {};

@Form.create()
@connect(({ tableTemplate, loading }) => ({
  tableTemplate,
  loadingG:
    loading.effects['tableTemplate/getDetailPageConfig'] ||
    loading.effects['tableTemplate/save'] ||
    loading.effects['tableTemplate/getDetailSave'] ||
    loading.effects['tableTemplate/getTransactionProcess'] ||
    loading.effects['tableTemplate/getSummaryPageConfig'] ||
    loading.effects['tableTemplate/getDetailPage'],
}))

//详情页模块
export default class DetailsPageModule extends React.Component {
  state = {
    isSkeleton: true,
  };

  componentWillReceiveProps = newProps => {
    if (newProps.loadingGG != this.state.isSkeleton) {
      this.setState({
        isSkeleton: newProps.loadingGG,
      });
    }
  };

  getMasterTable = () => {
    let MasterTable = this.DetailPage.getFieldsValue();
    return MasterTable;
  };
  onRef = ref => {
    this.child = ref;
  };
  //保存重新渲染新的数据
  renderDataWhenSave = data => {
    this.props.dispatch({
      type: 'tableTemplate/save',
      payload: {
        isEditSave: false,
        isEdit: true,
        buttonType: true,
        isNewSave: false,
        disEditStyle: true,
      },
    });
    this.child.onRenderData(data, this.forceUpdate());
  };

  render() {
    let { isSkeleton } = this.state;
    return (
      <div>
        {/* 报表部分 */}
        {this.props.tableTemplate.reportFormURL && <ReportTable />}
        {/* 详情页部分 */}
        {!this.props.tableTemplate.reportFormURL && (
          <div
            style={{ display: this.props.tableTemplate.isEdit ? 'block' : 'none' }}
            className={styles.SingleTableDetail}
          >
            <SkeletonCom type="detailPage" loading={this.props.loadingGG || false} />
            <div style={{ display: isSkeleton ? 'none' : 'block' }}>
              {/* 头部title/面包屑 */}
              <CustomerHeader />
              <div>
                <Detailbuttons
                  renderDataWhenSave={e => this.renderDataWhenSave(e)}
                  detailForm={this.DetailPage}
                />
              </div>
              <hr
                style={{
                  backgroundColor: '#d3d3d3',
                  margin: '0',
                  height: '1px',
                  border: 'none',
                  marginBottom: '5px',
                  marginTop: 0,
                }}
              />
              {/* <Spin spinning={this.props.loadingButton || false} tip="Loading..."> */}
              <div className="BasicEditSearch">
                <span style={{ fontSize: '1.2rem' }}>{this.props.subtitle}</span>
                {/* 主表内容 */}
                <DetailPage
                  onRef={this.onRef}
                  ref={dom => (this.DetailPage = dom)}
                  disabled={this.props.tableTemplate.disEditStyle}
                />
              </div>
              {/* 子表表格 */}
              <Card
                style={{ width: '100%', marginTop: '1.2rem' }}
                bodyStyle={{
                  paddingTop: 0,
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  paddingBottom: '16px',
                  display: this.props.tableTemplate.detailColumns.child ? 'block' : 'none',
                }}
              >
                <div style={{ marginTop: '5px' }}>
                  <ChildTable getMasterTable={value => this.getMasterTable(value)} detailForm={this.DetailPage} />
                </div>
              </Card>
              {/* </Spin> */}
            </div>
          </div>
        )}
      </div>
    );
  }
}

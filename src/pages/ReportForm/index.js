import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import {
  Table,
  Card,
  Icon,
} from 'antd';
import router from 'umi/router'
import CustomerHeader from '@/components/CustomerHeader'; //头部组件

@connect(({ tableTemplate, loading }) => ({
  tableTemplate,
  loadingG: loading.effects['tableTemplate/getDetailPage'],
}))
class ReportTable extends PureComponent {
  state = {}

  //关闭报表界面
  closeReportForm = () => {
    // console.log('关闭报表')
    // this.props.dispatch({ type: 'tableTemplate/save', payload: { reportFormURL: null } });
    // router.goBack()
  };
  componentDidMount = () => {
    let pageId = this.props.location.query.PageId*1
    this.props.dispatch({ type: 'tableTemplate/getReportForm',payload:{pageId}});
    this.props.dispatch({
      type: 'tableTemplate/save',
      payload: { selectedRowKeys: [] }
    })
  }

  render() {
    let url = _.get(this.props.tableTemplate, 'reportFormURLPage')
    return (
      <div
        style={{
          //   display: this.props.tableTemplate.reportFormURL ? 'block' : 'none',
          height: '100%',
          padding:'10px',
          background:'white',
          borderRadius: '5px'
        }}
      >
        <CustomerHeader />
        <Card
          // title="报表"
          // extra={<Icon onClick={()=>this.closeReportForm()} type="close" />}
          style={{ width: '100%', height: '1000px',borderTop:'none' }}
          bodyStyle={{ padding: 0 }}
        >
          <iframe
            // src={this.props.location.query.url}
            src={url}
            frameBorder="0"
            width="100%"
            height="900"
          />
        </Card>
      </div>
    )
  }
}

export default ReportTable
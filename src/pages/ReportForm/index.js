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

@connect(({ tableTemplate, loading }) => ({
  tableTemplate,
  loadingG: loading.effects['tableTemplate/getDetailPage'],
}))
class ReportTable extends PureComponent {
  state = {}

  //关闭报表界面
  closeReportForm = () => {
    this.props.dispatch({ type: 'tableTemplate/save', payload: { reportFormURL: null } });
    // router.goBack()
  };
  componentDidMount =()=>{
    console.log('报表',this.props)
  }

  render() {
    return (
      <div
        style={{
        //   display: this.props.tableTemplate.reportFormURL ? 'block' : 'none',
          height: '100%',
        }}
      >
        <Card
          title="报表部分"
          // extra={<Icon onClick={this.closeReportForm} type="close" />}
          style={{ width: '100%', height: '1000px' }}
          bodyStyle={{ padding: 0 }}
        >
          <iframe
            src={this.props.location.query.url}
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
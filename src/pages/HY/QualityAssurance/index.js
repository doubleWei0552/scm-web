import React from 'react';
import MultiTableTemplate from '@/components/HY/DeliveryOrderTemplate/MultiTableTemplate';
import router from 'umi/router';
import CatchError from '@/components/CatchError';
import { connect } from 'dva';
import { Card } from 'antd';

@connect(({ tableTemplate, functionSet }) => ({
  tableTemplate,
  functionSet,
}))

//DeliveryOreer
export default class QualityAssurance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const pageId = this.props.location.query.PageId;
    return (
      <div>
        <Card></Card>
      </div>
    );

    // return <div >往往是</div>
  }
}

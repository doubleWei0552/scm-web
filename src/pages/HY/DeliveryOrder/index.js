import React from 'react';
import MultiTableTemplate from '@/components/HY/DeliveryOrderTemplate/MultiTableTemplate';
import router from 'umi/router';
import CatchError from '@/components/CatchError';
import { connect } from 'dva';

@connect(({ tableTemplate, functionSet }) => ({
  tableTemplate,
  functionSet,
}))

//DeliveryOreer
export default class TemplatePage extends React.Component {
  render() {
    const pageId = this.props.location.query.PageId;
    return <MultiTableTemplate key={pageId} {...this.props} />;

    // return <div >往往是</div>
  }
}

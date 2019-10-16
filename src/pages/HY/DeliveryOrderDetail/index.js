import React from 'react';
import MultiTableTemplate from '@/components/HY/Template/MultiTableTemplate';
import router from 'umi/router';
import CatchError from '@/components/CatchError';
import { connect } from 'dva';
import { Card } from 'antd';

@connect(({ tableTemplate, functionSet }) => ({
  tableTemplate,
  functionSet,
}))

//DeliveryOreer
export default class TemplatePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <Card />
        <Card />
      </div>
    );
  }
}

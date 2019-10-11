import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';

import { Form, Row, Col, Select, Input, Button, Icon, DatePicker } from 'antd';
import NewBreadcrumb from '../Breadcrumb/Index'; //面包屑组件
import styles from './style.less';




@Form.create()
@connect(({ tableTemplate, loading }) => ({
  tableTemplate,
  loadingG: loading.effects['tableTemplate/getDetailPage'],
}))
class CustomerHeader extends PureComponent {

  componentDidMount() { }

  UNSAFE_componentWillReceiveProps(newProps) {

  }
  render() {
    const { tableColumns = [], isEdit } = this.props.tableTemplate;
    { this.props.tableTemplate.detailColumns.title }
    const { title = '' } = _.get(this.props.tableTemplate, 'tableColumnsData')
    return (
      <header className={styles.header}>
        <span className={styles.tableTitle}>
          {isEdit ? _.get(this.props.tableTemplate, 'detailColumns.title') : _.get(this.props.tableTemplate, 'tableColumnsData.title')}
        </span>
        <NewBreadcrumb {...this.props.tableTemplate} />
      </header>
    );
  }
}

export default CustomerHeader;

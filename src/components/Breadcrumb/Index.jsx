import React from 'react'
import { Breadcrumb } from 'antd'
import { connect } from 'dva';
import Link from 'umi/link';

@connect(({ tableTemplate, loading }) => ({
  tableTemplate,
  loadingG: loading.effects['tableTemplate/getDetailPage'],
}))
export default class NewBreadcrumb extends React.Component {
  render() {
    const { isEdit } = this.props.tableTemplate
    return (
      <Breadcrumb style={{ height: '35px', lineHeight: '35px' }}>
        {
          _.get(this.props.tableColumnsData, 'breadCrumbs', []).map((item, index) => {
            if (index == 0) {
              return <Breadcrumb.Item key={index}>
                <Link to="/account/me" key="Home" style={{ marginRight: '5px' }}>
                  首页
                </Link>
                / {item}
              </Breadcrumb.Item>
            } else {
              if (isEdit && index == _.get(this.props.tableColumnsData, 'breadCrumbs', []).length - 1) {
                return <Breadcrumb.Item key={index}>
                  {item}详情页
                            </Breadcrumb.Item>
              } else {
                return <Breadcrumb.Item key={index}>
                  {item}
                </Breadcrumb.Item>
              }
            }

          })
        }
      </Breadcrumb>
    )
  }
}
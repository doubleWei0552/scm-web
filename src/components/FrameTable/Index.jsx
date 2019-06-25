import React from 'react';
import { Card, Button, Icon, Table } from 'antd';

export default class FrameTable extends React.Component {
  static defaultProps = {
    CardTitle: '物料管理', //卡片的标题
    columns: [
      {
        title: 'Name',
        dataIndex: 'name',
        render: text => <a href="javascript:;">{text}</a>,
      },
      {
        title: 'Age',
        dataIndex: 'age',
      },
      {
        title: 'Address',
        dataIndex: 'address',
      },
    ],
    data: [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
      },
      {
        key: '4',
        name: 'Disabled User',
        age: 99,
        address: 'Sidney No. 1 Lake Park',
      },
    ],
  };
  render() {
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
    };
    return (
      <div>
        <Card
          bodyStyle={{ padding: '0' }}
          title={this.props.CardTitle}
          extra={
            <div>
              <Button type="primary" style={{ marginRight: '10px' }}>
                <Icon type="check" />
                确定
              </Button>
              <Button>
                <Icon type="close" />
                返回
              </Button>
            </div>
          }
        >
          <Table
            rowSelection={rowSelection}
            bordered
            pagination={{ showTotal: total => `共${total}条数据`, showSizeChanger: true }}
            columns={this.props.columns}
            dataSource={this.props.data}
          />
        </Card>
      </div>
    );
  }
}

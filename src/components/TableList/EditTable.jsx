import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import { Table, Input, InputNumber, Popconfirm, Form, Tooltip } from 'antd';

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

@connect(({ tableTemplate, loading }) => ({
  tableTemplate,
  loadingTable: loading.effects['tableTemplate/getPagination'],
  loadingG:
    loading.effects['tableTemplate/getDetailPageConfig'] ||
    loading.effects['tableTemplate/save'] ||
    loading.effects['tableTemplate/getDetailPage'] ||
    loading.effects['tableTemplate/getSummaryPageConfig'],
}))
class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data, editingKey: '' };
    this.columns = [
      {
        title: 'name',
        dataIndex: 'name',
        width: '25%',
        editable: true,
      },
      {
        title: 'age',
        dataIndex: 'age',
        width: '15%',
        editable: true,
      },
      {
        title: 'address',
        dataIndex: 'address',
        width: '40%',
        editable: true,
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a onClick={() => this.save(form, record.key)} style={{ marginRight: 8 }}>
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
              Edit
            </a>
          );
        },
      },
    ];
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  // table排序方法
  handleChange = (pagination, filters, sorter) => {
    console.log('list排序', pagination, filters, sorter);
    this.props.dispatch({ type: 'tableTemplate/save', payload: { sorterData: sorter } });
    const { current, pageSize = 10 } = pagination;
    let obj = {
      descend: 'DESC',
      ascend: 'ASC',
      undefined: null,
    };
    console.log('sorter', sorter);
    let { searchParams, pageId, sorterData } = this.props.tableTemplate;
    let value = sorter.field ? sorter.field + ' ' + obj[sorter.order] : null;
    this.props.dispatch({
      type: 'tableTemplate/getPagination',
      payload: { pageId, current, pageSize, summarySort: value, searchParams },
    });
    this.props.dispatch({
      type: 'tableTemplate/changeState',
      payload: { summarySort: value },
    });
  };

  // 分页的函数
  onShowSizeChange = (current, pageSize) => {
    const { pageId, sorterData, summarySort, searchParams } = this.props.tableTemplate;
    this.props.dispatch({
      type: 'tableTemplate/getPagination',
      payload: { pageId, current, pageSize, summarySort, searchParams },
    });
    this.props.dispatch({
      type: 'tableTemplate/changeState',
      payload: { pageSize },
    });
  };

  onJump = e => {
    this.props.dispatch({
      type: 'tableTemplate/changeState',
      payload: { disEditStyle: true },
    });
    this.props.dispatch({ type: 'tableTemplate/save', payload: { selectDate: e } });
    this.props.dispatch({
      type: 'tableTemplate/getDetailPage',
      payload: { ID: e.ID, ObjectType: e.ObjectType, pageId: this.props.tableTemplate.pageId },
      callback: res => {
        if (res.status === 'success') {
          this.props.dispatch({ type: 'tableTemplate/getChildTable' });
        }
      },
    });
    // 改变组件状态
    this.props.dispatch({
      type: 'tableTemplate/changeState',
      payload: { isEdit: true, buttonType: true, isNewSave: false },
    });
  };

  renderColumn = (text, item, record) => {
    // debugger
    if (!text || !item.widgetType) {
      return (
        <span style={{ display: 'inline-block', width: '100%', textAlign: 'right' }}>{text}</span>
      );
    }
    if (item.hyperLink && item.widgetType === 'Date') {
      return (
        <a onClick={this.onJump.bind(this, record)}>
          {text ? moment(text).format('YYYY-MM-DD') : null}
        </a>
      );
    } else if (item.hyperLink && item.widgetType === 'DateTime') {
      return (
        <a onClick={this.onJump.bind(this, record)}>
          {text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null}
        </a>
      );
    } else if (item.hyperLink) {
      return <a onClick={this.onJump.bind(this, record)}>{text}</a>;
    } else if (item.widgetType === 'Date') {
      return <span>{text ? moment(text).format('YYYY-MM-DD') : null}</span>;
    } else if (item.widgetType === 'DateTime') {
      return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null}</span>;
    } else if (item.widgetType === 'Number') {
      return (
        <span style={{ display: 'inline-block', width: '100%', textAlign: 'right' }}>{text}</span>
      );
    } else {
      return <span>{text}</span>;
    }
  };

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    let listColumnData = [];
    _.get(this.props.tableTemplate, 'tableColumns').map((item, index) => {
      if (item.colorMark) {
        let list = {
          ...item,
          title: (
            <Tooltip title={item.title + '[' + item.dataIndex + ']'}>
              <span>{item.title}</span>
            </Tooltip>
          ),
          sorter: item.sorTable ? true : false,
          sortDirections: ['descend', 'ascend'],
          editable: true,
          onCell: record => ({
            record,
            inputType: item.dataIndex === 'age' ? 'number' : 'text',
            dataIndex: item.dataIndex,
            title: item.title,
            editing: this.isEditing(record),
          }),
          // fixed: index === 0,
          render: (text, record) => {
            if (!text) return;
            let color = text.split('-')[0];
            let newText = text.split('-')[text.split('-').length - 1];
            return (
              <span>
                <span
                  style={{
                    display: 'inline-block',
                    background: color,
                    width: '6px',
                    height: '6px',
                    marginRight: '5px',
                    marginBottom: '2px',
                    borderRadius: '50%',
                  }}
                />
                {newText}
              </span>
            );
          },
        };
        listColumnData.push(list);
      } else {
        let column = {
          ...item,
          title: (
            <Tooltip title={item.title + '[' + item.dataIndex + ']'}>
              <span>{item.title}</span>
            </Tooltip>
          ),
          editable: true,
          sorter: item.sorTable ? true : false,
          sortDirections: ['descend', 'ascend'],
          // fixed: index === 0,
          onCell: record => ({
            record,
            inputType: item.dataIndex === 'age' ? 'number' : 'text',
            dataIndex: item.dataIndex,
            title: item.title,
            editing: this.isEditing(record),
          }),
          render: (text, record) => this.renderColumn(text, item, record),
        };
        listColumnData.push(column);
      }
    });
    listColumnData.push({
      title: 'operation',
      dataIndex: 'operation',
      render: (text, record) => {
        const { editingKey } = this.state;
        const editable = this.isEditing(record);
        return editable ? (
          <span>
            <EditableContext.Consumer>
              {form => (
                <a onClick={() => this.save(form, record.key)} style={{ marginRight: 8 }}>
                  Save
                </a>
              )}
            </EditableContext.Consumer>
            <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
            Edit
          </a>
        );
      },
    });
    console.log('this.props', this.props);
    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered
          onChange={this.handleChange}
          scroll={{ x: true }}
          dataSource={_.get(this.props.tableTemplate, 'pagination.list')}
          columns={listColumnData}
          rowClassName="editable-row"
          pagination={{
            showSizeChanger: true,
            total: _.get(this.props.tableTemplate, 'pagination.totalRecord'),
            current: _.get(this.props.tableTemplate, 'pagination.currentPage'),
            pageSize: _.get(this.props.tableTemplate, 'pagination.pageSize'),
            pageSizeOptions: ['10', '20', '50', '100', '300'],
            onShowSizeChange: this.onShowSizeChange,
            // onChange: ()=>this.onPageChange(),
            showTotal: total => `共${this.props.tableTemplate.pagination.totalRecord}条数据`,
          }}
        />
      </EditableContext.Provider>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;
// ReactDOM.render(<EditableFormTable />, mountNode);

import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import { Table, Input, InputNumber, Popconfirm, Form, Tooltip, Icon, Button, Radio } from 'antd';
import Highlighter from 'react-highlight-words';
import { Resizable } from 'react-resizable';
import styles from './index.less';

const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: true }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

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
    this.state = {
      data,
      editingKey: '',
      selectedRowKeys: [],
      columns: [],
      isResize: false,
      fixedIndex: '',
    };
  }

  componentDidMount() { }

  componentWillReceiveProps(newProps) {
    let widthStandard = {
      Select:150,
      Reference:150,
      TreeSelector:150,
      Date:120,
      Number:115,
      DataTime:150,
      Text:150,
    }
    // if (this.props.tableTemplate.tableColumns !== newProps.tableTemplate.tableColumns) {
    let listColumnData = [];
    _.get(newProps.tableTemplate, 'tableColumns').map((item, index) => {
      if (item.colorMark) {
        let list = {
          ...item,
          title: (
            <div>
              <Tooltip title={item.title + '[' + item.dataIndex + ']'}>
                <span>{item.title}</span>
              </Tooltip>
            </div>
          ),
          sorter: item.sorTable ? true : false,
          sortDirections: ['descend', 'ascend'],
          editable: true,
          ellipsis: true,
          width: widthStandard[item.widgetType] || 200,
          ...this.getColumnSearchProps(item.dataIndex),
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
              <div>
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
              </div>
            );
          },
        };
        listColumnData.push(list);
      } else {
        let column = {
          ...item,
          title: (
            <div>
              <Tooltip title={item.title + '[' + item.dataIndex + ']'}>
                <span>{item.title}</span>
              </Tooltip>
            </div>
          ),
          editable: true,
          sorter: item.sorTable ? true : false,
          sortDirections: ['descend', 'ascend'],
          width: widthStandard[item.widgetType] || 200,
          // fixed: index === 0,
          ...this.getColumnSearchProps(item.dataIndex),
          onCell: record => ({
            record,
            inputType: item.dataIndex === 'age' ? 'number' : 'text',
            dataIndex: item.dataIndex,
            title: item.title,
            editing: this.isEditing(record),
          }),
          render: (text, record) => {
            return <div>{this.renderColumn(text, item, record)}</div>;
          },
        };
        listColumnData.push(column);
      }
    });
    this.setState({
      columns: listColumnData,
    });
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Radio.Group
          onChange={e => this.setState({ fixedValue: e.target.value, fixedIndex: dataIndex })}
          value={this.state.fixedIndex === dataIndex ? this.state.fixedValue : null}
          style={{ display: 'block', height: '30px', lineHeight: '30px' }}
        >
          <Radio value="left">左</Radio>
          <Radio value="right">右</Radio>
        </Radio.Group>
        <Button
          type="primary"
          onClick={() => this.handleFixed(dataIndex, clearFilters)}
          size="small"
          style={{ width: 50, marginRight: 8 }}
        >
          确认
        </Button>
        <Button
          onClick={() => this.handleReset(dataIndex, clearFilters)}
          size="small"
          style={{ width: 50 }}
        >
          重置
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon
        type="filter"
        theme="filled"
        style={{ color: this.state[dataIndex] ? '#1890ff' : undefined }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });

  // 设置左右列锁定
  handleFixed = (dataIndex, clearFilters) => {
    const { fixedIndex, fixedValue, columns } = this.state;
    clearFilters();
    // const { columns } = this.state;
    const index = _.findIndex(columns, item => item.dataIndex === fixedIndex);
    if (index > -1 && fixedValue === 'left') {
      _.map(columns, (item, idx) => {
        if (idx <= index) {
          item.fixed = fixedValue;
        }
      });
    } else if (index > -1 && fixedValue === 'right') {
      _.map(columns, (item, idx) => {
        if (idx >= index) {
          item.fixed = fixedValue;
        }
      });
      // this.setState({
      //   columns,
      // });
    }
    this.setState({
      columns,
    });
  };

  // 设置左右列锁定
  handleReset = (dataIndex, clearFilters) => {
    clearFilters();
    const { columns } = this.state;
    _.map(columns, data => {
      data.fixed = false;
    });

    this.setState({
      columns,
    });
  };

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save = (form, key) => {
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
  };

  edit = key => {
    this.setState({ editingKey: key });
  };

  // table排序方法
  handleChange = (pagination, filters, sorter) => {
    this.props.dispatch({ type: 'tableTemplate/save', payload: { sorterData: sorter } });
    const { current, pageSize = 10 } = pagination;
    let obj = {
      descend: 'DESC',
      ascend: 'ASC',
      undefined: null,
    };
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

  // 列表页数据选择
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.props.dispatch({
      type: 'tableTemplate/save',
      payload: { selectDataDelete: selectedRows },
    });
    this.setState({ selectedRowKeys });
    this.props.dispatch({
      type: 'tableTemplate/changeState',
      payload: { selectedRowKeys },
    });
  };

  // 伸缩列
  handleResize = index => (e, { size }) => {
    this.setState({
      isResize: true,
    });
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  render() {
    const { selectedRowKeys, isResize } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',
        name: record.name,
      }),
    };

    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));

    const components = {
      header: {
        cell: ResizeableTitle,
      },
      body: {
        cell: EditableCell,
      },
    };
    return (
      <div className={styles.tableListMain2}>
        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            bordered
            rowSelection={rowSelection}
            onChange={
              isResize
                ? e => {
                  window.event.preventDefault();
                  this.setState({
                    isResize: false,
                  });
                }
                : (pagination, filters, sorter) => {
                  this.handleChange(pagination, filters, sorter);
                }
            }
            onRow={(e, record) => {
              return {
                onDoubleClick: () => {
                  this.onJump(e, record);
                },
              };
            }}
            scroll={{ x: true }}
            dataSource={_.get(this.props.tableTemplate, 'pagination.list')}
            columns={columns}
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
      </div>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;
// ReactDOM.render(<EditableFormTable />, mountNode);

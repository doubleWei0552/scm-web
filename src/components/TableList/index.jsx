import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Skeleton from '@/components/Skeleton/Index';
import _ from 'lodash';
import { Resizable } from 'react-resizable';
import {
  Table, Tooltip
} from 'antd';
import Styles from './index.less'

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
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

@connect(({ tableTemplate, loading }) => ({
  tableTemplate,
  loadingTable: loading.effects['tableTemplate/getPagination'],
  loadingG:
    loading.effects['tableTemplate/getDetailPageConfig'] ||
    loading.effects['tableTemplate/save'] ||
    loading.effects['tableTemplate/getDetailPage'] ||
    loading.effects['tableTemplate/getSummaryPageConfig'],
}))
class TableList extends PureComponent {
  state = {
    selectedRowKeys: [],
    columns: this.props.columns,
  }
  components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   const {columns,dataSource} = nextProps;
  //   // 当传入的type发生变化的时候，更新state
  //   if (columns !== prevState.columns) {
  //       return {
  //         columns,
  //       };
  //   }
  //   // 否则，对于state不进行任何操作
  //   return null;
  // } 

  componentWillReceiveProps = (nextProps) => {
    let { columns } = nextProps
    if (columns != this.state.columns) {
      this.setState({
        columns
      })
    }
  }

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };
  // table排序方法
  handleChange = (pagination, filters, sorter) => {
    this.props.dispatch({ type: 'tableTemplate/save', payload: { sorterData: sorter } })
    const { current, pageSize = 10 } = pagination;
    let obj = {
      descend: 'DESC',
      ascend: 'ASC',
      undefined: null,
    }
    let { searchParams, pageId, sorterData } = this.props.tableTemplate
    let value = sorter.field ? sorter.field + ' ' + obj[sorter.order] : null
    this.props.dispatch({
      type: 'tableTemplate/getPagination',
      payload: { pageId, current, pageSize, summarySort: value, searchParams },
    });
    this.props.dispatch({
      type: 'tableTemplate/changeState',
      payload: { summarySort: value },
    });
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

  onJump = e => {
    this.props.dispatch({
      type: 'tableTemplate/changeState',
      payload: { disEditStyle: true }
    })
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
      payload: { isEdit: true, buttonType: true, isNewSave: false }
    })
  };

  renderColumn = (text, item, record) => {
    // debugger
    if (!text || !item.widgetType) {
      return (<span
        style={{ display: 'inline-block', width: '100%', textAlign: 'right' }}
      >
        {text}
      </span>)
    }
    if (item.hyperLink && item.widgetType === 'Date') {
      return (
        <a onClick={this.onJump.bind(this, record)}>
          {text ? moment(text).format('YYYY-MM-DD') : null}
        </a>
      )
    } else if (item.hyperLink && item.widgetType === 'DateTime') {
      return (
        <a onClick={this.onJump.bind(this, record)}>
          {text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null}
        </a>
      )
    } else if (item.hyperLink) {
      return <a onClick={this.onJump.bind(this, record)}>{text}</a>
    } else if (item.widgetType === 'Date') {
      return (
        <span>{text ? moment(text).format('YYYY-MM-DD') : null}</span>
      )
    } else if (item.widgetType === 'DateTime') {
      return (
        <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null}</span>
      )
    } else if (item.widgetType === 'Number') {
      return (
        <span
          style={{ display: 'inline-block', width: '100%', textAlign: 'right' }}
        >
          {text}
        </span>
      )
    } else {
      return (
        <span>
          {text}
        </span>
      )
    }
  }

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

  onPageChange = (current, pageSize) => {
    const { pageId, searchParams, sorterData, summarySort } = this.props.tableTemplate;
    // const { searchParams } = this.state;
    this.props.dispatch({
      type: 'tableTemplate/getPagination',
      payload: { pageId, current, pageSize, searchParams, summarySort },
    });
    this.props.dispatch({
      type: 'tableTemplate/changeState',
      payload: { pageSize },
    });
  };

  render() {
    const { loadingTable = false, loadingG = false } = this.props
    const { selectedRowKeys } = this.state;
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
    return (
      <div className={Styles.tableListMain}>
        <Table
          components={this.components}
          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          rowSelection={rowSelection}
          onChange={this.handleChange}
          bordered
          loading={loadingG ? false : loadingTable}
          scroll={{ x: true }}
          onRow={(e, record) => {
            return {
              onDoubleClick: () => {
                this.props.onJump(e, record);
              },
            };
          }}
          columns={columns}
          dataSource={_.get(this.props.tableTemplate, 'pagination.list')}
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
      </div>
    );
  }
}

export default TableList;

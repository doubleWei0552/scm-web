import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Skeleton from '@/components/Skeleton/Index';
import _ from 'lodash';
import { Resizable } from 'react-resizable';
import { Table, Tooltip } from 'antd';
import Styles from './index.less';

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

@connect(({ tableTemplate, listPage, loading }) => ({
  tableTemplate,
  listPage,
  loadingTable: loading.effects['listPage/getPagelist'],
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
  };
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

  componentWillReceiveProps = nextProps => {
    let { columns } = nextProps;
    if (columns !== this.state.columns) {
      this.setState({
        columns,
      });
    }
  };

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
    this.props.dispatch({ type: 'listPage/save', payload: { sorterData: sorter } });
    const { current, pageSize = 10 } = pagination;
    let obj = {
      descend: 'DESC',
      ascend: 'ASC',
      undefined: null,
    };
    let { searchParams, pageId, sorterData } = this.props.tableTemplate;
    let value = sorter.field ? sorter.field + ' ' + obj[sorter.order] : null;
    this.props.dispatch({
      type: 'listPage/getPagelist',
      payload: { pageId, current, pageSize, summarySort: value, searchParams },
    });
    this.props.dispatch({
      type: 'listPage/changeState',
      payload: { summarySort: value },
    });
  };

  // 列表页数据选择
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.props.dispatch({
      type: 'listPage/save',
      payload: { selectDataDelete: selectedRows },
    });
    this.setState({ selectedRowKeys });
    this.props.dispatch({
      type: 'listPage/changeState',
      payload: { selectedRowKeys },
    });
  };

  // 分页的函数
  onShowSizeChange = (current, pageSize) => {
    const { pageId, sorterData, summarySort, searchParams } = this.props.listPage;
    this.props.dispatch({
      type: 'listPage/getPagelist',
      payload: { pageId, current, pageSize, summarySort, searchParams },
    });
    this.props.dispatch({
      type: 'listPage/changeState',
      payload: { pageSize },
    });
  };

  onPageChange = (current, pageSize) => {
    const { pageId, searchParams, sorterData, summarySort } = this.props.listPage;
    // const { searchParams } = this.state;
    this.props.dispatch({
      type: 'listPage/getPagelist',
      payload: { pageId, current, pageSize, searchParams, summarySort },
    });
    this.props.dispatch({
      type: 'listPage/changeState',
      payload: { pageSize },
    });
  };

  render() {
    const { loadingTable = false, loadingG = false } = this.props;
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
      <div style={{ background: 'pink' }} className={Styles.tableListMain}>
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
          dataSource={_.get(this.props.listPage, 'tableData')}
          pagination={{
            showSizeChanger: true,
            total: _.get(this.props.listPage, 'pagination.totalRecord'),
            current: _.get(this.props.listPage, 'pagination.currentPage'),
            pageSize: _.get(this.props.listPage, 'pagination.pageSize'),
            pageSizeOptions: ['10', '20', '50', '100', '300'],
            onShowSizeChange: this.onShowSizeChange,
            // onChange: ()=>this.onPageChange(),
            showTotal: total => `共${this.props.listPage.pagination.totalRecord}条数据`,
          }}
        />
      </div>
    );
  }
}

export default TableList;

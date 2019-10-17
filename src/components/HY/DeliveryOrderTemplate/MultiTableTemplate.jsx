import React from 'react';
import ReactDOM from 'react-dom';
import {
  Button,
  DatePicker,
  Select,
  Input,
  Row,
  Col,
  Table,
  Modal,
  Tooltip,
  Form,
  Icon,
  InputNumber,
  Card,
  Popconfirm,
  message,
  Spin,
  Tabs,
  Divider,
  Skeleton,
} from 'antd';
import { onRegex } from '@/utils/FunctionSet';
import _ from 'lodash';
import { connect } from 'dva';
import CatchError from '@/components/CatchError';
import DetailsPageModule from '@/components/HY/DeliveryOrderDetailsPageModule';
// import DetailsPageModule from '@/components/DetailsPageModule/Index';

import ListPageModule from '@/components/ListPageModule';
import SkeletonCom from '@/components/Skeleton';
import moment from 'moment';
import styles from './SingleTableTemplate.less';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';
const TabPane = Tabs.TabPane;
// 编辑/删除按钮字段
let editAndDeleteButton = {
  ADD: {},
  DELETE: {},
  EDIT: {},
};

@Form.create()
@connect(({ tableTemplate, loading }) => ({
  tableTemplate,
  loadingGG:
    loading.effects['tableTemplate/getDetailPageConfig'] ||
    loading.effects['tableTemplate/save'] ||
    loading.effects['tableTemplate/getDetailPage'] ||
    loading.effects['tableTemplate/getTransactionProcess'] ||
    loading.effects['tableTemplate/getSummaryPageConfig'],
}))
export default class MultiTableTemplate extends React.Component {
  constructor(props) {
    super(props);
    // this.ref = React.createRef();
  }
  static defaultProps = {
    //---列表页----
    Search: [], //列表页搜索条件
    tableColumns: [], //列表页表头
    tableData: [], //列表页数据

    //---详情页----
    buttonType: false, //详情页的按钮格式
  };
  state = {
    selectData: {}, //选中的那一行数据
    inputNull: false, //默认input输入框不为空
    // isEditSave: false, //判断是不是详情页的新增，默认是false 不是
    disSelectDate: false, //判断是否让输入框为空，默认不为空
    visible: false, //用于控制modal是否显示
    warning: '确定执行本次操作？', //用于显示modal的提示信息
    modalEvent: null, //用于记录点击modal后执行的函数
    isOperate: false, //用于记录取消时，用户有没有进行过操作，默认没有操作（fasle）
    Data: [], //用于子表展示的数据
    selectFields: {},
    loading: true, // 子表loding
    childChanged: [], //子表修改的数据，待发送到后台
    searchParams: {}, //列表页搜索栏的参数
    isError: false, //获取值得时候是否出错
  };
  UNSAFE_componentWillMount = () => {
    const pageId = this.props.location.query.PageId * 1;
    this.props.dispatch({ type: 'tableTemplate/save', payload: { pageId } });
    this.props.dispatch({
      type: 'tableTemplate/getPagination',
      payload: { pageId, current: 1, pageSize: 10 },
    });

    //新版
    // this.props.dispatch({ type: 'listPage/save', payload: { pageId } });
    // this.props.dispatch({
    //   type: 'listPage/getPagelist',
    //   payload: { pageId, current: 1, pageSize: 10 },
    // });
    // this.props.dispatch({ type: 'listPage/getSummaryPageConfig',payload:{pageId:+pageId} });
  };
  componentDidMount = () => {
    this.props.dispatch({ type: 'tableTemplate/getDetailPageConfig' });
    this.props.dispatch({ type: 'tableTemplate/getSummaryPageConfig' });
  };
  UNSAFE_componentWillReceiveProps = newProps => {
    let { loading } = this.state;
    const currentPageId = _.get(this.props.tableTemplate, 'pageId');
    const newPageId = _.get(newProps.tableTemplate, 'pageId');
    //拿到子表数据取消loading
    if (_.isEmpty(newProps.tableTemplate.DetailChildData) != {}) {
      this.setState({ loading: false });
    }
    // pageID改变时，将所有状态恢复到初始状态
    if (currentPageId !== newPageId) {
      this.props.dispatch({ type: 'tableTemplate/getDetailPageConfig' });
      this.props.dispatch({
        type: 'tableTemplate/changeState',
        payload: {
          isEdit: false,
          buttonType: false,
          isNewSave: false,
          disEditStyle: true,
          searchParams: {},
          selectedRowKeys: [],
          defaultActiveKey: '0',
        },
      });
    }
  };

  componentWillUnmount() {
    this.props.dispatch({
      type: 'tableTemplate/changeState',
      payload: {
        reportFormURL: null,
      },
    });
  }

  render() {
    //列表页表头数据处理
    const { isEdit, buttonType, disEditStyle, selectedRowKeys } = this.props.tableTemplate;
    const { RangePicker } = DatePicker;
    const dateFormat = 'YYYY/MM/DD';
    const tableButtons = this.props.tableTemplate.tableColumnsData.buttons || [];
    return (
      <CatchError>
        {/* <Spin spinning={this.props.loadingG || false}> */}
        <div className={styles.SingleTableTemplateMain}>
          {/* 列表页  */}
          <ListPageModule loadingGG={this.props.loadingGG} />
          {/* 详情页 */}
          <DetailsPageModule loadingGG={this.props.loadingGG} />
        </div>
        {/* </Spin> */}
      </CatchError>
    );
  }
}

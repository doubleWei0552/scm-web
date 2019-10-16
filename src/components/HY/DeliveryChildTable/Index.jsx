import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
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
} from 'antd';
import NTableForm from '@/components/TableForm/TableForm'; //子表组件
import { formItemValid } from '@/utils/validate';
import moment from 'moment';
import DeliveryModal from './components/DeliveryModal';
import styles from './Index.less';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const { TextArea } = Input;
const TabPane = Tabs.TabPane;

@Form.create()
@connect(({ tableTemplate }) => ({
  tableTemplate,
}))
export default class ChildTable extends React.Component {
  state = {
    autoFocus: false, //管控inputNumber掉rtlink功能后的焦点状态
    regesKey: '', //子表通过验证的唯一的key，用于判断显示对应的border边框
    isRegex: true, //子表是否通过了正则表达式验证，默认通过为true
    childList: [],
  };
  //子表tab组件
  tabCallback = key => {
    this.props.dispatch({ type: 'tableTemplate/save', payload: { defaultActiveKey: key } });
  };

  onEditSearch = (value, searchData, selectKey, ColumnsData) => {
    if (ColumnsData) {
      this.props.dispatch({
        type: 'tableTemplate/getChildAutocomplate',
        payload: { value, searchData, selectKey, ColumnsData },
      });
    } else {
      this.props.dispatch({
        type: 'tableTemplate/getAutocomplate',
        payload: { value, searchData, selectKey },
      });
    }
  };

  popconfirmCancel = e => { };

  // // table排序方法  //暂定，根据后端的传参来调用
  // handleChange = (pagination, filters, sorter) => {
  //     let obj = {
  //     descend:'DESC',
  //     ascend:'ASC',
  //     undefined:null,
  //     }
  //     let {searchParams,pageId} = this.props.tableTemplate
  //     let value = sorter.field ? sorter.field + ' ' + obj[sorter.order] : null
  // };

  //子表事件
  onChildDelete = record => {
    let id = record.id;
    if (!id) return;
    let objectType = record.objectType;
    this.props.dispatch({ type: 'tableTemplate/getRemoveChildData', payload: { id, objectType } });
  };

  //子表删除气泡确定框
  // deleteIndex:要删除的子表的具体数据 ;index:要对第几个子表的数据进行操作的下标
  popconfirmConfirm = (record, deleteIndex, index) => {
    this.onChildDelete(record);
    let deleteKey = record.key;
    if (record.id) {
      //判断删除元数据还是缓存数据
      _.remove(this.ChildData, function (n) {
        return n.key != deleteKey;
      });
    } else {
      _.remove(this.props.tableTemplate.ChildData[index].Data.records, function (n, index) {
        return index == deleteIndex;
      });
      this.props.dispatch({ type: 'tableTemplate/save' }); //删除缓存数据，刷新页面
    }
  };

  handleAddChild = () => {//CODE
    const DELIVERY_CODE = this.props.detailForm ? this.props.detailForm.getFieldValue('CODE') : null
    const SUPPLIER_ID = this.props.detailForm ? this.props.detailForm.getFieldValue('SUPPLIER_ID') : null
    console.log('ssssssss', SUPPLIER_ID)
    const div = document.createElement('div');
    document.body.appendChild(div);
    ReactDOM.render(
      <DeliveryModal
        store={window.g_app._store}
        title="送货详情"
        SUPPLIER_ID={SUPPLIER_ID}
        DELIVERY_CODE={DELIVERY_CODE}
        handleOk={data => this.handleChildListAdd(data)}
      />,
      div
    );
  };

  // 这里需要重新加载详情页
  handleChildListAdd = data => {
    // const { childList } = this.state;
    // this.setState({
    //   childList: _.concat(childList, data),
    // });
    // window.location.reload();
  };

  render() {
    const { disEditStyle, childMaxCount } = this.props.tableTemplate;
    const { childList } = this.state;
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: '操作',
        dataIndex: '',
        align: 'center',
        width: 80,

        render: text => (
          <a>
            {' '}
            <Icon type="close" />
          </a>
        ),
      },
      {
        title: '序号',
        className: 'column-money',
        dataIndex: 'money',
      },
      {
        title: '产品编码',
        dataIndex: 'PRODUCT_CODE',
      },
      {
        title: '产品名称',
        dataIndex: 'PRODUCT_NAME',
      },
      {
        title: '规格',
        dataIndex: 'SPECIFICATIONS',
      },
      {
        title: '单位',
        dataIndex: 'UNIT_CODE',
      },
      {
        title: '送货量',
        dataIndex: 'UNMATCHQUANTITY',
      },
      {
        title: '收货量',
        dataIndex: '',
      },
      {
        title: '箱规',
        dataIndex: '',
        render: text => <InputNumber min={0} step={1} onChange={() => console.log('箱规')} />,
      },
      {
        title: '件数',
        dataIndex: '',
      },
      {
        title: '拒收量',
        dataIndex: '',
      },
      {
        title: '合格量',
        dataIndex: '',
      },
      {
        title: '验退量',
        dataIndex: '',
      },
      {
        title: '入库量',
        dataIndex: '',
      },
      {
        title: '检验状态',
        dataIndex: '',
      },
      {
        title: '生产批号',
        dataIndex: '',
        width: 200,
        render: text => (
          <Input onChange={() => console.log('生产批号')} style={{ width: '150px' }} />
        ),
      },
      {
        title: '送货批号',
        dataIndex: '',
      },
      {
        title: '交货日期',
        dataIndex: '',
      },
      {
        title: '备注',
        dataIndex: '',
        render: text => <Input onChange={() => console.log('备注')} style={{ width: '200px' }} />,
      },
    ];

    return (
      <Tabs activeKey={'ss'} onChange={this.tabCallback}>
        <TabPane tab="送货详单详情表" key="ss">
          <Table
            columns={columns}
            dataSource={childList}
            bordered
            size="small"
            scroll={{ x: true }}
            // title={() => 'Header'}
            // footer={() => 'Footer'}
            pagination={false}
          />
          <div style={{ padding: '10px', marginTop: '10px' }}>
            <Button onClick={() => this.handleAddChild()} type="primary" block>
              新增
            </Button>
          </div>
        </TabPane>
      </Tabs>
    );
  }
}

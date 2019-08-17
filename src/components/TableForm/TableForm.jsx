import React from 'react';
import {
  Table,
  Button,
  Input,
  message,
  Popconfirm,
  Divider,
  InputNumber,
  Select,
  Icon,
  Modal,
  Spin,
} from 'antd';
import { connect } from 'dva';
import ListPage from '../ListPage/Index';
import ListForm from '../ListPage/ListForm';
import _ from 'lodash'
import styles from './Index.less';

@connect(({ tableTemplate, loading }) => ({
  tableTemplate,
  loadingG: loading.effects['tableTemplate/childUpdateFields'],
}))
export default class TableForm extends React.Component {
  state = {
    isEdit: false, //用于记录是否是编辑状态
    Data: this.props.data, //子表的数据
    columns: this.props.columns, //子表的表头
    isNewlyAdded: true, //是否是新增
    visible: false, //用于控制modal是否显示
    frameSelectedRowKeys: [], //用于记录子表所选择的数据
    frameSelectedRows: [], //一行的数据
    isEdit: false, //判断是不是编辑状态，默认不是
  };
  UNSAFE_componentWillReceiveProps = newProps => {
    let { data, columns } = newProps;
    this.setState({ Data: data, columns });
  };
  // modal组件
  showModal = () => {
    //获取主表的最新数据
    let MainTableData = this.props.getMasterTable()
    console.log('获取到的主表数据',MainTableData)
    this.props.dispatch({
      type: 'tableTemplate/getMainTableData',
      payload: { MainTableData },
    });
    this.setState({
      visible: true,
    });

    if (this.props.MultiObjectSelector) {
      //临时调整为每次点击都会调用方法
      let { multiGroupName, multiObjectType, objectType } = this.props.HeaderData;
      this.props.dispatch({
        type: 'tableTemplate/getDetailListConfig',
        payload: { multiGroupName, multiObjectType },
      });
      let ChildTableData;
      let ChildObject = this.props.value.Columns.objectType;
      this.props.ChildData.map((value, index) => {
        if (value.Data.objectType == objectType) {
          ChildTableData = value.Data.records;
        }
      });
      this.props.dispatch({
        type: 'tableTemplate/getDetailList',
        payload: {
          multiGroupName,
          multiObjectType,
          pageSize: 10,
          pageNum: 1,
          MasterTableID: this.props.detailData.thisComponentUid,
          ChildTableData,
          ChildObject,
        },
      });
    }
  };

  handleOk = e => {
    let MasterTable = this.props.getMasterTable()
    //table类型的数据新增
    let { frameSelectedRows } = this.state; //弹框选择的数据
    let { MultiObjectSelector, HeaderData, value } = this.props; //子表是否含有mask ，不含有就是null
    if (this.props.ChildData.length == 0) {
      //新增情况
      let list = []; //子表rtLink数据
      frameSelectedRows.map(n => {
        let data = [];
        let updatedField;
        let formFields = {};
        HeaderData.fields.map(i => {
          if (i.type == 'MultiObjectSelector') {
            updatedField = i.text;
          }
          let DataValue = {};
          if (i.text == MultiObjectSelector) {
            // 按照mask格式匹配 DISPLAY_NAME 值
            let arr = this.props.mask;
            let res = arr.split(':').map(v => {
              var val = v.replace(/\s/g, '');
              return val.substring(1, val.length - 1);
            });
            for (let w = 0; w < res.length; w++) {
              var reg = new RegExp(res[w], 'g');
              var leftSpace = new RegExp('{', 'g');
              var rightSpace = new RegExp('}', 'g');
              arr = arr
                .replace(reg, n[res[w]])
                .replace(leftSpace, '')
                .replace(rightSpace, ''); //注：replace不会改变原来的值，arr为处理后的值
            }

            DataValue.FIELD_NAME = i.text;
            DataValue.FIELD_VALUE = n.ID || i.defaultValue;
            DataValue.options = i.options;
            DataValue.DISPLAY_NAME = arr || i.defaultValue;
            formFields.FIELD_NAME = i.text;
            formFields.FIELD_VALUE = n.ID;
            DataValue.id = null;
            DataValue.OBJECT_TYPE = HeaderData.objectType;
            DataValue.objectType = HeaderData.objectType;
            DataValue.key = n.CREATED_ON + n.ID + n.key;
            DataValue.identifier = n.CREATED_ON + '-' + n.ID;
            data.push(DataValue);
          } else {
            DataValue.FIELD_NAME = i.text;
            DataValue.FIELD_VALUE = i.defaultValue;
            DataValue.options = i.options;
            DataValue.DISPLAY_NAME = i.defaultValue;
            DataValue.id = null;
            DataValue.OBJECT_TYPE = HeaderData.objectType;
            DataValue.objectType = HeaderData.objectType;
            DataValue.key = n.CREATED_ON + n.ID + n.key;
            DataValue.identifier = n.CREATED_ON + '-' + n.ID;
            data.push(DataValue);
          }
        });
        let ChildData = [];
        value.Data.records.push(data);
        ChildData.push(value);
        let cacheData = {};
        cacheData.updatedField = updatedField;
        cacheData.identifier = n.CREATED_ON + '-' + n.ID;
        cacheData.objectType = value.Data.objectType;
        cacheData.policyFormFields = [];
        cacheData.policyFormFields.push(formFields);
        cacheData.fieldGroupName = value.Columns.fieldGroupName;
        list.push(cacheData);
        this.props.dispatch({ type: 'tableTemplate/save', payload: { ChildData } });
      });
      this.props.dispatch({
        type: 'tableTemplate/childUpdateFields',
        payload: {
          params: {
            list,
            MasterTable,
            objectType: this.props.detailData.objectType,
          },
        },
      });
      this.props.dispatch({ type: 'tableTemplate/save' }); //刷新model值
    } else {
      //编辑页新增
      let list = []; //子表rtLink数据
      frameSelectedRows.map(n => {
        let data = [];
        let updatedField;
        let formFields = {};
        HeaderData.fields.map(i => {
          if (i.type == 'MultiObjectSelector') {
            updatedField = i.text;
          }
          let DataValue = {};
          if (i.text == MultiObjectSelector) {
            // 按照mask格式匹配 DISPLAY_NAME 值
            let arr = this.props.mask ? this.props.mask : '';
            let res = arr.split(':').map(v => {
              var val = v.replace(/\s/g, '');
              return val.substring(1, val.length - 1);
            });
            for (let w = 0; w < res.length; w++) {
              var reg = new RegExp(res[w], 'g');
              var leftSpace = new RegExp('{', 'g');
              var rightSpace = new RegExp('}', 'g');
              arr = arr
                .replace(reg, n[res[w]])
                .replace(leftSpace, '')
                .replace(rightSpace, ''); //注：replace不会改变原来的值，arr为处理后的值
            }
            DataValue.FIELD_NAME = i.text;
            DataValue.FIELD_VALUE = n.ID || i.defaultValue;
            DataValue.options = i.options;
            DataValue.DISPLAY_NAME = arr || i.defaultValue;
            formFields.FIELD_NAME = i.text;
            formFields.FIELD_VALUE = n.ID;
            DataValue.id = null;
            DataValue.OBJECT_TYPE = HeaderData.objectType;
            DataValue.objectType = HeaderData.objectType;
            DataValue.key = n.CREATED_ON + n.ID + n.key;
            // DataValue.key = n.CREATED_ON + i.text + n.ID + n.key;
            DataValue.identifier = n.CREATED_ON + '-' + n.ID;
            data.push(DataValue);
          } else {
            DataValue.FIELD_NAME = i.text;
            DataValue.FIELD_VALUE = i.defaultValue;
            DataValue.options = i.options;
            DataValue.DISPLAY_NAME = i.defaultValue;
            DataValue.id = null;
            DataValue.OBJECT_TYPE = HeaderData.objectType;
            DataValue.objectType = HeaderData.objectType;
            // DataValue.key = n.CREATED_ON + i.text + n.ID + n.key;
            DataValue.key = n.CREATED_ON + n.ID + n.key;
            DataValue.identifier = n.CREATED_ON + '-' + n.ID;
            data.push(DataValue);
          }
        });
        value.Data.records.push(data);
        let cacheData = {};
        cacheData.updatedField = updatedField;
        cacheData.identifier = n.CREATED_ON + '-' + n.ID;
        cacheData.objectType = value.Data.objectType;
        cacheData.policyFormFields = [];
        cacheData.policyFormFields.push(formFields);
        cacheData.fieldGroupName = value.Data.fieldGroupName || value.Columns.fieldGroupName;
        list.push(cacheData);
      });
      this.props.dispatch({
        type: 'tableTemplate/childUpdateFields',
        payload: {
          params: {
            list,
            MasterTable,
            objectType: this.props.detailData.objectType,
          },
        },
      });
      this.props.dispatch({ type: 'tableTemplate/save' }); //刷新model值
    }
    this.setState({ visible: false,frameSelectedRows:[], frameSelectedRowKeys: [], isEdit: true });
  };

  handleCancel = e => {
    if (this.ListForm) {
      this.ListForm.handleResetClick();
    }
    this.setState({
      frameSelectedRowKeys: [],
      frameSelectedRows: [],
      visible: false,
    });
  };

  onRef = ref => {
    this.ListForm = ref;
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    // let { frameSelectedRows } = this.state
    // selectedRows.map((value,index)=>{
    //   let ind = _.findIndex(frameSelectedRows,item =>item.ID == value.ID)
    //   if(ind < 0) {
    //     frameSelectedRows.push(value)
    //   } 
    // })
    this.setState({ frameSelectedRowKeys: selectedRowKeys, frameSelectedRows:selectedRows });
  };

  render() {
    let add_d = this.props.HeaderData.add_d //新增按钮管控，true为只读
    const listPageProps = {
      frameSelectedRowKeys: this.state.frameSelectedRowKeys,
      onSelectChange: this.onSelectChange,
      ...this.props,
    };
    const listFormProps = {
      handleCancel: this.handleCancel,
      ...this.props,
    };
    return (
      <div className={styles.childTable}>
        <Spin spinning={this.props.loadingG || false}>
          <Table
            style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            className={
              this.state.isEdit ? styles.TableFormTableAddStyle : styles.TableFormTableStyle
            }
            scroll={{ x: true }}
            rowKey={(record, index) => index}
            columns={this.state.columns}
            dataSource={this.state.Data}
            pagination={false}
            bordered
          />
        </Spin>
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type={this.props.disEditStyle ? 'dashed' : 'primary'}
          disabled={this.props.disEditStyle || add_d}
          onClick={this.showModal}
          icon="plus"
        >
          新增数据
        </Button>
        <Modal
          ref="ListPage"
          width="80%"
          centered={true}
          closable={false}
          maskClosable={false}
          footer={
            this.props.MultiObjectSelector ? (
              <div style={{ textAlign: 'center', width: '100%' }}>
                <Button type="primary" onClick={this.handleOk}>
                  确定
                </Button>
                <Button onClick={this.handleCancel}>取消</Button>
              </div>
            ) : null
          }
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {this.props.MultiObjectSelector ? (
            <ListPage {...listPageProps} />
          ) : (
            <ListForm {...listFormProps} onRef={this.onRef} /> //注:没有mask数据，没有调用handleOk方法
          )}
        </Modal>
      </div>
    );
  }
}

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
} from 'antd';
import ListPage from '../ListPage/Index';
import ListForm from '../ListPage/ListForm';

export default class TableForm extends React.Component {
  state = {
    isEdit: false, //用于记录是否是编辑状态
    Data: this.props.data, //子表的数据
    columns: this.props.columns, //子表的表头
    isNewlyAdded: true, //是否是新增
    visible: false, //用于控制modal是否显示
    frameSelectedRowKeys: [], //用于记录子表所选择的数据
    frameSelectedRows: [], //一行的数据
  };
  UNSAFE_componentWillReceiveProps = newProps => {
    let { data, columns } = newProps;
    this.setState({ Data: data, columns });
  };
  // modal组件
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
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
            DataValue.FIELD_NAME = i.text;
            DataValue.FIELD_VALUE = n.ID;
            formFields.FIELD_NAME = i.text;
            formFields.FIELD_VALUE = n.ID;
            DataValue.id = null;
            DataValue.OBJECT_TYPE = HeaderData.objectType;
            DataValue.objectType = HeaderData.objectType;
            DataValue.key = n.CREATED_ON + i.text;
            DataValue.identifier = n.CREATED_ON + '-' + n.ID;
            data.push(DataValue);
          } else {
            DataValue.FIELD_NAME = i.text;
            DataValue.FIELD_VALUE = null;
            DataValue.id = null;
            DataValue.OBJECT_TYPE = HeaderData.objectType;
            DataValue.objectType = HeaderData.objectType;
            DataValue.key = n.CREATED_ON + i.text;
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
        payload: { params: { list } },
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
            DataValue.FIELD_NAME = i.text;
            DataValue.FIELD_VALUE = n.ID;
            formFields.FIELD_NAME = i.text;
            formFields.FIELD_VALUE = n.ID;
            DataValue.id = null;
            DataValue.OBJECT_TYPE = HeaderData.objectType;
            DataValue.objectType = HeaderData.objectType;
            DataValue.key = n.CREATED_ON + i.text;
            DataValue.identifier = n.CREATED_ON + '-' + n.ID;
            data.push(DataValue);
          } else {
            DataValue.FIELD_NAME = i.text;
            DataValue.FIELD_VALUE = null;
            DataValue.id = null;
            DataValue.OBJECT_TYPE = HeaderData.objectType;
            DataValue.objectType = HeaderData.objectType;
            DataValue.key = n.CREATED_ON + i.text;
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
        cacheData.fieldGroupName = value.Data.fieldGroupName;
        list.push(cacheData);
      });
      this.props.dispatch({
        type: 'tableTemplate/childUpdateFields',
        payload: { params: { list } },
      });
      this.props.dispatch({ type: 'tableTemplate/save' }); //刷新model值
    }
    this.setState({ visible: false });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ frameSelectedRowKeys: selectedRowKeys, frameSelectedRows: selectedRows });
  };

  render() {
    const listPageProps = {
      frameSelectedRowKeys: this.state.frameSelectedRowKeys,
      onSelectChange: this.onSelectChange,
      ...this.props,
    };
    const listFormProps = {
      ...this.props,
    };
    return (
      <div>
        <Table
          scroll={{ x: true }}
          rowKey={(record, index) => index}
          columns={this.state.columns}
          dataSource={this.state.Data}
          pagination={false}
          bordered
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type={this.props.disEditStyle ? 'dashed' : 'primary'}
          disabled={this.props.disEditStyle}
          onClick={this.showModal} //浮框方案
          icon="plus"
        >
          新增数据
        </Button>
        <Modal
          ref="ListPage"
          width="80%"
          centered={true}
          closable={false}
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
            <ListForm {...listFormProps} />
          )}
        </Modal>
      </div>
    );
  }
}

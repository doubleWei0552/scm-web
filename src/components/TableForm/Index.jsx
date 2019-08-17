import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, InputNumber, Select, Icon } from 'antd';
// import isEqual from 'lodash/isEqual';
import styles from './Index.less';

class TableForm extends PureComponent {
  index = 0;
  cacheOriginData = {};

  state = {
    data: this.props.childTableData,
    loading: false,
    value: this.props.value,
    childTableData: this.props.childTableData,
    newData: {},  //子表新增的数据
    child: {}  //调用保存或编辑时的数据
  }

  UNSAFE_componentWillReceiveProps = (newProps) => {
    this.setState({ data: newProps.childTableData, childTableData: newProps.childTableData })
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    let newDataRow = {}
    for (let i in data[0]) {
      if (i == 'key') {
        newDataRow[i] = Math.random()
      } else {
        newDataRow[i] = null
      }
    }
    if (JSON.stringify(newDataRow) == '{}') {
      newDataRow.key = Math.random()
    }
    newData.push(newDataRow)
    this.index += 1;
    this.setState({ data: newData })
  };

  remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    onChange(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }

  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.workId || !target.name || !target.department) {
        message.error('请填写完整成员信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      const { data } = this.state;
      const { onChange } = this.props;
      onChange(data);
      this.setState({
        loading: false,
      });
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  selectClick = (value, childColumnsID) => {
    this.props.dispatch({ type: 'tableTemplate/getAutocomplate', payload: { value, childColumnsID } })
  }
  onEditSearch = (value, data) => {
    this.props.dispatch({ type: 'tableTemplate/getAutocomplate', payload: { value, searchData: data } })
  }
  onNumberChange = (e, value, rowData, specificData, record, childTableColumns) => {
    // console.log(rowData)
    let childAllData = this.props.childAllData

    if (rowData) {
      if (rowData.length == 0) {  //新增情况
        let newData = this.state.newData
        newData[value.text] = e
        let child = {
          newData: [newData],
          objectType: this.props.objectType
        }
        this.setState({ child })
      } else {
        let newData = this.state.newData
        newData[value.text] = e
        console.log(specificData)
        newData.ID = specificData.id
        let child = {
          newData: [newData],
          objectType: this.props.objectType
        }
        this.setState({ child })
      }
    } else {
      let newData = this.state.newData
      newData[value.text] = e
      let child = {
        newData: [newData],
        objectType: this.props.objectType
      }
      this.setState({ child })
    }
  }
  onChildSelectChange = (e, value) => {
    let newData = { [value.text]: e }
    let child = {
      newData: [newData],
      objectType: this.props.objectType
    }
    // this.props.dispatch({type:'tableTemplate/getDetailSave',payload:{child,type:'save'}})
  }
  onDeleteData = (record) => {
    const objectType = this.props.objectType
    const businessId = record.id
    this.props.dispatch({ type: 'tableTemplate/getRemoveBusiness', payload: { businessId, objectType } })
  }

  render() {
    const { childTableColumns, childAllData, childColumnsID } = this.props
    const { childTableData } = this.state
    const { loading, data } = this.state
    // 前面加个删除功能
    let columns = [{
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span onClick={() => this.onDeleteData(record)} style={{ width: '30px', display: 'block', color: '#3e90f7' }}>
          <Icon type="close" />
        </span>
      )
    }]
    childTableColumns.map((value, index) => {
      if (value.type == 'Number') {
        let columnsData = {
          title: value.value,
          dataIndex: value.text,
          key: value.sequence,
          render: (text, record) => {
            let rowData = []  //用于记录那一行的数据
            let specificData = {}  //用于记录具体的数据，方便后期添加管控
            // 判断用于区分新增还是编辑
            if (childAllData) {
              childAllData.map((value, index) => {
                value.map((i, j) => {
                  if (i.key == record.key) {
                    rowData = value
                  }
                })
              })
              rowData.map((k, m) => {
                if (k.FIELD_NAME == value.text) {
                  specificData = k
                }
              })
              return (
                <div>
                  <InputNumber onChange={(e) => this.onNumberChange(e, value, rowData, specificData, record, childTableColumns)}
                    // style={{display:specificData.DISPLAY_CONDITION ? 'block' : 'none'}} 
                    defaultValue={text} disabled={specificData.READ_ONLY_CONDITION} />
                </div>
              )
            } else {
              return (
                <div>
                  <InputNumber onChange={(e) => this.onNumberChange(e, value)}
                  // style={{display:specificData.DISPLAY_CONDITION ? 'block' : 'none'}} 
                  />
                </div>
              )
            }

          }
        }
        columns.push(columnsData)
      } else if (value.type == 'Select') {
        let columnsData = {
          title: value.value,
          dataIndex: value.text,
          key: value.sequence,
          render: (text, record) => {
            let rowData = []  //用于记录那一行的数据
            let specificData = {}  //用于记录具体的数据，方便后期添加管控
            if (childAllData) {
              childAllData.map((value, index) => {
                value.map((i, j) => {
                  if (i.key == record.key) {
                    rowData = value
                  }
                })
              })
              rowData.map((k, m) => {
                if (k.FIELD_NAME == value.text) {
                  specificData = k
                }
              })
              //select的option选项
              var optionChild
              if (this.props.tableTemplate.selectOption != null) {
                optionChild = this.props.tableTemplate.selectOption.map((v, i) => {
                  return <Select.Option value={v.value} key={i}>{v.text}</Select.Option>
                })
              }
              return (
                <Select style={{ width: '100px' }}
                  onFocus={this.selectClick.bind(this, value, childColumnsID)} showSearch={true}
                  // onSearch={this.onEditSearch.bind(this,value)} filterOption={false}
                  onChange={(e) => this.onChildSelectChange(e, value)}
                  // style={{display:specificData.DISPLAY_CONDITION ? 'block' : 'none',width:'100px'}} 
                  disabled={specificData.READ_ONLY_CONDITION}>
                  {optionChild}
                </Select>
              )
            } else {
              return (
                <Select style={{ width: '100px' }}
                  onFocus={this.selectClick.bind(this, value, childColumnsID)} showSearch={true}
                  // onSearch={this.onEditSearch.bind(this,value)} filterOption={false}
                  onChange={(e) => this.onChildSelectChange(e, value)}
                // style={{display:specificData.DISPLAY_CONDITION ? 'block' : 'none',width:'100px'}} 
                >
                  {optionChild}
                </Select>
              )
            }

          }
        }
        columns.push(columnsData)
      } else if (value.type == 'Text') {
        let columnsData = {
          title: value.value,
          dataIndex: value.text,
          key: value.sequence,
          render: (text, record) => {
            // if(record.editable){
            return (
              <Input value={text} />
            )
            // }
          }
        }
        columns.push(columnsData)
      }
    })
    return (
      <Fragment>
        <Table
          scroll={{ x: true }}
          loading={loading}
          columns={columns}
          dataSource={this.state.data}
          pagination={false} bordered
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增数据
        </Button>
      </Fragment>
    );
  }
}

export default TableForm;

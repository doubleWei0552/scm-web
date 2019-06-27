import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import { Form, Row, Col, Select, Input, Button, Icon, DatePicker } from 'antd';
import ComModal from '@/components/ConfirmModel/index'
import FormModals from '@/components/ConfirmModel/FormModal'
import ButtonGroup from '@/components/ButtonGroup';
import DetailButtonGroup from '@/components/DetailButtonsGroup';

import styles from './style.less';

let editAndDeleteButton = {
  ADD: {},
  DELETE: {},
  EDIT: {},
  OPENACCOUNT: {}, //开户
};


@Form.create()
@connect(({ tableTemplate, loading, guidePage }) => ({
  tableTemplate,
  guidePage,
  loading: loading.effects['tableTemplate/getDetailSave']
}))
class DetailButtons extends PureComponent {

  state = {

  }

  componentDidMount() { }

  componentWillReceiveProps(newProps) {

  }

  handleClickItem = (item) => {

  }

  //详情页按钮，按钮组版本
  editButton = () => {
    const buttons = _.get(this.props.tableTemplate, 'detailData.buttons', []);
    const buttonData = [];
    // 删除，编辑区分处理
    editAndDeleteButton = {};
    const buttonList = [];
    // _.map(tableButtons, item => {
    //   const index = _.findIndex(buttonList, l => l.groupName === item.BUTTON_GROUP);
    //   if (index > -1) {
    //     buttonList[index].buttons.push(item);
    //   } else {
    //     buttonList.push({ groupName: item.BUTTON_GROUP, buttons: [item] });
    //   }
    // });

    buttons.map(item => {
      if (item.FIELD_NAME === 'DELETE') {
        editAndDeleteButton['DELETE'] = item;
      } else if (item.FIELD_NAME === 'EDIT') {
        editAndDeleteButton['EDIT'] = item;
      } else if (item.FIELD_NAME === 'ADD') {
        editAndDeleteButton['ADD'] = item;
      } else {
        // buttonData.push(item);
        const index = _.findIndex(buttonList, l => l.groupName === item.BUTTON_GROUP);
        if (index > -1) {
          buttonList[index].buttons.push(item);
        } else {
          buttonList.push({ groupName: item.BUTTON_GROUP, buttons: [item] });
        }
      }
    });
    if (buttonList.length === 0) {
      return null;
    }
    return (
      <span>
        <DetailButtonGroup buttonList={buttonList} />
      </span>
    );
  };

  // 判断是否做了修改
  checkChanged = () => {
    const { tableTemplate } = this.props;
    const { DetailChildData, initPolicyFormFields, initDetailChildData, isChildAdd } = tableTemplate;
    const { policyFormFields = [] } = _.get(tableTemplate, 'detailData');
    let hasChanged = false;
    const fieldValues = this.props.detailForm.getFieldsValue()
    _.map(initPolicyFormFields, field => {
      if (field.FIELD_VALUE != fieldValues[field.FIELD_NAME]) {
        hasChanged = true
      }
    })
    _.map(DetailChildData.child, (data, index) => {
      const initChild = initDetailChildData.child[index]
      if (data.fieldGroupName == initChild.fieldGroupName) {
        if (data.records.length !== initChild.records.length) {
          hasChanged = true
        } else {
          if (data.records.length === 0) {
            return
          }
          _.map(data.records, (record, idx) => {
            const initRecord = initChild.records[idx]
            _.map(record, (itm, ix) => {
              if (itm.FIELD_VALUE != initRecord[ix].FIELD_VALUE) {
                hasChanged = true
              }
            })
          })
        }

      }
    })

    if (hasChanged || isChildAdd) {
      this.showConfirmModal('onCancled', '确定要取消本次操作？')
    } else {
      this.handleOk('onCancled')
    }
  }

  showConfirmModal = (e, message) => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const ComModalProps = {
      handleOk: () => {
        this.handleOk(e)
      },
      message,
    }
    ReactDOM.render(<ComModal store={window.g_app._store} {...ComModalProps} />, div)
  }

  handleOk = e => {
    if (e === 'tableDelete') {
      this.tableDelete();
    } else if (e === 'detailDelete') {
      this.detailDelete();
    } else if (e === 'onCancled') {
      this.onCancled();
    }
  };

  // 开户
  openAccount = (e) => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const ComModalProps = {
      tableButton: e,
    }
    ReactDOM.render(<FormModals store={window.g_app._store} {...ComModalProps} />, div)
  }

  // 新增
  detailCreate = () => {
    this.props.detailForm.resetFields(); // 待测
    this.props.dispatch({ type: 'tableTemplate/changeState', payload: { ChildData: [], fileList: [] } })
    // 用于获取最新的组件的管控状态
    this.props.dispatch({
      type: 'tableTemplate/getDetailPage',
      payload: {
        ObjectType: this.props.tableTemplate.detailColumns.objectType,
        pageId: this.props.tableTemplate.pageId,
      },
    });

    this.props.dispatch({
      type: 'tableTemplate/changeState',
      payload: { isEditSave: true, buttonType: false, disEditStyle: false }
    })
  };

  // 编辑
  detailEdit = () => {
    this.props.dispatch({
      type: 'tableTemplate/changeState',
      payload: { buttonType: false, disEditStyle: false }
    })
    if (JSON.stringify(this.props.tableTemplate.selectDate) == '{}') {
      this.props.dispatch({
        type: 'tableTemplate/changeState',
        payload: { isEditSave: false, isNewSave: false, }
      })
    }
    this.props.dispatch({
      type: 'tableTemplate/getDetailPage',
      payload: {
        ID:
          JSON.stringify(this.props.tableTemplate.selectDate) != '{}'
            ? this.props.tableTemplate.selectDate.ID
            : this.props.tableTemplate.ID,
        ObjectType:
          JSON.stringify(this.props.tableTemplate.selectDate) != '{}'
            ? this.props.tableTemplate.selectDate.ObjectType
            : this.props.tableTemplate.objectType,
        pageId: this.props.tableTemplate.pageId,
      },
    });
  };

  // 删除
  detailDelete = () => {
    const businessId = this.props.tableTemplate.selectDate.ID;
    this.props.dispatch({
      type: 'tableTemplate/getRemoveBusiness',
      payload: { businessId },
      callback: res => {
        if (res.status === 'success') {
          this.props.dispatch({
            type: 'tableTemplate/changeState',
            payload: { isEdit: false }
          })
        }
      },
    });
  };

  // 返回
  editBack = () => {
    this.props.detailForm && this.props.detailForm.resetFields(); // 待测
    this.props.dispatch({ type: 'tableTemplate/save', payload: { ChildData: [] } }); // 新增时，清空输入框内的内容
    this.props.dispatch({
      type: 'tableTemplate/changeState',
      payload: { isEdit: false, buttonType: true, disEditStyle: true }
    })
  };

  // 取消
  onCancled = () => {
    const { isNewSave } = this.props.tableTemplate;
    this.props.detailForm.resetFields(); // 待测
    // 列表页新增过来的
    if (isNewSave) {
      this.props.dispatch({
        type: 'tableTemplate/changeState',
        payload: { isEdit: false, buttonType: false, disEditStyle: true }
      })
    } else {
      this.props.dispatch({
        type: 'tableTemplate/getDetailPage',
        payload: {
          ID:
            JSON.stringify(this.props.tableTemplate.selectDate) != '{}'
              ? this.props.tableTemplate.selectDate.ID
              : this.props.tableTemplate.ID,
          ObjectType:
            JSON.stringify(this.props.tableTemplate.selectDate) != '{}'
              ? this.props.tableTemplate.selectDate.ObjectType
              : this.props.tableTemplate.objectType,
          pageId: this.props.tableTemplate.pageId,
        },
      });
      // this.setState({
      //   ...newState,
      //   disSelectDate: false,
      // });  待测
      this.props.dispatch({
        type: 'tableTemplate/changeState',
        payload: { isEditSave: false, isEdit: true, buttonType: true, disEditStyle: true }
      })
    }
    this.props.dispatch({ type: 'tableTemplate/save', payload: { ChildData: [] } }); //清除子表的缓存数据
  };

  // 保存
  onEditSave = value => {
    const { isNewSave } = this.props.tableTemplate;
    let fileList = _.get(this.props.tableTemplate, 'fileList')
    let fileKey = _.get(this.props.tableTemplate, 'fileKey')
    console.log('详情页', this.props.detailForm.getFieldsValue())
    this.props.detailForm.validateFields((err, fieldValues) => {
      if (!err) {
        _.mapKeys(fieldValues, (value, key) => {
          if (typeof value === 'object') {
            const _value = moment(value).valueOf();
            this.state[key] = _value;
          } else {
            return (this.state[key] = value);
          }
        })
        if (fileList[0]) {
          let data = []
          fileList.map(item => {
            if (item.response) {
              data.push(item.response.data)
            } else {
              data.push(item)
            }
          })
          this.state[fileKey] = data
        } else {
          this.state[fileKey] = []
        }
        // 列表页新增过来的
        if (isNewSave) {
          this.props.dispatch({
            type: 'tableTemplate/getDetailSave',
            payload: { value: this.state, type: 'save' },
            callback: res => {
              if (res.status == 'success') {
                this.props.detailForm.resetFields();
                this.props.dispatch({ type: 'tableTemplate/save', payload: { ChildData: [] } }); //清除子表的缓存数据
                let newState = {};
                for (let i in this.state) {
                  if (i === 'visible') {
                    newState[i] = this.state[i];
                  } else {
                    newState[i] = undefined;
                  }
                }
                this.setState(
                  {
                    ...newState,
                  },
                  () => {
                    this.props.detailForm.resetFields();
                  }
                );
                this.props.dispatch({
                  type: 'tableTemplate/changeState',
                  payload: { isEdit: true, buttonType: true, isNewSave: false, disEditStyle: true }
                })
              }
            },
          });
        } else {
          // 详情页点击编辑进入,根据isEditSave判断是新增方法还是编辑方法
          if (this.props.tableTemplate.isEditSave) {
            this.props.dispatch({
              type: 'tableTemplate/getDetailSave',
              payload: { value: this.state, type: 'save' },
              callback: res => {
                if (res.status == 'success') {
                  this.props.dispatch({ type: 'tableTemplate/save', payload: { ChildData: [] } }); //清除子表的缓存数据
                  this.props.dispatch({
                    type: 'tableTemplate/changeState',
                    payload: { isEdit: true, buttonType: true, disEditStyle: true }
                  })
                }
              },
            });
          } else {
            this.props.dispatch({
              type: 'tableTemplate/getDetailSave',
              payload: { value: this.state, type: 'edit' },
              callback: res => {
                if (res.status == 'success') {
                  this.props.dispatch({ type: 'tableTemplate/save', payload: { ChildData: [] } }); //清除子表的缓存数据
                  this.props.dispatch({
                    type: 'tableTemplate/changeState',
                    payload: { isEdit: true, buttonType: true, disEditStyle: true }
                  })
                }
              },
            });
          }
        }
      }
    });
  };

  //详情页的自定义按钮事件
  onButtonEvent = e => {
    const { isEdit } = this.props.tableTemplate;
    this.props.dispatch({
      type: 'tableTemplate/getTransactionProcess',
      payload: { Buttons: e, isEdit },
    });
    this.props.dispatch({
      type: 'tableTemplate/getDetailPage',
      payload: {
        ID: this.props.tableTemplate.selectDate.ID,
        ObjectType: this.props.tableTemplate.detailColumns.objectType,
        pageId: this.props.tableTemplate.pageId,
      },
    });
  };



  render() {
    const { tableColumns = [], isEdit, selectedRowKeys, buttonType } = this.props.tableTemplate;
    const tableButtons = this.props.tableTemplate.tableColumnsData.buttons || [];
    const { loading = false } = this.props;
    return (
      <div>
        <div
          className="BasicEditBody"
          style={{
            display: buttonType ? 'block' : 'none',
            background: 'white',
            lineHeight: '41px',
          }}
        >
          <Button
            disabled={
              editAndDeleteButton['ADD']
                ? editAndDeleteButton['ADD'].READ_ONLY_CONDITION
                : false
            }
            style={{
              marginRight: '10px',
              display: !_.isEmpty(editAndDeleteButton['ADD'])
                ? editAndDeleteButton['ADD'].DISPLAY_CONDITION
                  ? 'inline-block'
                  : 'none'
                : 'inline-block',
            }}
            onClick={this.detailCreate}
            type="primary"
          >
            新增
          </Button>
          <Button
            disabled={
              editAndDeleteButton['EDIT']
                ? editAndDeleteButton['EDIT'].READ_ONLY_CONDITION
                : false
            }
            style={{
              marginRight: '10px',
              display: !_.isEmpty(editAndDeleteButton['EDIT'])
                ? editAndDeleteButton['EDIT'].DISPLAY_CONDITION
                  ? 'inline-block'
                  : 'none'
                : 'inline-block',
            }}
            onClick={this.detailEdit}
          >
            编辑
          </Button>
          <Button
            disabled={
              editAndDeleteButton['DELETE']
                ? editAndDeleteButton['DELETE'].READ_ONLY_CONDITION
                : false
            }
            style={{
              marginRight: '10px',
              display: !_.isEmpty(editAndDeleteButton['DELETE'])
                ? editAndDeleteButton['DELETE'].DISPLAY_CONDITION
                  ? 'inline-block'
                  : 'none'
                : 'inline-block',
            }}
            onClick={() => this.showConfirmModal('detailDelete', '确定要删除这条数据么？')}
          >
            删除
          </Button>
          {/* 自定义按钮 */}
          {this.editButton()}
          <Button style={{ marginRight: '10px' }} onClick={this.editBack}>
            返回
          </Button>
        </div>
        <div
          className="BasicEditBody"
          style={{
            display: buttonType ? 'none' : 'block',
            background: 'white',
            lineHeight: '41px',
            // padding: '1rem',
          }}
        >
          <Button
            onClick={() => this.onEditSave()}
            style={{ marginRight: '10px' }}
            type="primary"
            loading={loading}
          >
            保存
          </Button>
          <Button
            style={{ marginRight: '10px' }}
            onClick={this.checkChanged}
          >
            取消
          </Button>
        </div>
      </div>
    );
  }
}

export default DetailButtons;

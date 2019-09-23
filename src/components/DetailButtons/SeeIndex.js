import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import router from 'umi/router'
import { Form, Row, Col, Select, Input, Button, Icon, DatePicker } from 'antd';
import ComModal from '@/components/ConfirmModel/index';
import FormModals from '@/components/ConfirmModel/FormModal';
import GuidePage from '@/components/GuidePage/NewIndex';
import ButtonGroup from '@/components/ButtonGroup';
import DetailButtonGroup from '@/components/DetailButtonsGroup/SeeIndex';
import { withRouter } from 'react-router'

import styles from './style.less';

let editAndDeleteButton = {
  ADD: {},
  DELETE: {},
  EDIT: {},
  OPENACCOUNT: {}, //开户
};

@Form.create()
@connect(({ loading,detailPage,listPage, guidePage }) => ({
  guidePage,
  listPage,
  detailPage,
}))
class DetailButtons extends PureComponent {
  state = {};

  componentDidMount() {}

  UNSAFE_componentWillReceiveProps(newProps) {}

  handleClickItem = item => {};

  //详情页按钮，按钮组版本
  editButton = () => {
    const buttons = _.get(this.props.detailPage, 'detailData.buttons', []);
    const buttonData = [];
    // 删除，编辑区分处理
    editAndDeleteButton = {};
    const buttonList = [];

    buttons.map(item => {
      if (item.FIELD_NAME === 'DELETE') {
        editAndDeleteButton['DELETE'] = item;
      } else if (item.FIELD_NAME === 'EDIT') {
        editAndDeleteButton['EDIT'] = item;
      } else if (item.FIELD_NAME === 'ADD') {
        editAndDeleteButton['ADD'] = item;
      } else {
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

  showConfirmModal = (message) => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const ComModalProps = {
      handleOk: () => {
        this.handleOk();
      },
      message,
    };
    ReactDOM.render(<ComModal store={window.g_app._store} {...ComModalProps} />, div);
  };

  handleOk = e => {
      this.detailDelete();
  };

  // 开户
  openAccount = e => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const ComModalProps = {
      tableButton: e,
    };
    ReactDOM.render(<GuidePage store={window.g_app._store} {...ComModalProps} />, div);
  };

  // 新增
  detailCreate = () => {
    let {pathname,search} = this.props.location
    if(pathname.includes('/detail/')){
      let newPathName = pathname.split('/detail/')[0] + '/add' + search
      router.push(newPathName)
    } else if(pathname.includes('/detailSee/')){
      let newPathName = pathname.split('/detailSee/')[0] + '/add' + search
      router.push(newPathName)
    }
  };

  // 编辑
  detailEdit = () => {
    let {pathname,search} = this.props.location
    let newPathName = pathname.replace(/detailSee/g,'detail') + search
    router.push(newPathName)
  };

  // 删除
  detailDelete = () => {
    let objectType = this.props.location.query.ObjectType
    let pageId = this.props.location.query.PageId*1
    const businessId = this.props.match.params.detailId *1
    let param = {
        objectType,
        pageId,
        businessId:[businessId],
    }
    this.props.dispatch({
      type: 'detailPage/getRemoveBusiness',
      payload: { param },
      callback:res=>{
          if(res.status == 'success'){
            let {pathname,search} = this.props.location
            let newPathName = pathname.split('/detailSee/')[0] + '/list' + search
            router.push(newPathName)
          }
      }
    });
  };

  // 返回
  editBack = () => {
    let {pathname,search} = this.props.location
    let newPathName = pathname.split('/detailSee/')[0] + '/list' + search
    router.push(newPathName)
  };

 

  //详情页的自定义按钮事件
  onButtonEvent = e => {
    this.props.dispatch({
      type: 'detailPage/getTransactionProcess',
      payload: { Buttons: e, isEdit },
    });
    this.props.dispatch({
      type: 'detailPage/getDetailPage',
      payload: {
        ID: this.props.tableTemplate.selectDate.ID,
        ObjectType: this.props.tableTemplate.detailColumns.objectType,
        pageId: this.props.tableTemplate.pageId,
      },
    });
  };

  render() {
    const tableButtons = this.props.listPage.tableColumnsData.buttons || [];
    const { loading = false } = this.props;
    return (
      <div>
        <div
          className="BasicEditBody"
          style={{
            background: 'white',
            lineHeight: '41px',
          }}
        >
          <Button
            disabled={
              editAndDeleteButton['ADD'] ? editAndDeleteButton['ADD'].READ_ONLY_CONDITION : false
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
              editAndDeleteButton['EDIT'] ? editAndDeleteButton['EDIT'].READ_ONLY_CONDITION : false
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
            onClick={() => this.showConfirmModal('确定要删除这条数据么？')}
          >
            删除
          </Button>
          {/* 自定义按钮 */}
          {this.editButton()}
          <Button style={{ marginRight: '10px' }} onClick={this.editBack}>
            返回
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(DetailButtons);

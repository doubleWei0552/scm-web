import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';

import { Form, Row, Col, Select, Input, Button, Icon, DatePicker } from 'antd';
import ComModal from '@/components/ConfirmModel/index';
import DataImport from '@/components/ImportAndExport/DataImport'; // 导入组件
import Export from '@/components/ImportAndExport/Export'; // 导出组件
import GuidePage from '@/components/GuidePage'; // 导向页组件
import ButtonGroup from '@/components/ButtonGroup';
import HorizontalButtonGroup from '@/components/TableButtonGroup';

import styles from './style.less';

// const ButtonGroup = Button.Group;

@Form.create()
@connect(({ tableTemplate, loading }) => ({
  tableTemplate,
  loadingG: loading.effects['tableTemplate/getDetailPage'],
}))
class CustomerButtons extends PureComponent {
  componentDidMount() { }

  componentWillReceiveProps(newProps) { }

  tableCreate = e => {
    this.props.dispatch({
      type: 'tableTemplate/changeState',
      payload: {
        isEdit: true,
        buttonType: false,
        isNewSave: true,
        disEditStyle: false,
        selectDate: {},
        ChildData: [],
        fileList: [],
      },
    });
    this.props.dispatch({
      type: 'tableTemplate/getDetailPage',
      payload: {
        ObjectType: this.props.tableTemplate.detailColumns.objectType,
        pageId: this.props.tableTemplate.pageId,
      },
    });
  };

  showConfirmModal = (e, message) => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const ComModalProps = {
      handleOk: () => {
        this.handleOk(e);
      },
      message,
    };
    ReactDOM.render(<ComModal store={window.g_app._store} {...ComModalProps} />, div);
  };

  handleOk = e => {
    if (e === 'tableDelete') {
      this.tableDelete();
    } else if (e === 'detailDelete') {
      this.detailDelete();
    } else if (e === 'onCancled') {
      this.onCancled();
    }
  };

  // 删除选中的表格数据
  tableDelete = () => {
    this.props.dispatch({ type: 'tableTemplate/getRemoveBusiness' });
  };

  // 列表页导入按钮
  tableImport = e => {
    // e表示自定义的按钮
    const div = document.createElement('div');
    document.body.appendChild(div);
    const importButton = {
      importButton: e,
      ...this.props,
    };
    ReactDOM.render(<DataImport store={window.g_app._store} {...importButton} />, div);
  };

  // 列表页导出按钮
  tableExport = e => {
    const { searchParams, pageId } = this.props.tableTemplate;
    const div = document.createElement('div');
    document.body.appendChild(div);
    const exportButton = {
      ...this.props,
      pageId,
      searchParams,
    };
    ReactDOM.render(<Export {...exportButton} store={window.g_app.store} />, div);
  };

  // 列表页的自定义按钮事件
  onTableButtonEvent = e => {
    const { selectedRowKeys } = this.props.tableTemplate;
    switch (e.BEHAVIOR) {
      case 'ExecuteJavaScript': // 执行导向弹框
        const div = document.createElement('div');
        document.body.appendChild(div);
        const tableButton = {
          tableButton: e,
          ...this.props,
        };
        ReactDOM.render(<GuidePage store={window.g_app._store} {...tableButton} />, div);
        break;
      case 'ExecuteMethod': // 执行按钮的方法
        this.props.dispatch({
          type: 'tableTemplate/getTransactionProcess',
          payload: { Buttons: e, idList: selectedRowKeys },
        });
        // message.success('暂待开发')
        // this.props.dispatch({
        //   type: 'tableTemplate/getDetailPage',
        //   payload: {
        //     ID: this.props.tableTemplate.selectDate.ID,
        //     ObjectType: this.props.tableTemplate.detailColumns.objectType,
        //     pageId: this.props.tableTemplate.pageId,
        //   },
        // });
        break;
      default:
        return null;
    }
  };

  render() {
    const { tableColumns = [], isEdit, selectedRowKeys } = this.props.tableTemplate;
    const tableButtons = this.props.tableTemplate.tableColumnsData.buttons || [];
    const buttonList = [];
    _.map(tableButtons, item => {
      const index = _.findIndex(buttonList, l => l.groupName === item.BUTTON_GROUP);
      if (index > -1) {
        buttonList[index].buttons.push(item);
      } else {
        buttonList.push({ groupName: item.BUTTON_GROUP, buttons: [item] });
      }
    });
    if (buttonList.length === 0) {
      return null;
    }
    console.log('按钮buttonList',buttonList)
    return (
      <div className={styles.tableButtonPage}>
        {buttonList.length &&
          _.map(buttonList, (data,index) => {
            if (!data.groupName) {
              return (
                <span key={index}>
                  {data.buttons.map(item => {
                    const obj = JSON.parse(item.JAVA_SCRIPT_CONTENT || '{}') || {};
                    if (obj && obj.batchImport) {
                      return (
                        <Button
                          key={item.ID}
                          disabled={item.READ_ONLY_CONDITION}
                          onClick={() => this.tableImport(item)}
                          style={{
                            marginRight: '5px',
                            display: item.DISPLAY_CONDITION ? 'none' : 'inline-block',
                          }}
                        >
                          {item.LABEL}
                        </Button>
                      );
                    }
                    switch (item.FIELD_NAME) {
                      case 'ADD_SUMMARY':
                        return (
                          <Button
                            disabled={item.READ_ONLY_CONDITION}
                            key={item.ID}
                            onClick={this.tableCreate}
                            style={{
                              marginRight: '5px',
                              display: item.DISPLAY_CONDITION ? 'none' : 'inline-block',
                            }}
                            type="primary"
                          >
                            {item.LABEL}
                          </Button>
                        );
                        break;
                      case 'DELETED_SUMMARY':
                        return (
                          <Button
                            key={item.ID}
                            disabled={selectedRowKeys.length > 0 ? item.READ_ONLY_CONDITION : true}
                            onClick={() =>
                              this.showConfirmModal('tableDelete', '确定要删除这些数据么？')
                            }
                            style={{
                              marginRight: '5px',
                              display: item.DISPLAY_CONDITION ? 'none' : 'inline-block',
                            }}
                          >
                            {item.LABEL}
                          </Button>
                        );
                        break;
                      case 'DAORU':
                        return (
                          <Button
                            key={item.ID}
                            disabled={item.READ_ONLY_CONDITION}
                            onClick={() => this.tableImport(item)}
                            style={{
                              marginRight: '5px',
                              display: item.DISPLAY_CONDITION ? 'none' : 'inline-block',
                            }}
                          >
                            {item.LABEL}
                          </Button>
                        );
                        break;
                      case 'DAOCHU':
                        return (
                          <Button
                            key={item.ID}
                            // disabled={item.READ_ONLY_CONDITION}
                            onClick={this.tableExport}
                            style={{
                              marginRight: '5px',
                              // display: item.DISPLAY_CONDITION ? 'none' : 'inline-block',
                            }}
                          >
                            {item.LABEL}
                          </Button>
                        );
                        break;
                      default:
                        return (
                          <Button
                            key={item.ID}
                            style={{
                              marginRight: '5px',
                              display: item.DISPLAY_CONDITION ? 'none' : 'inline-block',
                            }}
                            disabled={item.READ_ONLY_CONDITION}
                            onClick={() => this.onTableButtonEvent(item)}
                          >
                            {item.LABEL}
                          </Button>
                        );
                        break;
                    }
                  })}
                </span>
              );
            } else {
              return <HorizontalButtonGroup key={_.now()} data={data} />;
            }
          })}
      </div>
    );
  }
}

export default CustomerButtons;

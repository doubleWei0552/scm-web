import React from 'react';
import { Menu, Dropdown, Button, Icon, Popconfirm } from 'antd';
import ComModal from '@/components/ConfirmModel';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import DataImport from '@/components/ImportAndExport/DataImport'; // 导入组件
import Export from '@/components/ImportAndExport/Export'; // 导出组件
import GuidePage from '@/components/GuidePage'; // 导向页组件
import FormModals from '@/components/ConfirmModel/FormModal'
import TableModals from '@/components/ConfirmModel/TableModal';
import styles from './style.less';
import CountDown from '../CountDown';

const ButtonGroup = Button.Group;

// @Form.create()
@connect(({ tableTemplate, loading }) => ({
  tableTemplate,
  loadingG: loading.effects['tableTemplate/getDetailPage'],
}))
export default class DetailButtonGroup extends React.Component {
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

  handleOk = e => {
    if (e === 'tableDelete') {
      this.tableDelete();
    } else if (e === 'detailDelete') {
      this.detailDelete();
    } else if (e === 'onCancled') {
      this.onCancled();
    }
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

  handleClickItem = item => {
    const { FIELD_NAME, CONFIRM } = item;
    if (CONFIRM) {
      const div = document.createElement('div')
      document.body.appendChild(div)
      const ComModalProps = {
        handleOk: () => {
          this.onButtonEvent(item)
          this.handleCancel()
        },
        handleCancel: this.handleCancel,
        message: item.CONFIRM_MESSAGE ? item.CONFIRM_MESSAGE : '确定执行本次操作?'
      }
      ReactDOM.render(<ComModal ref={dom => (this.ComModal = dom)} store={window.g_app._store} {...ComModalProps} />, div)
      // } else if (FIELD_NAME == 'newCustUser' || FIELD_NAME == 'newSupplier') {
    } else if (_.get(item, 'TRANSACTION.relatedFieldGroup')=='OPEN') {
      this.openAccount(item)
    } else if (_.get(item, 'TRANSACTION.relatedFieldGroup')=='CREATESALES') {
      this.tableModal(item)
    } else {
      this.onButtonEvent(item)
    }
  };

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

  handleCancel = () => {
    this.ComModal.handleCancel()
  }


  // 开户
  openAccount = (e) => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const ComModalProps = {
      tableButton: e,
    }
    ReactDOM.render(<FormModals store={window.g_app._store} {...ComModalProps} />, div)
  }

  //table类型的模态框
  tableModal =(e)=>{
    const div = document.createElement('div')
    document.body.appendChild(div)
    const ComTableModalProps = {
      tableButton: e,
    }
    ReactDOM.render(<TableModals store={window.g_app._store} {...ComTableModalProps} />, div)
  }

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
    const { buttonList } = this.props;
    // const firstButton = data.buttons[0];
    // const otherButtons = _.tail(data.buttons);



    return (
      <span>
        {_.map(buttonList, (data, index) => {
          if (!data.groupName) {
            return (
              <span key={Math.random()}>
                {_.map(data.buttons, item => {
                  return (
                    <Button
                      key={Math.random()}
                      disabled={item.READ_ONLY_CONDITION}
                      onClick={() => this.handleClickItem(item)}
                      style={{
                        marginRight: '10px',
                        display: item.DISPLAY_CONDITION ? 'inline-block' : 'none',
                      }}
                    >
                      {item.LABEL}
                    </Button>
                  );
                })}
              </span>
            )
          } else if (data.buttons[0].HORIZONTAL == 'true') {
            return (
              <div key={Math.random()} style={{ display: 'inline-block', marginRight: '10px' }} className={styles.horizontalButtons}>
                <ButtonGroup>
                  {data.buttons.map(item => {
                    const obj = JSON.parse(item.JAVA_SCRIPT_CONTENT || '{}');
                    if (obj && obj.batchImport) {
                      return (
                        <Button
                          key={Math.random()}
                          className={item.READ_ONLY_CONDITION ? 'horzBtn' : ''}
                          disabled={item.READ_ONLY_CONDITION}
                          onClick={() => this.tableImport(item)}
                          style={{
                            // marginRight: '10px',
                            display: item.DISPLAY_CONDITION ? 'inline-block' : 'none',
                          }}
                        >
                          {item.LABEL}
                        </Button>
                      );
                    } else {
                      return (
                        <Button
                          disabled={item.READ_ONLY_CONDITION}
                          key={Math.random()}
                          className={item.READ_ONLY_CONDITION ? 'disabledBtn' : ''}
                          onClick={() => this.handleClickItem(item)}
                          style={{
                            // marginRight: '5px',
                            display: item.DISPLAY_CONDITION ? 'inline-block' : 'none',
                          }}
                        // type="primary"
                        >
                          {item.LABEL}
                        </Button>
                      );
                    }
                  })}
                </ButtonGroup>
              </div>
            );
          } else {
            const firstButton = data.buttons[0];
            const otherButtons = _.tail(data.buttons);
            const menu = (
              <Menu key={Math.random()}>
                {_.map(otherButtons, item => {
                  const obj = JSON.parse(item.JAVA_SCRIPT_CONTENT || '{}');
                  if (obj && obj.batchImport) {
                    return (
                      <Menu.Item key={Math.random()} disabled={item.READ_ONLY_CONDITION}>
                        <Button
                          style={{ border: 'none', background: 'transparent', height: '20px' }}
                          onClick={() => this.tableImport(item)}
                          disabled={item.READ_ONLY_CONDITION}
                        >
                          {item.LABEL}
                        </Button>
                      </Menu.Item>
                    );
                  } else {
                    return (
                      <Menu.Item key={Math.random()} disabled={item.READ_ONLY_CONDITION}>
                        <Button
                          disabled={item.READ_ONLY_CONDITION}
                          key={item.ID}
                          onClick={() => this.handleClickItem(item)}
                          style={{ border: 'none', background: 'transparent', height: '20px' }}
                        // type="primary"
                        >
                          {item.LABEL}
                        </Button>
                      </Menu.Item>
                    );
                  }
                })}
              </Menu>
            )
            return (
              <span className={styles.dropdownGroup} style={{ marginRight: '10px' }} ref={dom => { index === 0 ? this.dom0 = dom : index === 1 ? this.dom1 = dom : index === 2 ? this.dom2 = dom : index === 3 ? this.dom3 = dom : index === 4 ? this.dom4 = dom : this.ddom = dom }} key={firstButton.ID}>
                <Button
                  style={{
                    borderBottomRightRadius: 0,
                    borderTopRightRadius: 0,
                    borderRightWidth: '0.5px',
                  }}

                  disabled={firstButton.READ_ONLY_CONDITION}
                  onClick={() => this.handleClickItem(firstButton)}
                  className={firstButton.READ_ONLY_CONDITION ? 'disabledBtn' : 'mainBtn'}
                >
                  {firstButton.LABEL}
                </Button>
                <Dropdown
                  overlay={menu}
                  getPopupContainer={() => index === 0 ? this.dom0 : index === 1 ? this.dom1 : index === 2 ? this.dom2 : index === 3 ? this.dom3 : index === 4 ? this.dom4 : this.ddom}
                  style={{ borderTopLeftRadious: 0 }}
                  placement="bottomLeft"
                  overlayClassName="overlaybuttons"
                  trigger={['click']}
                // triggersubmenuaction
                >
                  <Button
                    style={{
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      borderLeftWidth: '0.5px',
                      width: '32px',
                      padding: 0,
                    }}
                  >
                    <Icon type="ellipsis" />
                  </Button>
                </Dropdown>
              </span>
            );
          }
        })}
      </span>
    )

  }
}

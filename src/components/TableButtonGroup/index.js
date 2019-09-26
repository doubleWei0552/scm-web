import React from 'react';
import { Menu, Dropdown, Button, Icon, Popconfirm } from 'antd';
import ComModal from '@/components/ConfirmModel';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import DataImport from '@/components/ImportAndExport/DataImport'; // 导入组件
import Export from '@/components/ImportAndExport/Export'; // 导出组件
import GuidePage from '@/components/GuidePage'; // 导向页组件
import styles from './style.less';

const ButtonGroup = Button.Group;

// @Form.create()
@connect(({ tableTemplate,listPage, loading }) => ({
  tableTemplate,
  listPage,
  loadingG: loading.effects['tableTemplate/getDetailPage'],
}))
export default class HorizontalButtonGroup extends React.Component {
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
    // const { selectedRowKeys } = this.props.tableTemplate;
    const { selectedRowKeys } = this.props.listPage;
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
          // type: 'tableTemplate/getTransactionProcess',
          type: 'listPage/getTransactionProcess',
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
    const { FIELD_NAME } = item;
    switch (item.FIELD_NAME) {
      case 'ADD_SUMMARY':
        this.tableCreate();
        break;
      case 'DELETED_SUMMARY':
        this.showConfirmModal('tableDelete', '确定要删除这些数据么？');
        break;
      case 'DAORU':
        this.tableImport(item);
        break;
      case 'DAOCHU':
        this.tableExport();
        break;
      default:
        this.onTableButtonEvent(item);
        break;
    }
  };

  render() {
    const { data } = this.props;
    const firstButton = data.buttons[0];
    const otherButtons = _.tail(data.buttons);
    const menu = (
      <Menu>
        {_.map(otherButtons, item => {
          const obj = JSON.parse(item.JAVA_SCRIPT_CONTENT || '{}');
          if (obj && obj.batchImport) {
            return (
              <Menu.Item key={item.ID} disabled={item.READ_ONLY_CONDITION}>
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
              <Menu.Item key={item.ID} disabled={item.READ_ONLY_CONDITION}>
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
          // switch (item.FIELD_NAME) {
          //   case 'ADD_SUMMARY':
          //     return (
          //       <Menu.Item key={item.ID} disabled={item.READ_ONLY_CONDITION}>
          //         <Button
          //           disabled={item.READ_ONLY_CONDITION}
          //           key={item.ID}
          //           onClick={this.tableCreate}
          //           style={{ border: 'none', background: 'transparent', height: '20px' }}
          //         // type="primary"
          //         >
          //           {item.LABEL}
          //         </Button>
          //       </Menu.Item>
          //     );
          //     break;
          //   case 'DELETED_SUMMARY':
          //     return (
          //       <Menu.Item key={item.ID} disabled={item.READ_ONLY_CONDITION}>
          //         <Button
          //           key={item.ID}
          //           disabled={selectedRowKeys.length > 0 ? item.READ_ONLY_CONDITION : true}
          //           onClick={() => this.showConfirmModal('tableDelete', '确定要删除这些数据么？')}
          //           style={{ border: 'none', background: 'transparent', height: '20px' }}
          //         >
          //           {item.LABEL}
          //         </Button>
          //       </Menu.Item>
          //     );
          //     break;
          //   case 'DAORU':
          //     return (
          //       <Menu.Item key={item.ID} disabled={item.READ_ONLY_CONDITION}>
          //         <Button
          //           key={item.ID}
          //           disabled={item.READ_ONLY_CONDITION}
          //           onClick={() => this.tableImport(item)}
          //           style={{ border: 'none', background: 'transparent', height: '20px' }}
          //         >
          //           {item.LABEL}
          //         </Button>
          //       </Menu.Item>
          //     );
          //     break;
          //   case 'DAOCHU':
          //     return (
          //       <Menu.Item key={item.ID} disabled={item.READ_ONLY_CONDITION}>
          //         <Button
          //           key={item.ID}
          //           // disabled={item.READ_ONLY_CONDITION}
          //           onClick={this.tableExport}
          //           style={{ border: 'none', background: 'transparent', height: '20px' }}
          //         >
          //           {item.LABEL}
          //         </Button>
          //       </Menu.Item>
          //     );
          //     break;
          //   default:
          //     return (
          //       <Menu.Item key={item.ID} disabled={item.READ_ONLY_CONDITION}>
          //         <Button
          //           key={item.ID}
          //           style={{ border: 'none', background: 'transparent', height: '20px' }}
          //           disabled={item.READ_ONLY_CONDITION}
          //           onClick={() => this.onTableButtonEvent(item)}
          //         >
          //           {item.LABEL}
          //         </Button>
          //       </Menu.Item>
          //     );
          //     break;
          // }
        })}
      </Menu>
    );

    if (data.buttons[0].HORIZONTAL == 'true') {
      return (
        <div style={{ display: 'inline-block' }} className={styles.horizontalButtons}>
          <ButtonGroup>
            {data.buttons.map(item => {
              const obj = JSON.parse(item.JAVA_SCRIPT_CONTENT || '{}');
              if (obj && obj.batchImport) {
                return (
                  <Button
                    key={item.ID}
                    className={item.READ_ONLY_CONDITION ? 'horzBtn' : ''}
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
              } else {
                return (
                  <Button
                    className={item.READ_ONLY_CONDITION ? 'horzBtn' : ''}
                    disabled={item.READ_ONLY_CONDITION}
                    key={item.ID}
                    onClick={() => this.handleClickItem(item)}
                    style={{
                      marginRight: '5px',
                      display: item.DISPLAY_CONDITION ? 'none' : 'inline-block',
                    }}
                  // type="primary"
                  >
                    {item.LABEL}
                  </Button>
                );
              }
              // switch (item.FIELD_NAME) {
              //   case 'ADD_SUMMARY':
              //     return (
              //       <Button
              //         disabled={item.READ_ONLY_CONDITION}
              //         key={item.ID}
              //         onClick={this.tableCreate}
              //         style={{
              //           marginRight: '5px',
              //           display: item.DISPLAY_CONDITION ? 'none' : 'inline-block',
              //         }}
              //         type="primary"
              //       >
              //         {item.LABEL}
              //       </Button>
              //     );
              //     break;
              //   case 'DELETED_SUMMARY':
              //     return (
              //       <Button
              //         key={item.ID}
              //         disabled={selectedRowKeys.length > 0 ? item.READ_ONLY_CONDITION : true}
              //         onClick={() => this.showConfirmModal('tableDelete', '确定要删除这些数据么？')}
              //         style={{
              //           marginRight: '5px',
              //           display: item.DISPLAY_CONDITION ? 'none' : 'inline-block',
              //         }}
              //       >
              //         {item.LABEL}
              //       </Button>
              //     );
              //     break;
              //   case 'DAORU':
              //     return (
              //       <Button
              //         key={item.ID}
              //         disabled={item.READ_ONLY_CONDITION}
              //         onClick={() => this.tableImport(item)}
              //         style={{
              //           marginRight: '5px',
              //           display: item.DISPLAY_CONDITION ? 'none' : 'inline-block',
              //         }}
              //       >
              //         {item.LABEL}
              //       </Button>
              //     );
              //     break;
              //   case 'DAOCHU':
              //     return (
              //       <Button
              //         key={item.ID}
              //         // disabled={item.READ_ONLY_CONDITION}
              //         onClick={this.tableExport}
              //         style={{
              //           marginRight: '5px',
              //           // display: item.DISPLAY_CONDITION ? 'none' : 'inline-block',
              //         }}
              //       >
              //         {item.LABEL}
              //       </Button>
              //     );
              //     break;
              //   default:
              //     return (
              //       <Button
              //         key={item.ID}
              //         style={{
              //           marginRight: '5px',
              //           display: item.DISPLAY_CONDITION ? 'none' : 'inline-block',
              //         }}
              //         disabled={item.READ_ONLY_CONDITION}
              //         onClick={() => this.onTableButtonEvent(item)}
              //       >
              //         {item.LABEL}
              //       </Button>
              //     );
              //     break;
              // }
            })}
          </ButtonGroup>
        </div>
      );
    } else {
      return (
        <div className={styles.dropdownGroup} ref={dom => this.ddom = dom}>

          <Button
            style={{
              borderBottomRightRadius: 0,
              borderTopRightRadius: 0,
              borderRightWidth: '0.5px',
            }}
            key={firstButton.ID}
            disabled={firstButton.READ_ONLY_CONDITION}
            onClick={() => this.handleClickItem(firstButton)}
            className={firstButton.READ_ONLY_CONDITION ? 'disabledBtn' : 'mainBtn'}
          >
            {firstButton.LABEL}
          </Button>
          <Dropdown
            overlay={menu}
            getPopupContainer={() => this.ddom}
            style={{ borderTopLeftRadious: 0 }}
            placement="bottomLeft"
            overlayClassName="overlaybuttons"
            trigger={['click']}
            block
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
        </div>
      );
    }
  }
}

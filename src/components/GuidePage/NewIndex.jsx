import {
  Steps,
  Button,
  message,
  Modal,
  Form,
  Switch,
  Row,
  Spin,
  Col,
  Input,
  Select,
  Number,
  notification,
  Icon,
} from 'antd';
import React from 'react';
import moment from 'moment'
import ReactDOM from 'react-dom'
import { connect } from 'dva';
import ResultCom from './Result.jsx'
import FormCom from './Form.jsx'
import TableCom from './Table.jsx'

const { Step } = Steps;
@Form.create()
@connect(({ guidePage, tableTemplate, loading }) => ({
  guidePage,
  tableTemplate,
  loadingG:
    loading.effects['guidePage/getButtonGuideConfig'] ||
    loading.effects['guidePage/getButtonGuideData'] ||
    loading.effects['guidePage/detailButtonGuide'] ||
    loading.effects['guidePage/getGuideBean'] ||
    loading.effects['guidePage/TransactionProcess']
}))
export default class NewGuidePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      visible: true,
      loading: true,
      havaResult: false, //是否含有结果页
      isGoUp: true, //提交成功以后是否包含上一步按钮
    };
  }

  UNSAFE_componentWillMount = () => {  //每次打开导向页都是清空状态
    let buttons = this.props.tableButton.BUTTON_GUIDE
    buttons.map(item => {
      if (item.BUTTON_GUIDE_TYPE == 'Result') {
        this.setState({
          havaResult: true
        })
      }
    })
    this.props.dispatch({
      type: 'guidePage/cleanData'
    })
  }

  // 多用户
  guideBack = () => {
    this.props.dispatch({
      type: 'guidePage/guideBack',
      payload: {
        ObjectType: this.props.tableTemplate.detailColumns.objectType,
      },
    })
  }

  next() {
    if (this.childForm) {
      this.childForm.validateFields(err => {
        if (!err) {
          const current = this.state.current + 1;
          this.setState({ current });
        }
      });
    } else {  //table类型的数据点击下一页添加验证
      let req = this.childTable.state.showColumns.req
      let NewSelectedRow = this.childTable.state.selectedRow
      let selectedRowKeys = this.childTable.state.selectedRowKeys
      let selectedRow = []
      NewSelectedRow.map((item => {
        selectedRowKeys.map(jj => {
          if(item.ID == jj){
            selectedRow.push(item)
          }
        })
      }))
      console.log('index筛选的数据',selectedRow,selectedRowKeys)
      if(selectedRow.length){
        let message = {}
        if (req) {
          let columns = this.childTable.state.showColumns.policyFormFields
          columns.map(jj => {
            req.map(gg => {
              if (jj.FIELD_NAME == gg) {
                message[jj.FIELD_NAME] = jj.LABEL
              }
            })
          })
        }
        let isContinue = true
        let messageInfo
        selectedRow.map(item => {
          req.map(ii => {
            if (!item[ii]) {
              isContinue = false
              messageInfo = ii
            }
          })
        })
        if (isContinue) {
          const current = this.state.current + 1;
          this.setState({ current });
        } else {
          notification.warning({ message: `${message[messageInfo]}不能为空！`, duration: 3 });
        }
      }
    }
  }

  goUp = (current) => {  // current为当前页，返回上一页得cerrent - 1
    current = this.state.current - 1;
    this.setState({ current });
  }

  close = () => {
    this.setState({
      visible: false,
    });
  };

  closeSpin = () => {
    this.setState({
      loading: false
    })
  }

  onRef = (ref) => {
    this.child = ref
  }

  submit = () => {
    const { current, havaResult } = this.state;
    const steps = this.props.tableButton.BUTTON_GUIDE
    if (this.childTable) {
      if (this.childTable.state.selectedRow.length > 0) {
        let ButtonName = this.props.tableButton.FIELD_NAME
        if (havaResult) {
          const current = this.state.current + 1;
          this.setState({ current });
        } else {
          let { isEdit, selectDate } = this.props.tableTemplate
          let relatedFieldGroup = this.props.guidePage.guidePageColumns.relatedFieldGroup
          this.childTable.state.selectedRow.map(item => {
            item.tablePageId = isEdit ? selectDate.ID : null
            for (let i in item) { //对时间格式进行转换
              if (typeof (item[i]) == 'string') {
                if (isNaN(item[i]) && !isNaN(Date.parse(item[i]))) {
                  item[i] = moment(item[i]).valueOf()
                }
              }
            }
          })
          this.props.dispatch({
            type: 'guidePage/getSaveData',
            payload: { relatedFieldGroup: relatedFieldGroup, data: this.childTable.state.selectedRow }
          })
        }
        setTimeout(() => {
          this.props.dispatch({
            type: 'guidePage/TransactionProcess',
            payload: {
              params: {
                ButtonName,
                AllData: this.props.guidePage.sendGuideData
              }
            }, callback: res => {
              if (res.status == 'success') {
                this.setState({
                  isGoUp: false,
                })
                if (!havaResult) {
                  notification.success({ message: res.message, duration: 3 });
                  this.setState({
                    visible: false
                  })
                }
                this.props.dispatch({ type: 'tableTemplate/getPagelist' }); //重新获取列表页数据
                this.props.dispatch({
                  type: 'tableTemplate/getDetailPage', payload: {
                    ID: this.props.tableTemplate.selectDate.ID,
                    ObjectType: this.props.tableTemplate.detailColumns.objectType,
                    pageId: this.props.tableTemplate.pageId,
                  }
                })
              } else {
                if (!havaResult) {
                  notification.error({ message: res.message, duration: 3 });
                }
              }
            }
          })
        }, 500)
      } else {
        notification.warning({ message: '未勾选数据，请选择你要提交的数据！', duration: 3 });
      }
    } else {
      let ButtonName = this.props.tableButton.FIELD_NAME
      if (havaResult) {
        this.childForm.validateFields(err => {
          if (!err) {
            const current = this.state.current + 1;
            this.setState({ current });
          }
        });
      } else {
        let { isEdit, selectDate } = this.props.tableTemplate
        let formData = _.cloneDeep(this.child.props.form.getFieldsValue())
        for (let i in formData) {
          if (typeof (formData[i]) == 'object' && formData[i]) {
            if (i.includes('-start')) {
              formData[i] = formData[i].startOf('day').valueOf()
            } else if (i.includes('-end')) {
              formData[i] = formData[i].endOf('day').valueOf()
            } else {
              formData[i] = formData[i].valueOf()
            }
          }
        }
        formData.formPageId = isEdit ? selectDate.ID : null  //进入详情页的ID
        this.props.dispatch({
          type: 'guidePage/getSaveData',
          payload: { relatedFieldGroup: this.child.state.showData.relatedFieldGroup, data: formData }
        })
      }
      this.childForm.validateFields(err => {
        if (!err) {
          setTimeout(() => {
            this.props.dispatch({
              type: 'guidePage/TransactionProcess',
              payload: {
                params: {
                  ButtonName,
                  AllData: this.props.guidePage.sendGuideData
                }
              }, callback: res => {
                if (res.status == 'success') {
                  this.setState({
                    isGoUp: false
                  })
                  if (!havaResult) {
                    notification.success({ message: res.message, duration: 3 });
                    this.setState({
                      visible: false
                    })
                  }
                  this.props.dispatch({ type: 'tableTemplate/getPagelist' }); //重新获取列表页数据
                  this.props.dispatch({
                    type: 'tableTemplate/getDetailPage', payload: {
                      ID: this.props.tableTemplate.selectDate.ID,
                      ObjectType: this.props.tableTemplate.detailColumns.objectType,
                      pageId: this.props.tableTemplate.pageId,
                    }
                  })
                } else {
                  if (!havaResult) {
                    notification.error({ message: res.message, duration: 3 });
                  }
                }
              }
            })
          }, 500)
        }
      });
    }
  }

  renderContent = (value) => {
    switch (value.BUTTON_GUIDE_TYPE) {
      case "Detail":  //form类型的页面
        return <div>
          <FormCom onRef={this.onRef} ref={dom => this.childForm = dom} store={window.g_app._store} dispatch={this.props.dispatch} tableButton={this.props.tableButton}
            tableTemplate={this.props.tableTemplate} current={this.state.current} closeSpin={this.closeSpin}
            guidePage={this.props.guidePage} />
        </div>
        break
      case "EditDetail":  //table类型的页面
        return <div>
          <TableCom onRef={dom => this.childTable = dom} store={window.g_app._store} dispatch={this.props.dispatch} tableButton={this.props.tableButton}
            tableTemplate={this.props.tableTemplate} current={this.state.current} closeSpin={this.closeSpin}
          />
        </div>
        break
      case "Result":  //结果页
        return <div>
          <ResultCom store={window.g_app._store} dispatch={this.props.dispatch} tableButton={this.props.tableButton}
            tableTemplate={this.props.tableTemplate} current={this.state.current} closeSpin={this.closeSpin}
            guidePage={this.props.guidePage} />
        </div>
        break
      default:
        break
    }
  }

  render() {
    const steps = this.props.tableButton.BUTTON_GUIDE
    const { current, havaResult, isGoUp } = this.state;
    return (
      <Modal
        footer={null}
        width="90%"
        maskClosable={false}
        closable={false}
        centered={true}
        visible={this.state.visible}
        afterClose={() => this.guideBack()}
      >
        <div>
          <Spin spinning={this.props.loadingG || this.state.loading || false}>
            {/* 顶部步骤条*/}
            <Steps current={current}>
              {steps.map(item => (
                <Step key={item.LABEL} title={item.LABEL} />
              ))}
            </Steps>
            {/* 中间的内容 */}
            <div style={{ margin: '24px 0', minHeight: '100px' }}>
              {this.renderContent(steps[current])}
            </div>
            {/* 底部按钮 */}
            <div style={{ textAlign: 'center' }}>
              {current < steps.length && current != 0 && isGoUp && (
                <Button style={{ marginRight: 8 }} type="primary" onClick={() => this.goUp(current)}>
                  上一步
              </Button>
              )}
              {current < (havaResult ? steps.length - 2 : steps.length - 1) && (
                <Button type="primary" onClick={() => this.next()}>
                  下一步
              </Button>
              )}
              {current === (havaResult ? steps.length - 2 : steps.length - 1) && (
                <Button type="primary" onClick={() => this.submit()}>
                  提交
              </Button>
              )}
              {current > -1 && (
                <Button style={{ marginLeft: 8 }} onClick={() => this.close()}>
                  关闭
              </Button>
              )}
            </div>
          </Spin>
        </div>
      </Modal>
    );
  }
}
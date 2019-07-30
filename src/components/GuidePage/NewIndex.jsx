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
import { connect } from 'dva';
import ResultCom from './Result.jsx'
import FormCom from './Form.jsx'
import TableCom from './Table.jsx'

const { Step } = Steps;
@Form.create()
@connect(({ guidePage,tableTemplate,loading }) => ({
    guidePage,
    tableTemplate,
    loadingG:
        loading.effects['guidePage/getButtonGuideConfig'] ||
        loading.effects['guidePage/getButtonGuideData']
  }))
export default class NewGuidePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      visible:true,
      loading:true,
    };
  }

  next() {
    this.childForm.validateFields(err => {
      if (!err) {
        const current = this.state.current + 1;
        this.setState({ current });
      }
    });
  }

  close = () => { 
    this.setState({
      visible: false,
    });
  };

  closeSpin = () =>{
    this.setState({
      loading:false
    })
  }

  submit =()=>{
    let ButtonName = this.props.tableButton.FIELD_NAME
    const current = this.state.current + 1;
    this.setState({ current });
    setTimeout(()=>{this.props.dispatch({
        type: 'guidePage/TransactionProcess',
        payload:{
            params:{
                ButtonName,
                AllData:this.props.guidePage.sendGuideData
            }
        },callback:res=>{
          if (res.status == 'success') {
            this.props.dispatch({ type: 'tableTemplate/getPagelist' }); //重新获取列表页数据
            this.props.dispatch({ type:'tableTemplate/getDetailPage',payload:{
              ID:this.props.tableTemplate.selectDate.ID,
              ObjectType:this.props.tableTemplate.detailColumns.objectType,
              pageId:this.props.tableTemplate.pageId,
            }})
          }
        }
    })},1000)
  }

  renderContent =(value)=>{
    switch(value.BUTTON_GUIDE_TYPE){
        case "Detail":  //form类型的页面
            return <div>
                <FormCom ref={dom=> this.childForm =dom}  store={window.g_app._store} dispatch={this.props.dispatch} tableButton={this.props.tableButton}
                tableTemplate={this.props.tableTemplate} current={this.state.current} closeSpin={this.closeSpin}
                guidePage={this.props.guidePage} />
            </div>
        break
        case "EditDetail":  //table类型的页面
            return <div>
                <TableCom store={window.g_app._store} dispatch={this.props.dispatch} tableButton={this.props.tableButton}
                tableTemplate={this.props.tableTemplate} current={this.state.current} closeSpin={this.closeSpin}
                />
            </div>
        break
        case "Result":  //结果页
            return <div>
                <ResultCom store={window.g_app._store} dispatch={this.props.dispatch} tableButton={this.props.tableButton}
                tableTemplate={this.props.tableTemplate} current={this.state.current} closeSpin={this.closeSpin}
                guidePage={this.props.guidePage}/>
            </div>
        break
        default:
            break
    }
  }

  render() {
    const steps = this.props.tableButton.BUTTON_GUIDE
    const { current } = this.state;
    return (
        <Modal
        footer={null}
        width="80%"
        maskClosable={false}
        closable={false}
        centered={true}
        visible={this.state.visible}
      >
      <div>
        <Spin spinning={this.props.loadingG || this.state.loading || false}>
          {/* 顶部步骤条 */}
          <Steps current={current}>
            {steps.map(item => (
              <Step key={item.LABEL} title={item.LABEL} />
            ))}
          </Steps>
          {/* 中间的内容 */}
          <div style={{margin:'24px 0',minHeight:'100px'}}>
              {this.renderContent(steps[current])}
          </div>
          {/* 底部按钮 */}
          <div style={{textAlign:'center'}}>
            {current < steps.length - 2 && (
              <Button type="primary" onClick={() => this.next()}>
                下一步
              </Button>
            )}
            {current === steps.length - 2 && (
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
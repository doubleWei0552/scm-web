import {
    Steps,
    Button,
    message,
    Modal,
    Form,
    Switch,
    Row,
    Col,
    Input,
    Select,
    Number,
    notification,
    Icon,
  } from 'antd';
import React from 'react';
import { connect } from 'dva';
import ResultCom from './Result'
import FormCom from './Form'
import TableCom from './Table'

const { Step } = Steps;
@Form.create()
export default class NewGuidePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      visible:true,
    };
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  close = () => {
    this.setState({
      visible: false,
    });
  };

  submit =()=>{
    const current = this.state.current + 1;
    this.setState({ current });
    let ButtonName = this.props.tableButton.FIELD_NAME
    setTimeout(()=>{this.props.dispatch({
        type: 'guidePage/TransactionProcess',
        payload:{
            params:{
                ButtonName,
                AllData:this.props.guidePage.sendGuideData
            }
        }
    })},1000)
  }

  renderContent =(value)=>{
    switch(value.BUTTON_GUIDE_TYPE){
        case "Detail":  //form类型的页面
            return <div>
                <FormCom dispatch={this.props.dispatch} tableButton={this.props.tableButton}
                tableTemplate={this.props.tableTemplate} current={this.state.current}
                guidePage={this.props.guidePage} />
            </div>
        break
        case "EditDetail":  //table类型的页面
            return <div>
                <TableCom store={window.g_app._store} dispatch={this.props.dispatch} tableButton={this.props.tableButton}
                tableTemplate={this.props.tableTemplate} current={this.state.current} form={this.props.form}
                />
            </div>
        break
        case "Result":  //结果页
            return <div>
                <ResultCom dispatch={this.props.dispatch} tableButton={this.props.tableButton}
                tableTemplate={this.props.tableTemplate} current={this.state.current}
                guidePage={this.props.guidePage}/>
            </div>
        break
        default:
            break
    }
  }

  render() {
    console.log('newIndex',this.props)
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
      </div>
      </Modal>
    );
  }
}
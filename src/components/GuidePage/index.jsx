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
import FormModular from './FormModular';
import TableModular from './TableModular';
import ResultModular from './ResultModular';

const Step = Steps.Step;

@connect(({ guidePage,loading }) => ({
  guidePage,
  loadingG:
      loading.effects['guidePage/getButtonGuideConfig'] ||
      loading.effects['guidePage/getButtonGuideData']
}))
@Form.create()
class GuidePage extends React.Component {
  state = {
    current: 0,
    visible: true,
    isLoading:false,
  };
  componentWillMount = () => {
    let params = this.props.tableButton.BUTTON_GUIDE[0];
    this.props.dispatch({ type: 'guidePage/detailButtonGuide', payload: { params } });
    this.props.dispatch({ type: 'guidePage/getButtonGuideClean' });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.props.dispatch({
      type: 'guidePage/save',
      payload: { cacheFormData: [], cacheSelectData: [] },
    });
    if(this.formPage){
      this.formPage.props.form.resetFields()
    }
    this.setState({
      visible: false,
    });
  };

  next() {
    this.formPage.props.form.validateFields((err, values) => {
      this.setState({})
      if (err) {
        console.log('err',this.formPage)
        return
      } else {
        const current = this.state.current + 1;
        let params = this.props.tableButton.BUTTON_GUIDE[current];
        const formData = _.flatten(this.props.guidePage.cacheFormData)
        switch (params.BUTTON_GUIDE_TYPE) {
          case 'Detail':
            this.props.dispatch({ type: 'guidePage/detailButtonGuide', payload: { params } });
            break;
          case 'EditDetail':
            this.props.dispatch({
              type: 'guidePage/getGuideBean', payload: {
                params,
                pageNum: 1,
                pageSize: 10,
                METHOD_BODY: params.METHOD_BODY,
                formData: formData.length ? formData : this.formPage.props.guidePage.guidePageFormData.policyFormFields
              }, callback: res => {
                if (res.status == 'success') {
                  this.props.dispatch({ type: 'guidePage/getButtonGuideConfig', payload: { params } });
                  this.props.dispatch({
                    type: 'guidePage/getButtonGuideData',
                    payload: {
                      params,
                      pageNum: 1,
                      pageSize: 10,
                      METHOD_BODY: params.METHOD_BODY,
                      // formData: formData.length ? formData : this.formPage.props.guidePage.guidePageFormData.policyFormFields
                    },
                  });
                }
              }
            });
            break;
          case 'Result':
            notification.success({ message: 'result page！', duration: 3 });
            break;
          default:
            break;
        }
        this.setState({ current });
      }
    })
    // return

  }
  // 点击提交按钮
  Submit = () => {
    this.setState({
      isLoading:true
    })
    const current = this.state.current + 1;
    const cacheFormDataTest = this.props.guidePage.cacheFormData; //被分组了，要处理下
    const cacheFormData = [];
    cacheFormDataTest.map(item => {
      item.map(ii => {
        cacheFormData.push(ii);
      });
    });
    const cacheSelectData = this.props.guidePage.cacheSelectData;
    let buttonName = this.props.tableButton.FIELD_NAME; //当前按钮名字
    this.props.dispatch({
      type: 'guidePage/TransactionProcess',
      payload: {
        params: {
          cacheFormData,
          cacheSelectData,
          ButtonName: buttonName,
        },
      },
      callback: res => {
        if (res.status == 'success') {
          this.props.dispatch({ type: 'tableTemplate/getPagelist' }); //重新获取列表页数据
          this.setState({ current,isLoading:false });
        } else {
          this.setState({ current,isLoading:false });
        }
      },
    });
    this.props.dispatch({
      type: 'guidePage/save',
      payload: { cacheFormData: [], cacheSelectData: [], cacheTableData: [] },
    });
    
  };

  prev() {
    const current = this.state.current - 1;
    let params = this.props.tableButton.BUTTON_GUIDE[current];
    switch (params.BUTTON_GUIDE_TYPE) {
      case 'Detail':
        this.props.dispatch({ type: 'guidePage/detailButtonGuide', payload: { params } });
        break;
      case 'EditDetail':
        this.props.dispatch({ type: 'guidePage/getButtonGuideConfig', payload: { params } });
        this.props.dispatch({
          type: 'guidePage/getButtonGuideData',
          payload: {
            params,
            pageNum: 1,
            pageSize: 10,
          },
        });
        break;
      case 'Result':
        notification.success({ message: 'result page！', duration: 3 });
        break;
      default:
        break;
    }
    this.setState({ current });
  }
  complete = () => {
    this.setState({
      visible: false,
    });
  };
  //渲染向导页的内容
  setStepsContent = (type, data) => {
    switch (type) {
      case 'Detail': //form表单
        const formProps = {
          CurrentData: data,
          form:this.props.form
        };
        return <FormModular key={_.now()} store={window.g_app._store} ref={dom => this.formPage = dom} {...formProps} />;
        break;
      case 'EditDetail': //table页
        const tableProps = {
          CurrentData: data,
          ...this.props,
        };
        return <TableModular {...tableProps} />;
        break;
      case 'Result': //结果反馈页
        const resultProps = {
          CurrentData: data,
          ...this.props,
        };
        return <ResultModular {...resultProps} />;
        break;
      default:
        break;
    }
  };

  render() {
    const { current } = this.state; //当前步骤条数
    const pageStructure = this.props.tableButton.BUTTON_GUIDE;
    let { guidePageData } = this.props.guidePage;
    return (
      <Modal
        footer={null}
        width="80%"
        maskClosable={false}
        //   bodyStyle={{height:'70vh',overflow:'scroll'}}
        closable={false}
        centered={true}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        {/* 步骤条 */}
        <Steps current={current} style={{ marginTop: '1rem' }}>
          {pageStructure.map(item => (
            <Step key={item.ID} title={item.LABEL} />
          ))}
        </Steps>
        {/* 显示的内容 */}
        {this.props.tableButton.BUTTON_GUIDE[current].BUTTON_GUIDE_TYPE && (
          <div className="steps-content" style={{ margin: '1rem 0', width: '100%' }}>
            <Row>
              {this.setStepsContent(
                this.props.tableButton.BUTTON_GUIDE[current].BUTTON_GUIDE_TYPE,
                this.props.tableButton.BUTTON_GUIDE[current]
              )}
            </Row>
          </div>
        )}

        {/* 底部的按钮 */}
        <div className="steps-action" style={{ width: '100%', textAlign: 'center' }}>
          {current < pageStructure.length - 2 && (
            <Button type="primary" onClick={() => this.next()}>
              下一步
            </Button>
          )}
          {current === pageStructure.length - 1 && (
            <Button type="primary" onClick={() => this.complete()}>
              完成
            </Button>
          )}
          {current === pageStructure.length - 2 && (
            <Button type="primary" onClick={() => this.Submit()}>
              提交<Icon style={{display:this.state.isLoading ? 'null' : 'none'}} type="loading" />
            </Button>
          )}
          {/* {
            current > 0 && current === pageStructure.length - 2 
            && (
            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
              上一步
            </Button>
            )
          } */}
          {current < pageStructure.length - 1 && (
            <Button style={{ marginLeft: 8 }} type="primary" onClick={() => this.handleCancel()}>
              关闭
            </Button>
          )}
        </div>
      </Modal>
    );
  }
}

export default GuidePage

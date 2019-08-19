import React from 'react'
import {
  Modal,
  Button,
  Tabs,
  Steps,
  Input,
  Form,
  Select,
} from 'antd'
import NormalUpload from '@/components/Upload/NormalUpload'

const TabPane = Tabs.TabPane;
const Step = Steps.Step
const Option = Select.Option

export default class Import extends React.Component {
  state = {
    visible: true,
    current: 1,
    ImportType: '',  //导入类型的值
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  updateData = () =>{
    const pageId = this.props.tableTemplate.pageId;
    // 进入请求分页数据,参数为默认值
    this.props.dispatch({
      type: 'tableTemplate/getPagination',
      payload: { pageId, current: 1, pageSize: 10 },
    });
  }

  callback = (key) => {
  }
  onChange = (e, i) => {
    switch (e) {
      case 1:
        this.setState({
          ImportType: i
        })
        break
    }
    this.setState({ current: e })
  }
  onClick = (e) => {
    let { ImportType } = this.state
    let { importButton: { JAVA_SCRIPT_CONTENT = '' } } = this.props
    const obj = JSON.parse(JAVA_SCRIPT_CONTENT)
    window.location.href = `${window.config.apiUrl}/batchImport/downLoad?downLoad=${encodeURIComponent(JSON.stringify(obj.batchImport))}`
    this.setState({ current: e })
  }
  StepDom = (item) => {
    switch (item) {
      case 'importModel':
        return (
          <div style={{ width: '50%', float: 'right', position: 'relative', top: '-32px' }}>
            <Select value={'add'} disabled={this.state.current >= 0 ? false : true} onChange={(i) => this.onChange(1, i)} placeholder='请选择导入模式' style={{ width: '100%' }} >
              <Option value="add">新增数据</Option>
              {/* <Option value="update">更新数据</Option> */}
            </Select>
          </div>
        )
        break
      case 'download':
        const { importButton } = this.props;
        return (
          <div style={{ width: '50%', float: 'right', position: 'relative', top: '-32px' }}>
            <Button disabled={this.state.current >= 1 ? false : true} onClick={() => this.onClick(2)} type='primary'>下载</Button><br />
            {/* <label>备注：导入模版中的Sheet名称和列表标题不能修改,否则导入失败！</label> */}
          </div>
        )
        break
      case 'importType':

        return (
          <div style={{ width: '50%', float: 'right', position: 'relative', top: '-32px' }}>
            <Select disabled={this.state.current >= 1 ? false : true} onChange={() => this.onChange(3)} placeholder='请选择导入类型' style={{ width: '100%' }} >
              <Option value="search">同步导入</Option>
              <Option value="check">异步导入</Option>
            </Select>
          </div>
        )
        break
      case 'upload':
        return (
          <div style={{ width: '50%', float: 'right', position: 'relative', top: '-32px' }}>
            <NormalUpload updateData={this.updateData} cancleModal={this.handleCancel} importButton={this.props.importButton} params={{ current: this.state.current, ImportType: this.state.ImportType }} disabled={this.state.current >= 3 ? false : true} />
          </div>
        )
        break
    }
  }
  render() {
    return (
      <div>
        <Modal
          bodyStyle={{ height: '65vh' }}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={
            <div style={{ textAlign: 'right', width: '100%' }}>
              <Button type='primary' onClick={this.handleCancel}>取消</Button>
            </div>
          }
        >
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab="批量导入" key="1">
              <Steps direction="vertical" current={this.state.current}>
                <Step title="导入模式" description={this.StepDom('importModel')} />
                <Step title="下载导入模版" description={this.StepDom('download')} />
                <Step title="导入类型" description={this.StepDom('importType')} />
                <Step title="上传Excel" description={this.StepDom('upload')} />
              </Steps>
            </TabPane>
            {/* <TabPane disabled tab="导入历史" key="2">
              你瞅啥，还没做！
                </TabPane> */}
          </Tabs>
        </Modal>
      </div>
    )
  }
}
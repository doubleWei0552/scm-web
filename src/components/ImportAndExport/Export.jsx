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

const TabPane = Tabs.TabPane;
const Step = Steps.Step
const Option = Select.Option

export default class Export extends React.Component {
    state = {
        visible: true,
        current: 1,
        formatValue:''
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

    callback = (key) => {
        console.log(key)
    }
    onChange = (e,i) => {
        console.log(e,i)
        this.setState({ current: i,formatValue:e })
    }
    //导出方法
    onClick = (e) => {
        let { formatValue } = this.state
        let { searchParams, pageId } = this.props
        this.setState({ current: e })
        window.location.href = `${window.config.apiUrl}/summary/export?query=${encodeURIComponent(JSON.stringify({
            formatValue,...searchParams,pageId
        }))}`
        this.handleCancel()
    }
    StepDom = (item) => {
        switch (item) {
            case 'exportModel':
                return (
                    <div style={{ width: '50%', float: 'right', position: 'relative', top: '-32px' }}>
                        <Select value={'search'} disabled={this.state.current >= 0 ? false : true} onChange={(e) => this.onChange(e,1)} placeholder='请选择导入模式' style={{ width: '100%' }} >
                            <Option value="search">按查询结果导出</Option>
                            {/* <Option value="check">按勾选数据导出</Option> */}
                        </Select>
                    </div>
                )
                break
            case 'expertButton':
                return (
                    <div style={{ width: '50%', float: 'right', position: 'relative', top: '-32px' }}>
                        <Button disabled={this.state.current >= 1 ? false : true} onClick={() => this.onClick(2)} type='primary'>导出</Button>
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
                        <TabPane tab="批量导出" key="1">
                            <Steps direction="vertical" current={this.state.current}>
                                <Step title="设置导出格式" description={this.StepDom('exportModel')} />
                                <Step title="开始导出" description={this.StepDom('expertButton')} />
                            </Steps>
                        </TabPane>
                        {/* <TabPane disabled tab="导出历史" key="2">
                            你瞅啥，还没做！
                        </TabPane> */}
                    </Tabs>
                </Modal>
            </div>
        )
    }
}
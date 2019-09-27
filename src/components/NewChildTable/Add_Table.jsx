import React from 'react'
import {
    Button,
    DatePicker,
    Select,
    Input,
    Row,
    Col,
    Table,
    Tooltip,
} from 'antd';

export default class Add_Table extends React.Component{
    componentDidMount=()=>{
        console.log('我进来了')
    }
    handleSubmit=()=>{
        this.props.handleCancel(this.props.objectType)
    }
    handleCancle=()=>{
        this.props.handleCancel(this.props.objectType)
    }
    render(){
        return(
            <div>
                <Row>
                    <Col span={24} style={{ textAlign: 'center' }}>
                        <Button type="primary" onClick={e => this.handleSubmit(e)} style={{ margin: '0 5px' }}>
                            确定
                        </Button>
                        <Button onClick={e => this.handleCancle(e)} style={{ margin: '0 5px' }}>
                            取消
                        </Button>
                    </Col>
                </Row>
            </div>
        )
    }
}
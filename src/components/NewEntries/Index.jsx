import React from 'react'
import styles from './Index.less'
import BasicEdit from '../BasicTable/BasicEdit'
import { Breadcrumb,Button,DatePicker, Select,Input,Row, Col,Table,Modal } from 'antd';

export default class NewEntries extends React.Component{
    state={
        data:{}
    }
    onChange=(e,i)=>{
        let data = this.state.data
        data[i]=e.target.value
        this.setState({data})
    }
    onSave=()=>{
        this.props.dispatch({type:'table/getDetailChildSave',payload:{data:this.state.data}})
    }
    render(){
        const dataEdit = this.props.columns.map((value,index)=>{
            return <Col span={12} key={index} >
                <span style={{width:'30%'}}>{value.title}</span>
                <Input style={{width:'70%'}} onChange={(e)=>this.onChange(e,value.dataIndex)}/>
            </Col>
        })
        return(
            <div className={styles.NewEntriesMain}>
                <div className="NewEntriesButton">
                    <Button onClick={()=>this.onSave()} style={{marginRight:'10px'}} type='primary'>保存</Button>
                    <Button style={{marginRight:'10px'}} onClick={()=>this.onCancled()}>取消</Button>
                </div>
                <div>
                    <Row>
                        {dataEdit}
                    </Row>
                </div>
            </div>
        )
    }
}
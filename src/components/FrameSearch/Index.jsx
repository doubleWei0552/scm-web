import React from 'react'
import {Card,Icon,Button} from 'antd'
import styles from './Index.less'

export default class FrameSearch extends React.Component{
    state={
        isShrink:true,  //搜索框是否展开，默认展开（true）
    }
    onShrink=()=>{
        this.setState({isShrink:!this.state.isShrink})
    }
    render(){
        return (
            <div>
                <Card title="数据检索" bordered={false} 
                extra={<span onClick={this.onShrink} style={{fontSize:'1.3rem'}}>
                <Icon style={{display:this.state.isShrink ? 'block' : 'none',color:'white' }} type="up-circle" />
                <Icon style={{display:this.state.isShrink ? 'none' : 'block',color:'white' }} type="down-circle" /></span>}
                headStyle={{ background:'#2e80f0',color:'white' }}
                bodyStyle={{border:'1px solid #3e90f0',display:this.state.isShrink ? 'block' : 'none'}}>
                    <div> 
                        <p>数据检索部分</p>
                        <div style={{position:'absolute',bottom:'0',right:'0',marginBottom:'1px'}}> 
                            <Button style={{marginRight:'10px'}} type="primary"><Icon type="search" />搜索</Button>
                            <Button style={{marginRight:'27px'}}><Icon type="reload" />清空</Button>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }
}
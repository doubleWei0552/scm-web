import React from 'react'
import { Table, Divider, Tag,Icon, Button,Modal } from 'antd';
import NewEntries from '../NewEntries/Index'
import style from './TableModule.less'

export default class TableModule extends React.Component{
    static defaultProps = {
        title:'',
        columns : [],
        data : [],
    }

    state={
        disabled:true, //新增条目按钮是否可点击，默认true（不可点击）
        isStatistics:false, //底部的价钱统计模块是否显示，默认false（不显示）
        visible: false //用于控制modal弹框是否弹出
    }
    showModal = () => {
        this.setState({
          visible: true,
        });
      }
    
      handleOk = (e) => {
        this.setState({
          visible: false,
        });
      }
    
      handleCancel = (e) => {
        this.setState({
          visible: false,
        });
      }
    render(){

        return(
            <div className={style.TableModule}>
                <span className={style.HeaderSpan}>{this.props.title}</span>
                <div className={style.Table}>
                    <Table columns={this.props.columns} scroll ={{x:true}} bordered dataSource={this.props.data} pagination={false} />
                    <div style={{display:this.state.isStatistics ? 'block' : 'none'}} className={style.Statistics}>
                        <span>共计：{}笔</span>
                        <span>含税总金额：{}(元)</span>
                    </div>
                </div>
                <Button onClick={this.showModal} className={style.addButton} type={this.state.disabled ? '' : 'primary'} disabled={this.state.disabled}>+新增条目</Button>
                <Modal
                    wrapClassName={style.addModal}
                    // title="Basic Modal"
                    closable={false}
                    footer={null}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    >
                    <NewEntries {...this.props}/>
                </Modal>
            </div>
        )
    }
}
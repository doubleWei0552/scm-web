import React from 'react'
import { TreeSelect } from 'antd';

const treeData = []

export default class TreeSelectCom extends React.Component{
    state = {
        value: undefined,
    };
    
    onChange = value => {
        console.log('value',value)
        this.setState({ value });
    };
    render(){
        return(
            <TreeSelect
                style={{width:'100%'}}
                value={this.props.value}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={this.props.treeData}
                placeholder="请选择数据"
                showCheckedStrategy={this.props.showCheckedStrategy}
                treeCheckable={this.props.treeCheckable}
                // treeDefaultExpandAll
                disabled={this.props.disabled}
                onChange={this.props.onChange}
            />
        )
    }
}
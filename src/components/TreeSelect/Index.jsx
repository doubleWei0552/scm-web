import React from 'react'
import { TreeSelect } from 'antd';

const treeData = []

export default class TreeSelectCom extends React.Component{
    state = {
        value: undefined,
    };
    
    onChange = value => {
        this.setState({ value });
    };
    render(){
        return(
            <TreeSelect
                style={{width:'100%'}}
                allowClear
                defaultValue={this.props.value}
                dropdownStyle={{ maxHeight: 400, overflow: 'hidden' }}
                treeData={this.props.treeData}
                placeholder="请选择数据"
                treeNodeFilterProp={'title'}
                showCheckedStrategy={this.props.showCheckedStrategy}
                treeCheckable={this.props.treeCheckable}
                showSearch={this.props.showSearch}
                disabled={this.props.disabled}
                onChange={this.props.onChange}
            />
        )
    }
}
import React from 'react'
import { TreeSelect } from 'antd';

const treeData = [{
  path: [176383533],
  children: [{
    path: [176383533, 176383697],
    children: [{
      path: [176383533, 176383697, 176383879],
      children: [],
      title: '脸部面膜',
      value: 176383879,
      key: 176383879
    }, {
      path: [176383533, 176383697, 176383931],
      children: [],
      title: '眼部面膜',
      value: 176383931,
      key: 176383931
    }],
    title: '面膜',
    value: 176383697,
    key: 176383697
  }],
  title: '化妆品',
  value: 176383533,
  key: 176383533
}]

export default class TreeSelectCom extends React.Component{
    state = {
        value: undefined,
    };
    
    onChange = value => {
        console.log(value);
        this.setState({ value });
    };
    render(){
        return(
            <TreeSelect
                style={{width:'100%'}}
                defaultValue={this.props.defaultData}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={this.props.treeData}
                placeholder="请选择数据"
                // treeDefaultExpandAll
                disabled={this.props.disabled}
                onChange={this.props.handleImageChange}
            />
        )
    }
}
import React from 'react'
import { TreeSelect } from 'antd';

const treeData = [
    {
      title: 'Node1',
      value: '0-0',
      key: '0-0',
      children: [
        {
          title: 'Child Node1',
          value: '0-0-1',
          key: '0-0-1',
        },
        {
          title: 'Child Node2',
          value: '0-0-2',
          key: '0-0-2',
        },
      ],
    },
    {
      title: 'Node2',
      value: '0-1',
      key: '0-1',
    },
];

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
                style={{ width: 300 }}
                value={this.state.value}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                placeholder="请选择数据"
                treeDefaultExpandAll
                onChange={this.onChange}
            />
        )
    }
}
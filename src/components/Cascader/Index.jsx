import React from 'react'
import provinces from "../../utils/ProvincesData";
import { Cascader } from 'antd'

export default class CascaderCom extends React.Component{
    onChange=(value)=> {
        console.log(value);
    }
    render(){
        const options = provinces
        return(
            <div style={{width:'300px'}}>
                <Cascader style={{width:'100%'}} options={options} onChange={this.onChange} placeholder="请选择城市" />
            </div>
        )
    }
}
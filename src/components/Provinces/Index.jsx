import React from 'react'
import provinces from "../../utils/ProvincesData";
import { Cascader } from 'antd'

export default class ProvincesDate extends React.Component{
    onChange=(value)=> {
        console.log(value);
    }
    render(){
        const options = provinces
        return(
            <div>
                <Cascader style={{minWidth:'200px'}} options={options} onChange={this.onChange} placeholder="请选择城市" />
            </div>
        )
    }
}
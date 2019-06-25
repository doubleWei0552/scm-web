import React from 'react'
import {Icon} from 'antd'

export default class ResultModular extends React.Component{
    render(){
        return(
            <div style={{width:'100%',textAlign:'center',height:'70vh'}}>
                <span style={{display:'block',margin:'3rem 0'}}>
                    {
                        this.props.guidePage.resultPageData.status === 'success' ? 
                        <Icon type="check-circle" theme="filled" style={{fontSize:'10rem',color:'green'}}/>  :
                        <Icon type="close-circle" theme="filled" style={{fontSize:'10rem',color:'#f3a7a1'}}/> 
                    }
                </span>
                <h2>{this.props.guidePage.resultPageData.message}</h2>
            </div>
        )
    }
}
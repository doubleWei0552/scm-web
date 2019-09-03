import React from 'react'
import { Skeleton } from 'antd';

export default class SkeletonCom extends React.Component{
    render(){
        return (
            <div style={{background:'white'}}>
                <div style={{display:'flex',flexDirection:'row',justifyContent:'space-around'}}>
                    <div style={{width:'40%'}}>
                        <Skeleton active loading={this.props.loading || false} />
                        <Skeleton active loading={this.props.loading || false}/>
                    </div>
                    <div style={{width:'40%'}}>
                        <Skeleton active loading={this.props.loading || false}/>
                        <Skeleton active loading={this.props.loading || false}/>
                    </div>
                </div>
                <div style={{margin:this.props.loading || false ? '3rem' : 0}}>
                    <Skeleton active loading={this.props.loading || false}>
                        {this.props.children}
                    </Skeleton>
                    <Skeleton active loading={this.props.loading || false}/>
                </div>
            </div>
        )
    }
}
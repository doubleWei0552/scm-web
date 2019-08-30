import React from 'react'
import { Skeleton } from 'antd';

export default class SkeletonCom extends React.Component{
    render(){
        return (
            <Skeleton active loading={this.props.loading || false}>
                {this.props.children}
            </Skeleton>
        )
    }
}
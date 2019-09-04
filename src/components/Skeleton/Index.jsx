import React from 'react'
import { Skeleton } from 'antd';

export default class SkeletonCom extends React.Component{
    state={
        loading:this.props.loading
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.loading != prevState.loading){
            return {
                loading:nextProps.loading
            }
        } else {
            return null
        }
    }
    render(){
        let { loading } = this.state
        return (
            <div style={{background:'white'}}>
                { this.props.type == 'detailPage' ? 
                <div>
                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-around'}}>
                        <div style={{width:'40%'}}>
                            <Skeleton active loading={loading || false} />
                            <Skeleton active loading={loading || false}/>
                        </div>
                        <div style={{width:'40%'}}>
                            <Skeleton active loading={loading || false}/>
                            <Skeleton active loading={loading || false}/>
                        </div>
                    </div>
                    <div style={{margin:loading || false ? '3rem' : 0}}>
                        <Skeleton active loading={loading || false} />
                        <Skeleton active loading={loading || false} />
                    </div>
                </div>
                 : 
                <div style={{margin:loading || false ? '3rem' : 0}}>
                    <Skeleton active loading={loading || false} />
                    <Skeleton active loading={loading || false}/>
                    <Skeleton active loading={loading || false}/>
                </div>}
            </div>
        )
    }
}
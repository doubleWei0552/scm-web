import React from 'react'
import {Icon,Result,Button,Spin,} from 'antd'
import {connect} from 'dva'

@connect(({ guidePage,loading }) => ({
    guidePage,
    loadingG:
        loading.effects['guidePage/TransactionProcess']
  }))

export default class ResultModular extends React.Component{
    componentDidMount =()=>{
        this.props.closeSpin()
    }
    render(){
        let {status,message,debugInfo} = this.props.guidePage.resultPageData
        return(
            <div>
                <Spin spinning={this.props.loadingG || false}>
                    <Result
                        status={status == 'fail' ? 'error' : status}
                        title={message}
                        // subTitle={debugInfo}
                    />
                </Spin>
            </div>
        )
    }
}
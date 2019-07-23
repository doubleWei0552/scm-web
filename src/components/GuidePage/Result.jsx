import React from 'react'
import {Icon,Result,Button} from 'antd'
import {connect} from 'dva'

@connect(({ guidePage,loading }) => ({
    guidePage,
    loadingG:
        loading.effects['guidePage/getButtonGuideConfig'] ||
        loading.effects['guidePage/getButtonGuideData']
  }))

export default class ResultModular extends React.Component{
    render(){
        let {status,message,debugInfo} = this.props.guidePage.resultPageData
        return(
            <div>
                <Result
                    status={status == 'fail' ? 'error' : status}
                    title={message}
                    subTitle={debugInfo}
                />
            </div>
        )
    }
}
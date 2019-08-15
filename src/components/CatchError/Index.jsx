import React from 'react'
import { connect } from 'dva';

@connect(({ tableTemplate }) => ({
    tableTemplate,
  }))
//组件错误捕捉
export default class CatchError extends React.Component{
    constructor(props){
        super(props)
        this.state={
            error:false
        }
    }
    componentDidMount=()=>{
        let isError = _.get(this.props.tableTemplate,'isError',false)
        if(isError){
            this.setState({
                error:'系统异常，请刷新重试！'
            })
        }
    }
    componentDidCatch(error,info){
        this.setState({
            error:info
        })
    }
    render(){
        if(this.state.error){
            return(
                <div>
                    <h1>抱歉，某些地方好像出错了！！！</h1>
                    <p>
                        <span style={{fontSize:'1.3rem',color:'red'}}>
                            Error:
                        </span>
                        {this.state.error.toString()}
                    </p>
                    <p>
                        请刷新页面重试！！
                    </p>
                </div>
                
            )
        } else {
            return this.props.children
        }
    }
}
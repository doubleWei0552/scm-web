import React from 'react'

//组件错误捕捉
export default class CatchError extends React.Component{
    constructor(props){
        super(props)
        this.state={
            error:false
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
                </div>
                
            )
        } else {
            return this.props.children
        }
    }
}
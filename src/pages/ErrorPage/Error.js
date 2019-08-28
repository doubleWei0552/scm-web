import React from 'react'
import Link from 'umi/link';
import ErrorPage from './ErrorPage.jsx'

//未知错误
export default class UnderfindeError extends React.Component{
    render(){
        return(
            <ErrorPage
                type="underfind"
                desc={'抱歉发生未知错误'}
                linkElement={Link}
                backText={'是否返回首页'}
            />
        )
    }
}
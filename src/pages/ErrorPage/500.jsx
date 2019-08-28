import React from 'react'
import Link from 'umi/link';
import ErrorPage from './ErrorPage.jsx'

export default class NotFound extends React.Component{
    render(){
        return(
            <ErrorPage
                type="500"
                desc={'抱歉服务器出错了'}
                linkElement={Link}
                backText={'返回首页'}
            />
        )
    }
}
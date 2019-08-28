import React from 'react'
import Link from 'umi/link';
import ErrorPage from './ErrorPage.jsx'

export default class NotFound extends React.Component{
    render(){
        return(
            <ErrorPage
                type="404"
                desc={'你访问的页面不存在'}
                linkElement={Link}
                backText={'是否返回首页'}
            />
        )
    }
}
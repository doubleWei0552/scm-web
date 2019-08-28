import React from 'react'
import Link from 'umi/link';
import ErrorPage from './ErrorPage.jsx'

export default class NotFound extends React.Component{
    render(){
        return(
            <ErrorPage
                type="401"
                desc={'你无权访问该页面'}
                linkElement={Link}
                backText={'是否返回首页'}
            />
        )
    }
}
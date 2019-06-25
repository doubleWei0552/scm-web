import React from 'react'
import { Modal, Button } from 'antd';
import FrameSearch from '../FrameSearch/Index'
import FrameTable from '../FrameTable/Index'
import styles from './Index.less'

// 浮框组件
export default class FloatingFrame extends React.Component{
    render(){
      return(
        <div className={styles.frameMain}>
          <div>
            <FrameSearch />
          </div>
          <div style={{marginTop:'1rem'}}>
             <FrameTable />
          </div>
        </div>
      )
    }
}

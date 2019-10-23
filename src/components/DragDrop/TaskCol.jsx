import React from 'react'
import styles from './Index.less'

const STATUS_TODO = 'STATUS_TODO';
const STATUS_DOING = 'STATUS_DOING';
const STATUS_DONE = 'STATUS_DONE';

const STATUS_CODE = {
    STATUS_TODO: '待处理',
    STATUS_DOING: '进行中',
    STATUS_DONE: '已完成'
}

export default class TaskCol extends React.Component{
    state = {
        in: false
    }
    handleDragEnter = (e) => {
        e.preventDefault();
        if (this.props.canDragIn) {
            this.setState({
                in: true
            })
        }
    }
    handleDragLeave = (e) => {
        e.preventDefault();
        if (this.props.canDragIn) {
            this.setState({
                in: false
            })
        }
    }
    handleDrop = (e) => {
        e.preventDefault();
        this.props.dragTo(this.props.status);
        this.setState({
            in: false
        })
    }
    render(){
        let { status, children } = this.props;
        return(
            <div 
                id={`col-${status}`} 
                className={styles.col}
                onDragEnter={this.handleDragEnter}
                onDragLeave={this.handleDragLeave}
                onDragOver={this.handleDragEnter}
                onDrop={this.handleDrop}
                draggable="true"
            >
                <header className={styles['col-header']}>
                    {STATUS_CODE[status]}
                </header>
                <main className={styles['col-main' + (this.state.in ? ' active' : '')]}>
                    {children}
                </main>
            </div>
        )
    }
}
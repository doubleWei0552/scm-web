import react from 'react'
import styles from './Index.less'

export default class TaskItem extends React.Component{
    handleDragStart = (e) => {
        this.props.onDragStart(this.props.id);
    }
    render(){
        let { id, title, point, username, active, onDragEnd } = this.props;
        return (
            <div 
                onDragStart={this.handleDragStart}
                onDragEnd={onDragEnd}
                id={`item-${id}`} 
                className={styles['item' + (active ? ' active' : '')]}
                draggable="true"
            >
                <header className={styles['item-header']}>
                    <span className={styles['item-header-username']}>{username}</span>
                    <span className={styles['item-header-point']}>{point}</span>
                </header>
                <main className={styles['item-main']}>{title}</main>
            </div>
        )
    }
}
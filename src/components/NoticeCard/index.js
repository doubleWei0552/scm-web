import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import { Table, Input, InputNumber, Popconfirm, Form, Tooltip, Icon, Button, Radio, List, Avatar } from 'antd';
import Highlighter from 'react-highlight-words';
import { Resizable } from 'react-resizable';
import NoticeModal from './NoticeModal'
import styles from './index.less';


class IframeCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }


  // 公告详情
  showNoticeDetail = () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    ReactDOM.render(<NoticeModal store={window.g_app._store} title="公告详情" />, div);
  };

  render() {
    const data = [
      {
        title: 'Ant Design Title 1',
      },
      {
        title: 'Ant Design Title 2',
      },
      {
        title: 'Ant Design Title 3',
      },
      {
        title: 'Ant Design Title 4',
      },
      {
        title: 'Ant Design Title 5',
      },
      {
        title: 'Ant Design Title 6',
      },
      {
        title: 'Ant Design Title 7',
      },
      {
        title: 'Ant Design Title 8',
      },
    ];
    return (
      <div className={styles.noticeCard}>
        <header className={styles.header}>
          <h3>公告</h3>
          <div>
            <Button><Icon type="plus" />发布公告</Button>
            <Button>查看更多<Icon type="right" /></Button>
          </div>
        </header>
        <div className="list" style={{ height: '270px' }}>
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
              <List.Item onClick={() => this.showNoticeDetail()} style={{ cursor: 'pointer' }}>
                <List.Item.Meta
                  // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  // title={<a href="https://ant.design">{item.title}</a>}
                  description={<div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{item.title}</span><span><Icon type="clock-circle" /> {moment(_.now()).format('YYYY-MM-DD HH:mm')}</span></div>}
                />

              </List.Item>
            )}
          />
        </div>
      </div>
    );
  }
}


export default IframeCard;
// ReactDOM.render(<EditableFormTable />, mountNode);

import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { Tag, Menu, Icon, Avatar, Tooltip, message, Divider } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import groupBy from 'lodash/groupBy';
import Link from 'umi/link';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import HeaderDropdown from '../HeaderDropdown';
import SelectLang from '../SelectLang';
import UserCenter from './UserCenter';
import styles from './index.less';
import router from 'umi/router';
import { notification } from 'antd';
import noHead from './images/noHead.svg';

@connect(({ login }) => ({
  login,
}))
export default class GlobalHeaderRight extends PureComponent {
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.entries(noticeData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  changeReadState = clickedItem => {
    const { id } = clickedItem;
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeNoticeReadState',
      payload: id,
    });
  };

  //
  changePassword = () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    ReactDom.render(<UserCenter store={window.g_app._store} title="修改密码" />, div);
  };

  onMenuClick = item => {
    const { dispatch } = this.props;
    if (item.key === 'userCenter') {
      this.changePassword();
    } else if (item.key === 'logout') {
      dispatch({
        type: 'login/queryRSLogOut',
        payload: {},
      });
    }
  };

  render() {
    const { fetchingNotices, onNoticeVisibleChange, onNoticeClear, theme } = this.props;
    const currentUser = JSON.parse(localStorage.getItem('userData'));
    const helpLink = localStorage.getItem('helpLink');
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="userName">
          <Icon type="user" />
          {/* <FormattedMessage id="menu.account.center" defaultMessage="account center" /> */}
          <span>{_.get(currentUser, 'username')}</span>
        </Menu.Item>
        <Menu.Item key="userCenter">
          <Icon type="lock" />
          {/* <FormattedMessage id="menu.account.center" defaultMessage="account center" /> */}
          <span>修改密码</span>
        </Menu.Item>
        {/* <Menu.Item key="userinfo">
          <Icon type="setting" />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>
        <Menu.Item key="triggerError">
          <Icon type="close-circle" />
          <FormattedMessage id="menu.account.trigger" defaultMessage="Trigger Error" />
        </Menu.Item>
        <Menu.Divider /> */}
        <Divider style={{ margin: 0 }} />
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        {/* <HeaderSearch
          className={`${styles.action} ${styles.search}`}
          placeholder={formatMessage({ id: 'component.globalHeader.search' })}
          dataSource={[
            formatMessage({ id: 'component.globalHeader.search.example1' }),
            formatMessage({ id: 'component.globalHeader.search.example2' }),
            formatMessage({ id: 'component.globalHeader.search.example3' }),
          ]}
          onSearch={value => {
            console.log('input', value); // eslint-disable-line
          }}
          onPressEnter={value => {
            console.log('enter', value); // eslint-disable-line
          }}
        /> */}
        {/* <Tooltip title={formatMessage({ id: 'component.globalHeader.help' })}>
          <a
            target="_blank"
            href="https://pro.ant.design/docs/getting-started"
            rel="noopener noreferrer"
            className={styles.action}
          >
            <Icon type="question-circle-o" />
          </a>
        </Tooltip> */}

        {/* <NoticeIcon
          className={styles.action}
          count={currentUser.unreadCount}
          onItemClick={(item, tabProps) => {
            console.log(item, tabProps); // eslint-disable-line
            this.changeReadState(item, tabProps);
          }}
          loading={fetchingNotices}
          // locale={{
          //   emptyText: formatMessage({ id: 'component.noticeIcon.empty' }),
          //   clear: formatMessage({ id: 'component.noticeIcon.clear' }),
          //   viewMore: formatMessage({ id: 'component.noticeIcon.view-more' }),
          //   notification: formatMessage({ id: 'component.globalHeader.notification' }),
          //   message: formatMessage({ id: 'component.globalHeader.message' }),
          //   event: formatMessage({ id: 'component.globalHeader.event' }),
          // }}
          onClear={onNoticeClear}
          onPopupVisibleChange={onNoticeVisibleChange}
          onViewMore={() => message.info('Click on view more')}
          clearClose
        >
          <NoticeIcon.Tab
            count={unreadMsg.notification}
            list={noticeData.notification}
            title="通知"
            emptyText={'你已查看所有通知'}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
            showViewMore
          />
          <NoticeIcon.Tab
            count={unreadMsg.message}
            list={noticeData.message}
            title="消息"
            emptyText={'您已读完所有消息'}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            showViewMore
          />
          <NoticeIcon.Tab
            count={unreadMsg.event}
            list={noticeData.event}
            title="待办"
            emptyText={'你已完成所有待办'}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
            showViewMore
          />
        </NoticeIcon> */}

        {helpLink && (
          <a href={helpLink} target="_blank">
            <Tooltip title="使用文档">
              <Icon
                style={{ fontSize: '18px', position: 'relative', top: '2px', cursor: 'pointer' }}
                type="question-circle-o"
              />
            </Tooltip>
          </a>
        )}

        {currentUser && currentUser.staffName && (
          <HeaderDropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={currentUser.avatar || noHead}
                icon="user"
                alt="avatar"
                onClick={() => { router.push('/account/me') }}
              />
              <span className={styles.name}>{currentUser.staffName}</span>
            </span>
          </HeaderDropdown>
        )}
        {/* <SelectLang className={styles.action} /> */}
      </div>
    );
  }
}

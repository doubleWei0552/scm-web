import React, { PureComponent } from 'react';
import { Menu, Icon } from 'antd';
import Link from 'umi/link';
import router from 'umi/router';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';

export default class GlobalHeader extends PureComponent {
  state = {
    moduleOrder: null,
  };
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  componentDidMount() {}

  handleClick = e => {
    localStorage.setItem('menuItem', e.key);
  };
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  getMenuData = id => {
    this.props.dispatch({
      type: 'menu/getSliderData',
      payload: { id },
      callback: menuData => {
        let selectItem = {};
        if (menuData.length > 0) {
          const checkChild = data => {
            if (data.children.length > 0) {
              return checkChild(data.children[0]);
            }
            return data;
          };
          selectItem = checkChild(menuData[0]);

          if (selectItem.path) {
            let path = selectItem.path;
            const index = path.lastIndexOf('?');
            if (index > 0) {
              path = path.substring(0, index) + '/list' + path.substring(index, path.length);
              router.push(path);
            } else {
              router.push(selectItem.path);
            }
          }
          dispatch({
            type: 'tableTemplate/cleanClildData',
          });
          dispatch({
            type: 'tableTemplate/save',
            payload: { defaultActiveKey: '0' },
          });
        }
      },
    });
    localStorage.setItem('menuId', id);
  };
  render() {
    const menuId = localStorage.getItem('menuId');
    const { collapsed, isMobile, logo } = this.props;
    var NavChildren;
    NavChildren = this.props.NavData.map((value, index) => {
      return (
        <Menu.Item key={index} onClick={() => this.getMenuData(value.id)}>
          {value.name}
        </Menu.Item>
      );
    });
    return (
      <div className={styles.header}>
        {isMobile && (
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>
        )}
        <span
          className={styles.trigger}
          onClick={this.toggle}
          style={{ visibility: this.props.hideCollapse ? 'hidden' : 'visible' }}
        >
          <Icon className={styles.triggerIcon} type={collapsed ? 'menu-unfold' : 'menu-fold'} />
        </span>
        <div className={styles.Navigation}>
          <Menu
            onClick={this.handleClick}
            mode="horizontal"
            // defaultSelectedKeys={[localStorage.getItem('menuItem') ? localStorage.getItem('menuItem') : '0']}
          >
            {NavChildren}
          </Menu>
        </div>
        <RightContent {...this.props} />
      </div>
    );
  }
}

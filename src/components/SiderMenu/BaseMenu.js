import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Menu, Icon } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';
import { urlToList } from '../_utils/pathTools';
import { getMenuMatches } from './SiderMenuUtils';
import { isUrl } from '@/utils/utils';
import styles from './index.less';
import moment from 'moment'
import IconFont from '@/components/IconFont';

const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'icon-geren' #For Iconfont ,
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string') {
    if (isUrl(icon)) {
      return <Icon component={() => <img src={icon} alt="icon" className={styles.icon} />} />;
    }
    if (icon.startsWith('icon-')) {
      return <IconFont type={icon} />;
    }
    return <Icon type={icon} />;
  }
  return icon;
};
@connect(({ tableTemplate, loading }) => ({
  tableTemplate,
  loadingG: loading.models.tableTemplate,
}))

export default class BaseMenu extends PureComponent {
  state = {
    selectedKey: this.props.location.pathname, // 选中路径
    openKey: '', // 展开
    showMenuData: this.props.menuData, // 当前的菜单
    current: '',
  };

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  UNSAFE_componentWillReceiveProps(newProps) {
    const { location } = newProps;
    const { pathname = '', search = '' } = location;
    const index = pathname.lastIndexOf("\/list") || pathname.lastIndexOf("\/detail");
    const path = index > 0 ? pathname.substring(0, index) : pathname;
    this.setState({
      current: path,
    });
    if(this.props.menuData != newProps.menuData){
      let id = this.props.location.pathname.split('/')[1] *1
      let pageId = this.props.location.query.PageId *1
      newProps.menuData.map(item => {
        if(item.id == id){
          item.children.map(ii => {
            if(ii.pageId == pageId){
              let newReportUrl = ii.reportUrl + `&userid=${localStorage.getItem('loginData')}`
              this.props.dispatch({
                type:'tableTemplate/save',
                payload:{
                  reportFormURLPage:newReportUrl
                }
              })
            }
          })
        }
      })
    }
  }

  getNavMenuItems = menusData => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => this.getSubMenuOrItem(item))
      .filter(item => item)
  };

  // Get the currently selected menu
  getSelectedMenuKeys = pathname => {
    const { flatMenuKeys } = this.props;
    return urlToList(pathname).map(itemPath => getMenuMatches(flatMenuKeys, itemPath).pop());
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    const { loadingG = false } = this.props
    // doc: add hideChildrenInMenu
    const { name, path } = item;
    const index = path.lastIndexOf("\?");
    const keyPath = index > 0 ? path.substring(0, index) : path;

    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      const { collapsed, loadingG = false } = this.props;
      // const index = path.lastIndexOf("\/list") || path.lastIndexOf("\/detail");
      // const keyPath = index > 0 ? path.substring(0, index) : path;
      return (
        <SubMenu
          title={
            item.menuIcon ? (
              <span>
                {/* {getIcon(item.icon)} */}
                {/* <Icon
                  type={item.menuIcon || "setting"}
                  style={{ fontSize: '1.0rem', marginRight: '10px', color: `${localStorage.getItem('primaryColor')}`, opacity: 0.5 }}
                /> */}
                <i
                  className={`iconfont icon-${item.menuIcon}`}
                  style={{ fontSize: '1.0rem', marginRight: '10px', fontWeight: 'bold', color: `${localStorage.getItem('primaryColor')}`, opacity: 0.5 }}
                ></i>
                {!collapsed && <span>{name}</span>}

                {/* <Icon type="setting" /> */}
              </span>
            ) : (
                name
              )
          }
          key={keyPath}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item disabled={loadingG} onClick={() => this.onMenuClick(item)} key={keyPath} path={path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  // 点击左侧菜单，获取报表路径，并跳转
  onMenuClick = item => {
    this.props.dispatch({
      type:'tableTemplate/save',
      payload:{
        reportFormURLPage:item.reportUrl ? item.reportUrl+`&userid=${localStorage.getItem('loginData')}` : item.reportUrl
      }
    })
    // if(item.reportUrl){
    router.push(item.path)
    // }
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const { name } = item;
    const itemPath = this.conversionPath(item.path);

    const icon = getIcon(item.icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    const { location, isMobile, onCollapse } = this.props;
    return (
      <div>
        {icon}
        <Link style={{ color: 'unset' }} to={itemPath}>
          <span>{name}</span>
        </Link>
      </div>
    );
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  handleClick = e => {
    let path = _.get(e.item.props, 'path');
    if (!path.includes('reportForm')) {
      const index = path.lastIndexOf("\?");
      if (index > 0) {
        path = path.substring(0, index) + '/list' + path.substring(index, path.length)
      }
    }
    const { dispatch } = this.props;
    this.setState({
      current: e.key,
    });
    router.push(path);
    dispatch({
      type: 'tableTemplate/save',
      payload: { defaultActiveKey: '0',isError:false }
    })
  };

  render() {
    const {
      openKeys,
      theme,
      mode,
      location: { pathname },
      className,
      collapsed,
    } = this.props;
    // if pathname can't match, use the nearest parent's key
    // const index = pathname.lastIndexOf("\?");
    // const aa = pathname.substring(0, index);
    let selectedKeys = this.getSelectedMenuKeys(pathname);
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }

    let props = {};
    if (openKeys && !collapsed) {
      props = {
        openKeys: openKeys.length === 0 ? [...selectedKeys] : [...openKeys],
      };
    }
    const { handleOpenChange, style, menuData } = this.props;
    const cls = classNames(className, {
      'top-nav-menu': mode === 'horizontal',
    });
    return (
      <Menu
        key="Menu"
        mode={mode}
        theme={theme}
        onOpenChange={handleOpenChange}
        selectedKeys={[this.state.current]}
        // openKeys={openKeys}
        style={style}
        className={cls}
        onClick={this.handleClick}
        // inlineCollapsed={true}
        {...props}
      >
        {this.getNavMenuItems(menuData)}
      </Menu>
    );
  }
}

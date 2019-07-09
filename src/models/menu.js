import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';
import { menu } from '../defaultSettings';
import { queryNavData, queryMenuData, queryRSLogin } from '@/services/api';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }
      // if enableMenuLocale use item.name,
      // close menu international
      const name = menu.disableLocal
        ? item.name
        : formatMessage({ id: locale, defaultMessage: item.name });
      const result = {
        ...item,
        name,
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'menu',

  state: {
    menuData: [], // 所有的slider
    routerData: [],
    breadcrumbNameMap: {},
    NavData: [], // 顶部Nav数据
    allMenuData: [], // 显示的slider
  },

  effects: {
    *getMenuData({ payload }, { put, select, call }) {
      const userId = localStorage.getItem('loginData');
      const menuId = localStorage.getItem('menuId');
      const params = { userId };
      const result = yield call(queryMenuData, params);
      const NavData = result.data.scmModules;
      const showMenuData = [];
      let id;
      if (payload.id) {
        id = payload.id;
      } else {
        id = menuId;
      }
      const allMenuData = result.data.menuData;
      for (let i = 0; i < allMenuData.length; i++) {
        if (allMenuData[i].moduleId == id) {
          showMenuData.push(allMenuData[i]);
        }
      }
      const menuData = showMenuData;
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(menuData);
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap, NavData, allMenuData },
      });
    },
    *getSliderData({ payload, callback }, { call, select, put }) {
      const NavData = yield select(({ menu }) => menu.NavData);
      const showMenuData = [];
      const { id } = payload;
      const allMenuData = yield select(({ menu }) => menu.allMenuData);
      console.log('allMenudata', allMenuData);
      for (let i = 0; i < allMenuData.length; i++) {
        if (allMenuData[i].moduleId == id) {
          showMenuData.push(allMenuData[i]);
        }
      }
      const menuData = showMenuData;
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(menuData);
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap, NavData },
      });
      if (callback) {
        callback(menuData);
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

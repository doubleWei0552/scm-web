import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import _ from 'lodash';
import { fakeAccountLogin, getFakeCaptcha, queryRSLogin, queryRSLogOut } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

// import router from '@umi/router';
import router from 'umi/router';
import { notification } from 'antd';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const params = {
        username: payload.userName,
        password: payload.password,
      };
      const result = yield call(queryRSLogin, params);
      if (result.status === 'success') {
        const userData = result.data;
        // document.cookie = `ssoSessionId=${_.get(result, 'data.sessionId')}`;
        localStorage.setItem('loginData', result.data.id);
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('sessionId', userData.sessionId);
        router.push('/account/me');
        notification.success({ message: result.message, duration: 3 });
      } else {
        notification.error({ message: result.message, duration: 3 });
      }
    },
    *getLogoParameter({ payload }, { call, put, select }) {
      let params = {};
      const result = yield call(queryLogoParameter);
      localStorage.setItem('loginLogoImg', result.loginLogoImg);
      localStorage.setItem('loginSubTitle', result.loginSubTitle);
      localStorage.setItem('loginMainTitle', result.loginMainTitle);
      localStorage.setItem('mainLogoImg', result.mainLogoImg);
    },

    *queryRSLogOut({ payload }, { call, put }) {
      const result = yield call(queryRSLogOut);
      if (result.status === 'success') {
        router.push('/user/login');
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

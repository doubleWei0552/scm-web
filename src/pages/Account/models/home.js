import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import _ from 'lodash';
import { queryNoticeList, queryNoticeById } from '@/services/home';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

// import router from '@umi/router';
import router from 'umi/router';
import { notification } from 'antd';

export default {
  namespace: 'homePage',

  state: {
    status: undefined,
    noticeData: [],
    noticeObjectType: '',
    noticeDetail: {},
  },

  effects: {
    *queryNoticeList({ payload }, { call, put }) {
      const result = yield call(queryNoticeList, { pageId: 438, pageNum: 1, pageSize: 9999 });
      if (result.status === 'success') {
        yield put({
          type: 'save',
          payload: { noticeData: result.data.list, noticeObjectType: result.data.objectType },
        });
      }
    },
    *queryNoticeById({ payload }, { select, call, put }) {
      const { ID } = payload
      const ObjectType = yield select(({ homePage }) => homePage.noticeObjectType);
      const result = yield call(queryNoticeById, { pageId: 438, ObjectType, ID });
      if (result.status === 'success') {
        console.log('queryNoticeById', result)
        yield put({
          type: 'save',
          payload: { noticeDetail: result.data.policyFormFields },
        });
      }
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

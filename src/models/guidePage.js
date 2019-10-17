import {
  detailButtonGuide,
  queryButtonGuideConfig,
  queryButtonGuideData,
  queryTransactionProcess,
  queryTransactionProcessTest,
  queryGuideBean,
  updateFields,
  queryOpenAccount,
  queryButtonGuideClean,
  queryAutocomplate,
  guideBack,
} from '@/services/api';
import _ from 'lodash';
import { notification } from 'antd';

//导向页
export default {
  namespace: 'guidePage',
  state: {
    guidePageFormData: {}, //导向页展示的form表单的数据
    guidePageColumns: [], //向导页展示的table表头
    guidePageData: [], //向导页展示的table数据

    allGuideData: {}, //展示的所有数据
    sendGuideData: {}, //向后端发送的数据

    resultPageData: {}, //结果页的数据
  },

  effects: {
    // 用于保存要发送后端的数据
    *getSaveData({ payload, callback }, { select, put, call }) {
      console.log('payload',payload)
      let { relatedFieldGroup, data } = payload;
      let sendGuideData = yield select(({ guidePage }) => guidePage.sendGuideData);
      sendGuideData[relatedFieldGroup] = data;
      yield put({
        type: 'save',
        payload: {
          sendGuideData,
        },
      });
    },

    *cleanData({ payload }, { select, put, call }) {
      yield put({
        type: 'save',
        payload: {
          guidePageFormData: {},
          guidePageColumns: [],
          guidePageData: [],
          allGuideData: {},
          sendGuideData: {},
          resultPageData: {},
        },
      });
    },

    *guideBack({ payload, callback }, { select, put, call }) {
      const result = yield call(guideBack, payload);
    },

    //导向页rtlink
    *guideRtlink({ payload, callback }, { select, put, call }) {
      let result = yield call(updateFields, payload);
      if (callback) callback(result.data);
    },

    // --------------------------------old-----------------------------
    *getButtonGuideClean({ payload }, { call, select, put }) {
      yield call(queryButtonGuideClean);
    },
    //获取导向页数据的方法
    *detailButtonGuide({ payload, callback }, { call, select, put }) {
      let allGuideData = yield select(({ guidePage }) => guidePage.allGuideData);
      let params = {
        objectType: payload.OBJECT_TYPE,
        relatedFieldGroup: payload.RELATED_FIELD_GROUP,
        id: payload.id,
      };
      const result = yield call(detailButtonGuide, params);
      if (callback) callback(result.data);
      if (result.status == 'success') {
        allGuideData[result.data.relatedFieldGroup] = result.data;
        yield put({ type: 'save', payload: { allGuideData } });
      } else {
        notification.error({ message: result.message, duration: 3 });
      }
    },
    //获取导向页table类型的表头数据
    *getButtonGuideConfig({ payload, callback }, { call, put, select }) {
      let { OBJECT_TYPE, RELATED_FIELD_GROUP } = payload.params;
      let { id } = payload;
      let params = { objectType: OBJECT_TYPE, relatedFieldGroup: RELATED_FIELD_GROUP, id };
      const result = yield call(queryButtonGuideConfig, params);
      if (callback) callback(result);
      if (result.status == 'success') {
        yield put({ type: 'save', payload: { guidePageColumns: result.data } });
      } else {
        notification.error({ message: result.message, duration: 3 });
      }
    },
    //获取导向页table类型的数据
    *getButtonGuideData({ payload }, { call, put, select }) {
      let { OBJECT_TYPE, RELATED_FIELD_GROUP, METHOD_BODY } = payload.params;
      let { pageNum, pageSize, searchData, id } = payload;
      let formData = yield select(({ guidePage }) => guidePage.sendGuideData);
      for (let gg in searchData) {
        //去除前后的空格
        if (searchData[gg] && typeof searchData[gg] == 'string') {
          searchData[gg] = searchData[gg].replace(/(^\s*)|(\s*$)/g, '');
        }
      }
      let params = {
        objectType: OBJECT_TYPE,
        relatedFieldGroup: RELATED_FIELD_GROUP,
        methodBody: METHOD_BODY,
        pageNum,
        pageSize,
        id,
        ...searchData,
        formData,
      };
      const result = yield call(queryButtonGuideData, params);
      if (result.status == 'success') {
        yield put({ type: 'save', payload: { guidePageData: result.data } });
      } else {
        notification.error({ message:result.message, duration: 3 });
      }
    },
    //导向页下一步额外执行的方法
    *getGuideBean({ payload, callback }, { call, put, select }) {
      let { OBJECT_TYPE, RELATED_FIELD_GROUP, METHOD_BODY } = payload.params;
      let { pageNum, pageSize, searchData, id, AllData } = payload;
      let formData = yield select(({ guidePage }) => guidePage.sendGuideData);
      let params = {
        objectType: OBJECT_TYPE,
        relatedFieldGroup: RELATED_FIELD_GROUP,
        methodBody: METHOD_BODY,
        pageNum,
        AllData,
        id,
        pageSize,
        ...searchData,
        formData,
      };
      const result = yield call(queryGuideBean, params);
      if (result.status == 'success') {
        yield put({ type: 'save', payload: { guidePageData: result.data } });
      } else {
        notification.error({ message: result.message, duration: 3 });
      }
      if (callback) callback(result);
    },
    //提交按钮执行的方法
    *TransactionProcess({ payload, callback }, { call, select, put }) {
      let { params } = payload;
      let result = yield call(queryTransactionProcessTest, params);
      if (result.executeScript) {
        yield put({
          type: 'tableTemplate/save',
          payload: {
            reportFormURL: result.executeScript + `&userid=${localStorage.getItem('loginData')}`,
          },
        });
      }
      if (callback) callback(result);
      yield put({ type: 'save', payload: { resultPageData: result } });
    },
    // 获取下拉数据
    *getAutocomplate({ payload, callback }, { select, call, put }) {
      let result = yield call(queryAutocomplate, payload.value);
      if (callback) callback(result);
    },
    // 开户的rtlink功能
    *openAccountUpdateFields({ payload, callback }, { select, put, call }) {
      let guidePageFormData = yield select(({ guidePage }) => guidePage.guidePageFormData);
      let policyFormFields = guidePageFormData.policyFormFields;
      policyFormFields.map(item => {
        if (item.FIELD_NAME == payload.fieldValues) {
          item.FIELD_VALUE = payload.value;
        }
      });
      let list = {
        list: [
          {
            fieldGroupName: guidePageFormData.relatedFieldGroup,
            objectType: guidePageFormData.tableName,
            policyFormFields: policyFormFields,
            updatedField: payload.fieldValues,
          },
        ],
      };
      let result = yield call(updateFields, list);
      if (callback) callback(result.data);
    },
    // 开户提交的方法
    *getOpenAccount({ payload, callback }, { select, put, call }) {
      let params = {
        id: payload.id,
        userMessage: payload.userMessage,
        objectType: payload.objectType,
        fieldGroup: payload.fieldGroup,
      };
      let result = yield call(queryOpenAccount, params);
      if (callback) callback(result);
      if (result.status == 'success') {
        notification.success({ message: result.message, duration: 3 });
      } else {
        notification.error({ message: '开户失败，请稍后重试！', duration: 3 });
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

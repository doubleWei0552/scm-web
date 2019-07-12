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

    cacheFormData: [], //导向页展示的form表单的缓存数据
    cacheTableData: [], //导向页展示的table表格的缓存数据
    cacheSelectData: [], //向导页选中展示的table缓存数据

    resultPageData: {}, //结果页的数据
  },

  effects: {
    *getButtonGuideClean({payload},{call,select,put}){
      yield call(queryButtonGuideClean)
    },
    //获取导向页数据的方法
    *detailButtonGuide({ payload }, { call, select, put }) {
      let { OBJECT_TYPE, RELATED_FIELD_GROUP,id } = payload.params;
      let params = { objectType: OBJECT_TYPE, relatedFieldGroup: RELATED_FIELD_GROUP,id };
      const result = yield call(detailButtonGuide, params);
      if (result.status == 'success') {
        yield put({ type: 'save', payload: { guidePageFormData: result.data } });
      } else {
        notification.error({ message: '导向页获取数据方法出现错误！', duration: 3 });
      }
    },
    //获取导向页table类型的表头数据
    *getButtonGuideConfig({ payload }, { call, put, select }) {
      let { OBJECT_TYPE, RELATED_FIELD_GROUP } = payload.params;
      let params = { objectType: OBJECT_TYPE, relatedFieldGroup: RELATED_FIELD_GROUP };
      const result = yield call(queryButtonGuideConfig, params);
      if (result.status == 'success') {
        yield put({ type: 'save', payload: { guidePageColumns: result.data } });
      } else {
        notification.error({ message: '导向页table类型获取表头数据方法出现错误！', duration: 3 });
      }
    },
    //导向页下一步额外执行的方法
    *getGuideBean({payload,callback},{call,put,select}){
      let { OBJECT_TYPE, RELATED_FIELD_GROUP, METHOD_BODY } = payload.params;
      let { pageNum, pageSize, searchData, formData = [] } = payload;
      let params = {
        objectType: OBJECT_TYPE,
        relatedFieldGroup: RELATED_FIELD_GROUP,
        methodBody: METHOD_BODY,
        pageNum,
        pageSize,
        ...searchData,
        formData
      };
      const result = yield call(queryGuideBean, params);
      if (result.status == 'success') {
        yield put({ type: 'save', payload: { guidePageData: result.data } });
      } else {
        notification.error({ message: '导向页table类型获取数据方法出现错误！', duration: 3 });
      }
      if (callback) callback(result);
    },
    //获取导向页table类型的数据
    *getButtonGuideData({ payload }, { call, put, select }) {
      let { OBJECT_TYPE, RELATED_FIELD_GROUP, METHOD_BODY } = payload.params;
      let { pageNum, pageSize, searchData, formData = [] } = payload;
      let params = {
        objectType: OBJECT_TYPE,
        relatedFieldGroup: RELATED_FIELD_GROUP,
        methodBody: METHOD_BODY,
        pageNum,
        pageSize,
        ...searchData,
        // formData
      };
      const result = yield call(queryButtonGuideData, params);
      if (result.status == 'success') {
        yield put({ type: 'save', payload: { guidePageData: result.data } });
      } else {
        notification.error({ message: '导向页table类型获取数据方法出现错误！', duration: 3 });
      }
    },
    //提交按钮执行的方法
    *TransactionProcess({ payload, callback }, { call, select, put }) {
      let { params } = payload;
      let result = yield call(queryTransactionProcessTest, params);
      if (callback) callback(result);
      yield put({ type: 'save', payload: { resultPageData: result } });
    },
    // 开户的rtlink功能
    *openAccountUpdateFields({ payload,callback }, { select, put, call }) {
      let guidePageFormData = yield select(({guidePage})=>guidePage.guidePageFormData)
      let policyFormFields = guidePageFormData.policyFormFields
      policyFormFields.map(item => {
        if(item.FIELD_NAME == payload.fieldValues){
          item.FIELD_VALUE = payload.value
        }
      })
      let list = {list:[{
        fieldGroupName:guidePageFormData.relatedFieldGroup,
        objectType:guidePageFormData.tableName,
        policyFormFields:policyFormFields,
        updatedField:payload.fieldValues
      }]}
      let result = yield call(updateFields,list) 
      if(callback) callback (result.data)
    },
    // 开户提交的方法
    *getOpenAccount({ payload,callback }, { select, put, call }) {
      let params = {
        id:payload.id,
        userMessage:payload.userMessage,
        objectType:payload.objectType,
        fieldGroup:payload.fieldGroup,
      }
      let result = yield call(queryOpenAccount,params)
      if(callback) callback(result)
      if(result.status == 'success') {
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

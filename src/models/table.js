import {
  querySummaryPageConfig,
  queryPagelist,
  queryDetailPageConfig,
  queryDetailPage,
  queryRemoveBusiness,
  queryDetailSave,
  queryDetailEdit,
  queryDetailChildSave,
  queryTransactionProcess,
} from '@/services/api';
import { notification } from 'antd';
import router from 'umi/router';

export default {
  namespace: 'table',

  state: {
    selectDate: {}, //跳转时选择的数据
    buttonType: true, //按钮组的样式，true为编辑状态，false为保存状态
    PageStatus: '', //用于保存一开始从哪个页面跳转过来的
    Unicolumns: [], //列表页表头
    UniData: [],
    Detail: [],
    pageId: 28, //当前页面的pageID
    selectDataDelete: [], //用于保存要删除的对象集
    DetailPage: {}, //详情页数据
    Buttons: [], //顶部的button组
  },
  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        //   if(pathname === '/basicData/unitManagement'){
        // dispatch({type:'table/getSummaryPageConfig'})
        //   }
      });
    },
  },
  effects: {
    // 获取table表头数据
    *getSummaryPageConfig({ payload }, { put, call, select }) {
      const pageId = yield select(({ table }) => table.pageId);
      const params = { pageId };
      // const params = {pageId :20}
      const result = yield call(querySummaryPageConfig, params);
      yield put({
        type: 'save',
        payload: { Unicolumns: result.data.columns, Buttons: result.data.buttons },
      });
    },
    // 获取table数据
    *getPagelist({ payload }, { put, call, select }) {
      const pageId = yield select(({ table }) => table.pageId);
      const params = { pageId };
      // const params = {pageId :20}
      const result = yield call(queryPagelist, params);
      yield put({ type: 'save', payload: { UniData: result.data } });
    },
    //获取详情页表头
    *getDetailPageConfig({ payload }, { call, select, put }) {
      const params = yield select(({ table }) => table.pageId);
      // const params
      const result = yield call(queryDetailPageConfig, params);
      yield put({ type: 'save', payload: { Detail: result } });
    },
    //获取详情页数据
    *getDetailPage({ payload }, { call, put, select }) {
      const selectDate = yield select(({ table }) => table.selectDate);
      const pageId = yield select(({ table }) => table.pageId);
      var params;
      // if(payload.ID){
      //   params = {
      //     ID: payload.ID,
      //     ObjectType: payload.ObjectType,
      //     pageId
      //   }
      // }else{
      params = {
        ID: selectDate.ID,
        ObjectType: selectDate.ObjectType,
        pageId,
      };
      // }
      console.log(params);
      const result = yield call(queryDetailPage, params);
      console.log(result);
      yield put({ type: 'save', payload: { DetailPage: result } });
    },
    //详情页数据保存
    *getDetailSave({ payload }, { call, put, select }) {
      var params;
      // payload.record 判断是否存在是从子表的child中传过来的
      if (payload.record) {
        params = payload.record;
        let result = yield call(queryDetailEdit, params);
        console.log(result);
      } else {
        const selectDate = yield select(({ table }) => table.selectDate);
        const Detail = yield select(({ table }) => table.Detail);
        const state = payload.state;
        const fields = Detail.data.fields;
        const DetailPage = yield select(({ table }) => table.DetailPage);
        console.log(selectDate, Detail, state, fields, DetailPage);
        if (selectDate.length != 0) {
          DetailPage.data.policyFormFields.map((value, index) => {
            value.FIELD_VALUE = state[value.LABEL];
          });
          params = DetailPage.data;
        } else {
          for (let i in state) {
            fields.map((value, index) => {
              if (value.value == i) {
                value.FIELD_VALUE = state[i];
                value.thisComponentUid = null;
                value.objectType = Detail.data.objectType;
              }
            });
          }
          params = Detail.data;
        }
        console.log(params);
        if (selectDate.length != 0) {
          let result = yield call(queryDetailEdit, params);
          notification.success({ message: '数据修改成功!', duration: 3 });
        } else {
          let result = yield call(queryDetailSave, params);
          if (result.status == 'success') {
            notification.success({ message: '数据新增成功!', duration: 3 });
            yield put({ type: 'getPagelist', payload: { pageId } });
          } else {
            notification.error({ message: '数据新增失败!', duration: 3 });
            yield put({ type: 'getPagelist', payload: { pageId } });
          }
        }
      }
    },
    //删除数据方法
    *getRemoveBusiness({ payload }, { call, select, put }) {
      console.log('delete');
      var selectDataDelete = [];
      if (payload) {
        selectDataDelete.push(payload.selectDate);
      } else {
        selectDataDelete = yield select(({ table }) => table.selectDataDelete);
      }
      console.log(selectDataDelete);
      // const selectDataDelete = yield select(({table}) =>table.selectDataDelete)
      const DetailPage = yield select(({ table }) => table.DetailPage);
      const pageId = yield select(({ table }) => table.pageId);
      let businessId = [];
      console.log(selectDataDelete, DetailPage, pageId);
      selectDataDelete.map((value, index) => {
        businessId.push(value.ID);
      });
      let params = {
        data: {
          pageId,
          businessId,
        },
      };
      const result = yield call(queryRemoveBusiness, params);
      console.log(result);
      if (result.status == 'success') {
        notification.success({ message: '数据删除成功!', duration: 3 });
        yield put({ type: 'getPagelist', payload: { pageId } });
      } else {
        notification.error({ message: '数据删除失败!', duration: 3 });
      }
    },
    //子表数据保存
    *getDetailChildSave({ payload }, { select, call, put }) {
      const params = payload.data;
      const ObjectType = yield select(({ table }) => table.Detail.data.child[0].objectType);
      params.objectType = ObjectType;
      params.PARENT_ID = yield select(({ table }) => table.DetailPage.data.thisComponentUid);
      const result = yield call(queryDetailChildSave, params);
      console.log(result);
    },
    //按钮的执行方法
    *getTransactionProcess({ payload }, { select, call, put }) {
      console.log(payload);
      const selectDataDelete = yield select(({ table }) => table.selectDataDelete);
      const objectType = yield select(({ table }) => table.Detail.data.objectType);
      const ButtonName = payload.ButtonName.name;
      const ButtonID = payload.ButtonName.id;
      const params = { selectDataDelete, ButtonName, objectType, selectDataId: ButtonID };
      console.log(params);
      const result = yield call(queryTransactionProcess, params);
      console.log(result);
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

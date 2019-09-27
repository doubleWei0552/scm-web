import { 
  queryDetailChildPage,
  queryDetailPage,
  queryDetailPageConfig,
  queryRemoveBusiness,
  queryTransactionProcess,
  queryDetailEdit,
  queryDetailSave,
  detailPage,
  childUpdateFields,
} from '@/services/api';
import _ from 'lodash';
import router from 'umi/router'
import { notification } from 'antd';
import moment from 'moment'

export default {
  namespace: 'detailPage', //详情页model

  state: {
    detailColumns:[] , //详情页表头方法返回的所有数据
    detailData: [], // 详情页数据方法返回的所有数据
    DetailChildData: {}, // 所有的子表数据
    selectChildOption: [], // 子表下拉显示的数据

    defaultActiveKey: '0', // 子表tab选择的key
    //子表重构版本
    ChildData: [], //所有子表对应的数据
    editChildData:[], //编辑的子表
    saveChildData:[], //新增的子表
  },

  effects: {
    // 改变状态
    *changeState({ payload }, { put, call, select }) {
        yield put({
          type: 'save',
          payload: {
            ...payload
          },
        });
    },
    // 获取详情页表头
    *getDetailPageConfig({ payload,callback }, { call, select, put }) {
      const result = yield call(queryDetailPageConfig, payload);
      if(callback) callback (result)
      if (result.status == 'success') {
        yield put({
          type: 'save',
          payload: { detailColumns: result.data },
        });
      } else {
        notification.error({ message: result.message, duration: 3 });
      }
    },
    // 获取详情页数据
    *getDetailPage({ payload,callback }, { call, select, put }) {
      const result = yield call(queryDetailPage, payload)
      if(callback) callback (result)
      if (result.status == 'success') {
        yield put({
          type: 'save',
          payload: { detailData: result.data },
        });
        // 如果正确返回，则获取子表数据
        const childParams = {
          pageId: payload.pageId,
          thisComponentUid: result.data.thisComponentUid,
        };
        const detailColumns = yield select(({ detailPage }) => detailPage.detailColumns)
        const childResult = yield call(queryDetailChildPage, childParams)
        const DetailChildData = childResult.data
        const childAllData = [];
        detailColumns.child.map((value, index) => {
          // 循环表头，value某个子表的表头
          DetailChildData.child.map((i, j) => {
            // 循环数据，i某个子表的数据
            const childData = {};
            if (value.fieldGroupName == i.fieldGroupName) {
              childData.Columns = value;
              childData.Data = i;
              childData.objectType = value.objectType;
              childAllData.push(childData)
            }
          });
        });
        yield put({ type: 'save', payload: { ChildData: childAllData,DetailChildData: childResult.data } });
        if (callback) callback(childResult);
      } else {
        notification.error({ message: result.message, duration: 3 });
      }
    },
    // 删除数据方法
    *getRemoveBusiness({ payload, callback }, { call, select, put }){
      let pageId = yield select(({ listPage }) => listPage.pageId);
      let result = yield call(queryRemoveBusiness,payload)
      if (callback) callback(result);
      if (result.status == 'success') {
        if (result.message) {
          notification.success({ message: result.message, duration: 3 });
        }
        yield put({ type: 'getPagelist', payload: { pageId } });
      } else {
        notification.error({ message: result.message, duration: 3 });
      }
    },
    //详情页按钮执行方法
    *getTransactionProcess({payload,callback},{call,select,put}){
      let params = {
        selectDataId: payload.selectDate,
        ButtonName:payload.Buttons.FIELD_NAME,
        objectType:payload.objectType,
        pageId : payload.PageId*1,
      };
      let result = yield call(queryTransactionProcess,params)
      if (result.status == 'success') {
        if (result.message) {
          notification.success({ message: result.message, duration: 3 });
        }
        yield put({ type: 'getPagelist', payload: { pageId } });
      } else {
        notification.error({ message: result.message, duration: 3 });
      }
    },
    // 详情页编辑保存
    *getDetailEdit({payload,callback},{call,put,select}){
      const detailData = yield select(({ detailPage }) => detailPage.detailData);
      const ChildData = yield select(({ detailPage }) => detailPage.ChildData);
      let params = {
        policyFormFields : payload.value,
        fieldGroupName:detailData.fieldGroupName,
        objectType:detailData.objectType,
        thisComponentUid:detailData.thisComponentUid,
      }
      const child = []; // 存放新版的子表修改数据
      ChildData.map(value => {
          value.Data.records.map(i => {
            child.push(i);
          });
      });
      params.child = child
      const result = yield call(queryDetailEdit, params);
      if (result.status == 'success') {
        if (result.message) {
          notification.success({ message: result.message, duration: 3 });
        }
        let newPathName = payload.pathname.replace(/detail/g,`detailSee`) + payload.search
        router.push(newPathName)
      } else {
        notification.error({ message: result.message, duration: 3 });
      }
    },
    // 数据新增
    *getDetailSave({ payload, callback }, { call, put, select }) {
      const detailData = yield select(({ detailPage }) => detailPage.detailData);
      const ChildData = yield select(({ detailPage }) => detailPage.ChildData);
      let params = {
        policyFormFields : payload.value,
        fieldGroupName:detailData.fieldGroupName,
        objectType:detailData.objectType,
        thisComponentUid:detailData.thisComponentUid,
      }
      const child = []; // 存放新版的子表修改数据
      ChildData.map(value => {
          value.Data.records.map(i => {
            child.push(i);
          });
      });
      params.child = child
      const result = yield call(queryDetailSave, params);
      if (result.status == 'success') {
        if (result.message) {
          notification.success({ message: result.message, duration: 3 });
        }
        let newPathName = payload.pathname.replace(/add/g,`detailSee/${result.data.ID}`) + payload.search
        router.push(newPathName)
      } else {
        notification.error({ message: result.message, duration: 3 });
      }
    },
    // 主表的rtlink功能
    *updateFields({ payload, callback }, { call, put, select }) {
      const { updatedField, objectType, params, value } = payload;
      const detailData = yield select(({ detailPage }) => detailPage.detailData);
      detailData.policyFormFields.map((val, index) => {
        // if(editValue){
        // 判断是否修改和用户是否选择清空选项，如果修改了，就赋值，没有修改不变,注：null == undefined,区分他们要用 ===
        if (params[val.FIELD_NAME]) {
          val.FIELD_VALUE = params[val.FIELD_NAME];
          if(val.WIDGET_TYPE == 'Date' || val.WIDGET_TYPE == 'DateTime'){
            val.FIELD_VALUE = moment(params[val.FIELD_NAME]).valueOf()
          } else {
            val.FIELD_VALUE = params[val.FIELD_NAME];
          }
        } else if (params[val.FIELD_NAME] === null && params[val.FIELD_NAME] !== undefined) {
          val.FIELD_VALUE = null;
        }
      });

      const postData = {
        list: [
          {
            updatedField,
            objectType,
            policyFormFields: detailData.policyFormFields,
            fieldGroupName: detailData.fieldGroupName,
          },
        ],
      };
      const result = yield call(updateFields, postData);
      if (result.data[0].fieldChanges.length) {
        _.map(result.data[0].fieldChanges, item => {
          const index = _.findIndex(
            detailData.policyFormFields,
            data => item.field === data.FIELD_NAME
          );
          if (index > -1) {
            _.map(item.changes, c => {
              detailData.policyFormFields[index][c.field] = c.value;
            });
          }
        });
      }
      yield put({ type: 'save', payload: { detailData } });
      if (result.status === 'success' && result.data[0].fieldChanges.length && callback) {
        callback(result.data[0].fieldChanges);
      }
    },


    //-----------------------------子表部分----------------------------------//
    // 删除子表数据
    *getRemoveChildData({ payload, callback }, { select, call, put }) {
      //objectType代表要删除的子表的数据的objectType，selectDataObjectType表示当前选中的数据的objectType
      let { id, objectType,selectDataID,pageId,selectDataObjectType } = payload
      const params = {
        param: { businessId: [id], objectType: objectType, pageId },
      };
      const result = yield call(queryRemoveBusiness, params);
      if (result.status == 'success') {
        if (result.message) {
          notification.success({ message: result.message, duration: 3 });
        }
        yield put({ type: 'getPagelist', payload: { pageId } });
        if (id) {
          yield put({
            type:'getChildData',
            payload:{
              pageId,thisComponentUid:selectDataID
            }
          })
          // 用于区分是否是保存的数据删除还是新增的缓存数据删除
          // yield put({
          //   type: 'getDetailPage',
          //   payload: {
          //     ID: selectDataID,
          //     pageId,
          //     ObjectType: selectDataObjectType,
          //     type: 'deleteChild',
          //     params,
          //   },
          // });
        }
      } else {
        notification.error({ message: result.message, duration: 3 });
      }
    },
    //获取子表数据，用于删除子表数据后重新获取数据
    *getChildData({payload,callback},{select,put,call}){
      const detailColumns = yield select(({ detailPage }) => detailPage.detailColumns)
      // payload:{  数据格式
      //   pageId,
      //   thisComponentUid
      // }
      const childResult = yield call(queryDetailChildPage, payload)
      const DetailChildData = childResult.data
      const childAllData = [];
      detailColumns.child.map((value, index) => {
        // 循环表头，value某个子表的表头
        DetailChildData.child.map((i, j) => {
          // 循环数据，i某个子表的数据
          const childData = {};
          if (value.fieldGroupName == i.fieldGroupName) {
            childData.Columns = value;
            childData.Data = i;
            childAllData.push(childData);
          }
        });
      });
      yield put({ type: 'save', payload: { ChildData: childAllData,DetailChildData: childResult.data } });
      if (callback) callback(childResult);
    },
    // 子表数据保存
    *getDetailChildSave({ payload }, { select, call, put }) {
      const params = payload.data;
      const ObjectType = yield select(
        ({ tableTemplate }) => tableTemplate.Detail.data.child[0].objectType
      );
      params.objectType = ObjectType;
      params.PARENT_ID = yield select(
        ({ tableTemplate }) => tableTemplate.DetailPage.data.thisComponentUid
      );
      const result = yield call(queryDetailChildSave, params);
    },
    // 子表的rtlink功能
    *childUpdateFields({ payload, callback }, { select, put, call }) {
      const ChildData = yield select(({ detailPage }) => detailPage.ChildData);
      const { params } = payload;
      const { list = [] } = params;
      if (list.length > 0) {
        yield put({ type: 'save', payload: { isChildAdd: true } });
      }
      let MasterTables = payload.params.MasterTable
      for(let i in MasterTables){
        if(typeof(MasterTables[i]) == 'object' && MasterTables[i] != null){
          MasterTables[i] = moment(MasterTables[i]).valueOf()
        }
      }
      params.parentPolicyFormFields = MasterTables
      const result = yield call(childUpdateFields, params);
      // rtlink 添加警告
      result.data.map((item, index) => {
        item.fieldChanges.map((j, k) => {
          if (j.warningMessage) {
            notification.warning({ message: j.warningMessage, duration: 3 });
          }
        });
      });
      if (result.status == 'success') {
        ChildData.map(i => {
          // 子表数据循环 i-子表数据
          const { objectType } = i.Data;
          result.data.map(n => {
            // 子表联动字段循环数据 n-子表新增的一行数据数据
            if (n.objectType == objectType) {
              i.Data.records.map(j => {
                if (j[0].key == n.identifierKey || j[0].identifier == n.identifier) {
                  n.fieldChanges.map(z => {
                    j.map(y => {
                      if (z.field == y.FIELD_NAME) {
                        z.changes.map(a => {
                          y[a.field] = a.value;
                        });
                      }
                    });
                  });
                }
              });
            }
          });
        });
      } else {
        notification.error({ message: result.message, duration: 3 });
      }
      yield put({ type: 'save', payload: { ChildData } });
      if (callback) callback(result);
    },
    // 子表新增弹框表格表头
    *getDetailListConfig({ payload }, { select, put, call }) {
      const { multiGroupName, multiObjectType } = payload;
      const params = {
        summaryFieldGroupName: multiGroupName,
        objectType: multiObjectType,
      };
      const result = yield call(queryDetailListConfig, params);
      yield put({ type: 'save', payload: { frameColumns: result.data } });
    },
    // 子表新增弹框表格数据
    *getDetailList({ payload }, { select, put, call }) {
      const {
        multiGroupName,
        multiObjectType,
        pageSize,
        pageNum,
        current,
        searchParams,
        MasterTableID,
        ChildTableData,
        ChildObject,
      } = payload;
      for(let gg in searchParams){  //去除前后的空格
        if(searchParams[gg] && typeof(searchParams[gg]) == 'string'){
          searchParams[gg] = searchParams[gg].replace(/(^\s*)|(\s*$)/g, "")
        }
      }
      const params = {
        summaryFieldGroupName: multiGroupName,
        objectType: multiObjectType,
        pageSize,
        pageNum: pageNum || current,
        MasterTableID,
        ChildTableData,
        ChildObject,
        ...searchParams,
      };
      const result = yield call(queryDetailList, params);
      yield put({ type: 'save', payload: { framePagination: result.data } });
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
}

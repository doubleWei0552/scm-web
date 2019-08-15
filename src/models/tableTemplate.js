import {
  querySummaryPageConfig,
  queryPagelist,
  queryDetailPageConfig,
  queryDetailPage,
  queryRemoveBusiness,
  queryTableDelete,
  queryDetailSave,
  queryDetailEdit,
  queryDetailChildSave,
  queryTransactionProcess,
  queryPagination,
  queryAutocomplate,
  queryDetailChildPage,
  updateFields,
  childUpdateFields,
  queryDetailListConfig,
  queryDetailList,
  fileUpdate,
  queryOpenAccount,
} from '@/services/api';
import _ from 'lodash';
import { notification } from 'antd';
import moment from 'moment'
import {onGetImageUrl} from '@/utils/FunctionSet'

export default {
  namespace: 'tableTemplate',

  state: {
    pageId: null, // 当前页面的pageID
    tableColumns: [], // 列表页表头
    tableColumnsData: {}, // 列表页表头数据
    tableData: [], // 列表页数据
    detailColumns: [], // 详情页表头
    detailData: [], // 详情页数据
    MainTableData:[], //主表最新的数据（用于子表的rtlink联动）
    DetailChildData: {}, // 子表数据
    initDetailChildData: {}, // 刚进入详情页面时的子表数据
    initPolicyFormFields: [], // 刚进入详情页时的主表数据
    ChildData: [], // 子表展示数据

    selectDate: {}, // 跳转时选择的数据
    selectDataDelete: [], // 选择要删除的数据

    selectOption: [], // 下拉框显示的数据
    selectChildOption: [], // 子表下拉显示的数据
    pagination: {}, // 请求的分页数据,列表页数据以此为准
    framePagination: {}, // 弹框显示的数据，子表新增弹框以此为准

    ID: null, // 新增数据的id
    objectType: null, // 新增数据的objectType

    child: [], // 子表修改的数据
    Data: [], // 子表的数据
    currentKey: '', // 搜索栏下拉框查询需要的key
    childChanged: [], // 子表修改的数据，待发送到后台

    frameColumns: [], // 子表弹框的表格表头
    frameData: [], // 子表弹框的表格数据

    reportFormURL: null, // 报表的url地址
    defaultActiveKey: '0', // 子表tab选择的key

    fileList: [], // 主表图片组件显示的数据
    fileKey: '', // 对应主表的图片的detailpage里面的元素的FIELD_NAME值
    isChildAdd: false, // 是否有子表新增

    MasterTable:{}, //主表的数据，用于新增时的rtlink联动
    // ------------------------------------------------
    isEdit: false, // 判断是不是详情页，默认不是详情页false
    isError: false , //用于判断系统是否报错
    buttonType: false, // 详情页的按钮格式,false表示只有保存，取消按钮
    isNewSave: false, // 判断是不是列表页的新增，默认为false 不是
    disEditStyle: true, // 默认都不可编辑
    searchParams: {}, // 列表页的查询参数 
    selectedRowKeys: [], // 选择的那个表格行数据
    pageSize: 10,
    isEditSave: false, //判断是不是详情页的新增，默认是false 不是
    isOperate: false, //用于记录取消时，用户有没有进行过操作，默认没有操作（fasle）

    sorterData: {}, //用于记录列表排序
    summarySort: null,
    // ------------------------------------------------
  },
  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => { });
    },
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
    // 获取列表页表头数据
    *getSummaryPageConfig({ payload,callback }, { put, call, select }) {
      const pageId = yield select(({ tableTemplate }) => tableTemplate.pageId);
      const params = { pageId };
      const result = yield call(querySummaryPageConfig, params);
      if(callback) callback (result)
      if (result.status == 'success') {
        yield put({
          type: 'save',
          payload: {
            tableColumns: result.data.columns,
            currentKey: result.data.key,
            tableColumnsData: result.data,
          },
        });
      } else {
        notification.error({ message: result.message, duration: 3 });
      }
    },
    // 获取列表页数据
    *getPagelist({ payload, callback }, { put, call, select }) {
      const pageId = yield select(({ tableTemplate }) => tableTemplate.pageId);
      const pagination = yield select(({ tableTemplate }) => tableTemplate.pagination);
      const { pageSize = 10 } = yield select(({ tableTemplate }) => tableTemplate.pagination);
      const { searchParams } = yield select(({ tableTemplate }) => tableTemplate);
      const params = { pageId, pageSize, pageNum: pagination.currentPage, ...searchParams };
      const result = yield call(queryPagelist, params);
      if (result.status == 'success') {
        yield put({ type: 'save', payload: { pagination: result.data } });
      } else {
        notification.error({ message: result.message, duration: 3 });
      }
      if (callback) callback(result);
    },
    // 获取详情页表头
    *getDetailPageConfig({ payload,callback }, { call, select, put }) {
      const pageId = yield select(({ tableTemplate }) => tableTemplate.pageId);
      const params = { pageId };
      const result = yield call(queryDetailPageConfig, params);
      if(callback) callback (result)
      if (result.status == 'success') {
        yield put({
          type: 'save',
          payload: { detailColumns: result.data, objectType: result.data.objectType },
        });
      } else {
        yield put({
          type:'save',
          payload:{isError:true}
        })
        notification.error({ message: result.message, duration: 3 });
      }
    },
    // 获取详情页数据(已废弃，保存还在用)
    *getDetailPage({ payload, callback }, { call, put, select }) {
      const { type } = payload; // 判断是不是点击子表删除进来的刷新页面
      const deleteParams = payload.params; // 子表删除时指定删除的数据参数
      // ------判断子表删除的参数 ⬆️------
      let params;
      if (payload.ID) {
        params = {
          ID: payload.ID,
          ObjectType: payload.ObjectType
            ? payload.ObjectType
            : yield select(({ tableTemplate }) => tableTemplate.objectType),
          pageId: payload.pageId,
        };
      } else {
        params = {
          ObjectType: payload.ObjectType
            ? payload.ObjectType
            : yield select(({ tableTemplate }) => tableTemplate.objectType),
          pageId: payload.pageId,
        };
      }
      const result = yield call(queryDetailPage, params);
      if(callback) callback (result)
      yield put({ type: 'save', payload: { detailData: result.data, initPolicyFormFields: result.data.policyFormFields } });
      // 区分是否是新增的情况
      if (result.status == 'success') {
        // 如果正确返回，则获取子表数据
        const childParams = {
          pageId: payload.pageId,
          thisComponentUid: result.data.thisComponentUid,
        };
        // if (result.data.thisComponentUid == null) return; // 新增没有thisCompnentUid
        const childResult = yield call(queryDetailChildPage, childParams);
        const initDetailChildData = yield select(({ tableTemplate }) => tableTemplate.initDetailChildData);
        if (_.isEmpty(initDetailChildData)) {
          yield put({ type: 'save', payload: { DetailChildData: childResult.data, initDetailChildData: childResult.data } });
        } else {
          yield put({ type: 'save', payload: { DetailChildData: childResult.data, initDetailChildData: childResult.data } });
        }
        if (type == 'deleteChild') {
          // 获取子表数据，通过type判断是不是删除调用的刷新数据方法
          const ChildData = yield select(({ tableTemplate }) => tableTemplate.ChildData);
          ChildData.map(value => {
            if (value.Data.objectType == deleteParams.param.objectType) {
              const deleteChildId = deleteParams.param.businessId[0]; // 要删除的子对象
              let deleteChildIndex;
              value.Data.records.map((i, index) => {
                if (i[0].id == deleteChildId) {
                  deleteChildIndex = index;
                }
              });
              value.Data.records.splice(deleteChildIndex, 1);
            }
          });
        } else {
          yield put({ type: 'getChildTable' });
        }
        if (callback) callback(childResult);
      } else {
        yield put({ type: 'save', payload: { detailData: [], initPolicyFormFields: [],isError:true } });
        notification.error({ message: result.message, duration: 3 });
      }
    },
    // 获取子表数据
    *getChildTable({ payload }, { select, put, call }) {
      const detailColumns = yield select(({ tableTemplate }) => tableTemplate.detailColumns);
      const DetailChildData = yield select(({ tableTemplate }) => tableTemplate.DetailChildData);
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
      yield put({ type: 'save', payload: { ChildData: childAllData } });
    },

    // 清空子表数据
    *cleanClildData({ payload, callback }, { call, put, select }) {
      yield put({ type: 'save', payload: { ChildData: [], reportFormURL: null } });
    },
    // 详情页数据保存
    *getDetailSave({ payload, callback }, { call, put, select }) {
      const detailColumns = yield select(({ tableTemplate }) => tableTemplate.detailColumns);
      const detailData = yield select(({ tableTemplate }) => tableTemplate.detailData);
      const pageId = yield select(({ tableTemplate }) => tableTemplate.pageId);
      const DetailChildData = yield select(({ tableTemplate }) => tableTemplate.DetailChildData);
      const ChildData = yield select(({ tableTemplate }) => tableTemplate.ChildData);
      const pagination = yield select(({ tableTemplate }) => tableTemplate.pagination);
      const editValue = payload.value; // 编辑传过来的值
      if (payload.type == 'edit') {
        let params;
        // console.log(detailData.policyFormFields, editValue)
        const child = []; // 存放新版的子表修改数据
        ChildData.map(value => {
          value.Data.records.map(i => {
            child.push(i);
          });
        });
        detailData.policyFormFields.map((value, index) => {
          // if(editValue){
          // 判断是否修改和用户是否选择清空选项，如果修改了，就赋值，没有修改不变,注：null == undefined,区分他们要用 ===
          if (editValue[value.FIELD_NAME] !== undefined) {
            value.FIELD_VALUE = editValue[value.FIELD_NAME];
          } else if (
            editValue[value.FIELD_NAME] === null ||
            editValue[value.FIELD_NAME] === undefined
          ) {
            value.FIELD_VALUE = null;
          }
          // detailData.child = payload.child; //旧版的
          detailData.child = child;
          params = detailData;
        });
        params.policyFormFields.map(item=>{
          if(item.WIDGET_TYPE == "Image" || item.WIDGET_TYPE == "Attachment"){
            item.FIELD_VALUE.map(ii=>{
              if(ii.url){
                if(ii.url.includes('http:')){
                  let str = ii.url.match(/:(\S*)/)[1];
                  let lastStr = str.match(/:(\S*)/)[1];
                  ii.url = `:${lastStr}`
                }
              }
            })
          }
        })
        const result = yield call(queryDetailEdit, params);
        if (callback) callback(result);
        if (result.status == 'success') {
          // 用最新的值替换selectDate，确保数据永远是最新的，不会出错
          // if (result.message) {
          //   notification.success({ message: result.message, duration: 3 });
          // }
          let selectDate;
          let objectType = pagination.objectType;
          pagination.list.map((value, index) => {
            if (value.ID == result.data.thisComponentUid) {
              selectDate = value;
            }
          });
          yield put({ type: 'save', payload: { selectDate, objectType,isNewSave:false,isEditSave:false } });
          yield put({
            type: 'getDetailPage',
            payload: { ID: selectDate.ID, pageId, ObjectType: objectType },
          });
          yield put({ type: 'getPagelist', payload: { pageId },callback:res=>{
            if(res.status == 'success' && result.message){
              notification.success({ message: result.message, duration: 3 });
            }
          } });
        } else {
          notification.error({ message: result.message, duration: 3 });
        }
      } else if (payload.type == 'save') {
        let params;
        const child = []; // 存放新版的子表修改数据
        ChildData.map(value => {
          value.Data.records.map(i => {
            child.push(i);
          });
        });
        detailData.policyFormFields.map((value, index) => {
          // if(editValue){
          // 判断是否修改和用户是否选择清空选项，如果修改了，就赋值，没有修改不变,注：null == undefined,区分他们要用 ===
          if (editValue[value.FIELD_NAME] !== undefined) {
            value.FIELD_VALUE = editValue[value.FIELD_NAME];
          } else if (
            editValue[value.FIELD_NAME] === null ||
            editValue[value.FIELD_NAME] === undefined
          ) {
            value.FIELD_VALUE = null;
          }
          // detailData.child = payload.child; //旧版的
          detailData.child = child;
          params = detailData;
        });
        // detailData.child = payload.child;
        detailData.child = child;
        params = detailData;
        const result = yield call(queryDetailSave, params);
        if (callback) callback(result);
        if (result.status == 'success') {
          yield put({ type: 'getPagelist', payload: { pageId } });
          yield put({
            type: 'getDetailPage',
            payload: { ID: result.data.ID, pageId, ObjectType: result.data.ObjectType },
          });
          yield put({
            type: 'save',
            payload: { selectDate: result.data, objectType: result.data.ObjectType,isNewSave:false,isEditSave:false },
          });
          if (result.message) {
            notification.success({ message: result.message, duration: 3 });
          }
        } else {
          notification.error({ message: result.message, duration: 3 });
        }
        yield put({
          type: 'save',
          payload: { ID: result.data.ID, objectType: result.data.ObjectType },
        });
      }
      yield put({type:'save'})
    },

    // 删除数据方法
    *getRemoveBusiness({ payload, callback }, { call, select, put }) {
      const pageId = yield select(({ tableTemplate }) => tableTemplate.pageId);
      const selectedRowKeys = yield select(({ tableTemplate }) => tableTemplate.selectedRowKeys);
      const selectDate = yield select(({ tableTemplate }) => tableTemplate.selectDate);
      const pagination = yield select(({ tableTemplate }) => tableTemplate.pagination);
      const businessId = [];
      let params;
      if (payload) {
        businessId.push(payload.businessId);
        params = {
          param: {
            pageId,
            businessId,
            objectType: pagination.objectType,
            // selectDataDelete.length == 0 ? selectDate.ObjectType : selectDataDelete[0].ObjectType,
          },
        };
      } else {
        // 列表页删除
        selectedRowKeys.map((value, index) => {
          businessId.push(value);
        });
        if (businessId.length == 0) {
          notification.warning({ message: '未选择要删除的数据,操作不成功！', duration: 3 });
          return false;
        }
        params = {
          param: {
            pageId,
            businessId,
            objectType: pagination.objectType,
          },
        };
      }
      const result = yield call(queryRemoveBusiness, params);
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
    // 删除子表数据
    *getRemoveChildData({ payload, callback }, { select, call, put }) {
      const selectDate = yield select(({ tableTemplate }) => tableTemplate.selectDate);
      const pageId = yield select(({ tableTemplate }) => tableTemplate.pageId);
      const params = {
        param: { businessId: [payload.id], objectType: payload.objectType, pageId },
      };
      const result = yield call(queryRemoveBusiness, params);
      if (result.status == 'success') {
        if (result.message) {
          notification.success({ message: result.message, duration: 3 });
        }
        yield put({ type: 'getPagelist', payload: { pageId } });
        if (payload.id) {
          // 用于区分是否是保存的数据删除还是新增的缓存数据删除
          yield put({
            type: 'getDetailPage',
            payload: {
              ID: selectDate.ID,
              pageId,
              ObjectType: selectDate.ObjectType,
              type: 'deleteChild',
              params,
            },
          });
        }
      } else {
        notification.error({ message: result.message, duration: 3 });
      }
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
    // 按钮的执行方法
    *getTransactionProcess({ payload }, { select, call, put }) {
      const selectDate = yield select(({ tableTemplate }) => tableTemplate.selectDate);
      const objectType = yield select(
        ({ tableTemplate }) => tableTemplate.detailColumns.objectType
      );
      const pageId = yield select(({ tableTemplate }) => tableTemplate.pageId);
      const DetailChildData = yield select(({ tableTemplate }) => tableTemplate.DetailChildData);
      const { isEdit, idList } = payload;
      const ButtonName = payload.Buttons.FIELD_NAME;
      let params;
      if (isEdit) {
        params = {
          selectDate,
          ButtonName,
          objectType,
          selectDataId: selectDate.ID,
          ChildTableData: DetailChildData,
        };
      } else {
        if (idList) {
          params = {
            selectDate,
            selectDate1: idList,
            ButtonName,
            objectType,
            selectDataId: selectDate.ID,
          };
        } else {
          params = { selectDate, ButtonName, objectType, selectDataId: selectDate.ID };
        }
      }
      const result = yield call(queryTransactionProcess, params);
      if (result.status == 'success') {
        yield put({ type: 'save', payload: { reportFormURL: result.executeScript } });
        if (result.message) {
          notification.success({ message: result.message, duration: 3 });
        }
        const pagination = yield select(({ tableTemplate }) => tableTemplate.pagination);
        let newSelectDate;
        let newObjectType;
        pagination.list.map((value, index) => {
          if (value.ID == selectDate.ID) {
            newSelectDate = value;
            newObjectType = value.ObjectType;
          }
        });
        yield put({ type: 'getPagelist', payload: { pageId } });
        yield put({
          type: 'getDetailPage',
          payload: { pageId, ObjectType: newObjectType, ID: selectDate.ID },
        });
        yield put({
          type: 'save',
          payload: { selectDate: newSelectDate, objectType: newObjectType, pagination: tableData },
        });
      } else {
        notification.error({ message: result.message, duration: 3 });
      }
    },
    // 分页 （列表页获取数据）
    *getPagination({ payload,callback }, { select, call, put }) {
      const { pageId, searchParams = {},pageSize, summarySort, sorterData } = payload;
      const pageNum = payload.current;
      const params = {
        pageId,
        summarySort,
        pageSize,
        pageNum,
        sorterData,
        ...searchParams,
      };
      const result = yield call(queryPagination, params);
      if(callback) callback (result)
      if (result.status == 'success') {
        yield put({ type: 'save', payload: { pagination: result.data } });
      } else {
        yield put({ type: 'save', payload: { pagination: {} } });
        notification.error({ message: result.message, duration: 3 });
      }
    },
    // 下拉框事件
    *getAutocomplate({ payload, callback }, { select, call, put }) {
      const detailColumns = yield select(({ tableTemplate }) => tableTemplate.detailColumns);
      const selectDate = yield select(({ tableTemplate }) => tableTemplate.selectDate);
      const detailData = yield select(({ tableTemplate }) => tableTemplate.detailData);
      const { key } = payload.value.key ? payload.value : detailColumns;
      const { text } = payload.value;
      const { searchData, selectKey, ColumnsData } = payload;
      let params;
      if (payload.value) {
        params = {
          key: key || payload.value.key,
          text: payload.value.FIELD_NAME || payload.value.text,
          value: searchData !== undefined ? searchData : payload.value.FIELD_VALUE,
          objId: selectDate.ID,
          selectKey,
        };
      } else {
        params = {
          key,
          text,
          value: searchData != undefined ? searchData : null,
          objId: selectDate.ID,
          selectKey,
        };
      }
      const result = yield call(queryAutocomplate, params);
      const selectChildOption = yield select(
        ({ tableTemplate }) => tableTemplate.selectChildOption
      );
      const isExist = _.findIndex(selectChildOption, function (o) {
        return o.selectKey == result.data.selectKey && o.field == result.data.field;
      });
      if (isExist == -1) {
        selectChildOption.push(result.data);
      } else {
        selectChildOption[isExist].options = result.options;
      }
      _.map(detailData.policyFormFields, data => {
        if (data.FIELD_NAME === result.data.field) {
          data.options = result.data.options;
          return data;
        }
      });
      yield put({
        type: 'save',
        payload: {
          selectOption: result.data
            ? result.data.options
              ? result.data.options
              : result.data
            : [],
          detailData,
          selectChildOption,
        },
      });
      callback && callback(result);
    },
    // 子表下拉框事件
    *getChildAutocomplate({ payload, callback }, { select, call, put }) {
      const selectDate = yield select(({ tableTemplate }) => tableTemplate.selectDate);
      const { searchData, selectKey, ColumnsData } = payload;
      const { text } = payload.value;
      const params = {
        key: ColumnsData.key,
        text: payload.value.FIELD_NAME || payload.value.text,
        value: searchData !== undefined ? searchData : payload.value.FIELD_VALUE,
        objId: selectDate.ID,
        selectKey,
      };
      const result = yield call(queryAutocomplate, params);
      const selectChildOption = yield select(
        ({ tableTemplate }) => tableTemplate.selectChildOption
      );
      // console.log('子表的下拉数据',selectChildOption)
      const isExist = _.findIndex(selectChildOption, function (o) {
        return o.selectKey == result.data.selectKey && o.field == result.data.field;
      });
      // console.log('是否存在',isExist)
      if (isExist == -1) {
        selectChildOption.push(result.data);
      } else {
        selectChildOption[isExist].options = result.data.options;
      }
      // console.log(selectChildOption,'后台返回的数据',result.data.options)
      yield put({
        type: 'save',
        payload: {
          selectChildOption,
        },
      });
    },
    // 主表的rtlink功能
    *updateFields({ payload, callback }, { call, put, select }) {
      const { updatedField, objectType, params, value } = payload;
      // _.mapKeys(params, (value, key) => {
      //   if (typeof value === 'string') {
      //     const arr = value.split('--');
      //     const newValue = arr[arr.length - 1];
      //     if (arr.length > 0) {
      //       params[key] = parseInt(newValue) ? parseInt(newValue) : newValue;
      //     }
      //   }
      // });
      // const params = _.assign(value, selectValue);

      const detailData = yield select(({ tableTemplate }) => tableTemplate.detailData);
      detailData.policyFormFields.map((val, index) => {
        // if(editValue){
        // 判断是否修改和用户是否选择清空选项，如果修改了，就赋值，没有修改不变,注：null == undefined,区分他们要用 ===
        if (params[val.FIELD_NAME]) {
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
              console.log('循环数据',detailData.policyFormFields[index][c.field],c.value)
              detailData.policyFormFields[index][c.field] = c.value;
            });
          }
        });
      }
      console.log('detailData',detailData)
      yield put({ type: 'save', payload: { detailData } });
      if (result.status === 'success' && result.data[0].fieldChanges.length && callback) {
        callback(result.data[0].fieldChanges);
      }
    },
    //用于获取主表最新的值
    *getMainTableData({payload,callback},{select,put,call}){
        console.log('主表数据',payload)
        yield put({type:'save',payload:{
          MainTableData:payload
        }})
    },
    // 子表的rtlink功能
    *childUpdateFields({ payload, callback }, { select, put, call }) {
      const ChildData = yield select(({ tableTemplate }) => tableTemplate.ChildData);
      const { params } = payload;
      const { list = [] } = params;
      if (list.length > 0) {
        yield put({ type: 'save', payload: { isChildAdd: true } });
      }
      const parentPolicyFormFields = yield select(({ tableTemplate }) => tableTemplate.detailData)
      params.parentPolicyFormFields = parentPolicyFormFields.policyFormFields
      const result = yield call(childUpdateFields, params);
      // console.log(ChildData,'后端返回的数据',result.data)
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
    // 文件上传的接口
    *FileUpdate({ payload }, { select, put, call }) {
      console.log('文件上传的接口');
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

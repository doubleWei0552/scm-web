import { 
    querySummaryPageConfig, 
    queryPagelist,
    queryPagination,
    queryAutocomplate,
    queryRemoveBusiness,
    queryTransactionProcess,
} from '@/services/api';
import _ from 'lodash';
import { notification } from 'antd';
import moment from 'moment'

export default {
  namespace: 'listPage', //列表页model

  state: {
    pageId: null, // 当前页面的pageID
    tableColumns: [], // 列表页展示的表头数据
    tableData: [], // 列表页展示的数据
    tableColumnsData: {}, // 列表页表头方法返回的所有数据
    pagination: {}, // 列表页请求的分页所有数据

    selectDataDelete: [], // 选择要删除的数据
    selectedRowKeys: [], // 选择的那个表格行数据，自定义按钮事件需要的参数

    currentKey: '', // 搜索栏下拉框查询需要的key
    searchParams: {}, // 列表页的查询参数 
    pageSize: 10, //列表页每页展示的数据
    sorterData: {}, //用于记录列表排序
    summarySort: null,
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
        const result = yield call(querySummaryPageConfig, payload); //payload传pageID
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
        const pagination = yield select(({ listPage }) => listPage.pagination);
        const { pageId, searchParams = {}, summarySort, sorterData } = payload;
        const pageNum = pagination.currentPage || 1 ;
        const pageSize = pagination.pageSize || 10
        const params = {
            pageId,
            summarySort,
            pageSize,
            pageNum,
            sorterData,
            ...searchParams,
        };
        const result = yield call(queryPagination, params);
        if (result.status == 'success') {
            yield put({ type: 'save', payload: { 
                pagination: result.data,
                tableData: result.data.list 
            } });
        } else {
            yield put({ type: 'save', payload: { pagination: {} } });
            notification.error({ message: result.message, duration: 3 });
        }
        if(callback) callback (result)
    },
    // 搜索框下拉框事件
    *getAutocomplate({ payload, callback }, { select, call, put }) {
        let result = yield call(queryAutocomplate,payload.value)
        if(callback) callback (result)
    },
    // 列表页删除数据方法
    *getRemoveBusiness({ payload, callback }, { call, select, put }) {
        let pageId = yield select(({ listPage }) => listPage.pageId);
        let selectedRowKeys = yield select(({ listPage }) => listPage.selectedRowKeys);
        let {objectType} = yield select(({ listPage }) => listPage.pagination);
        let params = {
            param:{
                businessId:selectedRowKeys,
                pageId,
                objectType,
            }
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
    //列表页按钮执行方法
    *getTransactionProcess({payload,callback},{call,select,put}){
      let {objectType} = yield select(({listPage})=>listPage.pagination)
      let pageId = yield select(({listPage})=>listPage.pageId)
      let params = {
        selectDate1: payload.idList,
        ButtonName:payload.Buttons.FIELD_NAME,
        objectType,
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
    }
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

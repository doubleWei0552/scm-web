import QualityService from '@/services/hy/quality';
import { notification } from 'antd';

export default {
  namespace: 'quality',

  state: {
    list: [],
    modalDeliveryOrderList: [],
  },

  effects: {
    *getDataList({ payload, callback }, { call, put }) {
      const response = yield call(QualityService.getDatalList, payload);
      if (response.status === 'success') {
        callback && callback(response.data);
      } else {
        notification.error({
          message: `请求错误 ${response.status}: ${response.url}`,
          description: response.message,
        });
      }
    },
    *handleQuality({ payload, callback }, { call, put }) {
      const response = yield call(QualityService.handleQuality, payload);
      if (response.status === 'success') {
        callback && callback(response.data);
      } else {
        notification.error({
          message: `请求错误 ${response.status}: ${response.url}`,
          description: response.message,
        });
      }
    },
    *handleResetQuality({ payload, callback }, { call, put }) {
      const response = yield call(QualityService.handleResetQuality, payload);
      if (response.status === 'success') {
        callback && callback(response.data);
      } else {
        notification.error({
          message: `请求错误 ${response.status}: ${response.url}`,
          description: response.message,
        });
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

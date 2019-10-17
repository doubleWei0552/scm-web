import QualityService from '@/services/hy/quality';

export default {
  namespace: 'quality',

  state: {
    list: [],
    modalDeliveryOrderList: [],
  },

  effects: {
    *getDataList({ payload, callback }, { call, put }) {
      const response = yield call(QualityService.getDatalList, payload);
      console.log('response', response);
      if (response.status === 'success') {
        callback && callback(response.data);
      }
    },
    *handleQuality({ payload, callback }, { call, put }) {
      const response = yield call(QualityService.handleQuality, payload);
      console.log('response', response);
      if (response.status === 'success') {
        callback && callback(response.data);
      }
    },
    *handleResetQuality({ payload, callback }, { call, put }) {
      const response = yield call(QualityService.handleResetQuality, payload);
      console.log('response', response);
      if (response.status === 'success') {
        callback && callback(response.data);
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

import HyDeliveryOrderService from '@/services/hy/deliveryorder';

export default {
  namespace: 'hydeliveryorder',

  state: {
    list: [],
    modalDeliveryOrderList: [],
  },

  effects: {
    *getModalList({ payload, callback }, { call, put }) {
      const response = yield call(HyDeliveryOrderService.getModalList, payload);
      console.log('response', response);
      if (response.status === 'success') {
        const { data } = response
        callback && callback(data);
        yield put({
          type: 'save',
          payload: {
            modalDeliveryOrderList: response,
            // shipMentOrderData: {
            //   list: response.Data.Datas,
            //   pagination: {
            //     total: response.Data.Total,
            //     pageSize: payload.pageSize,
            //     current: payload.current,
            //     pageNumber: payload.current
            //   }
            // }
          },
        });
      }
    },
    *confirmSelect({ payload, callback }, { call, put }) {
      const response = yield call(HyDeliveryOrderService.confirmSelect, payload);
      if (response.status === 'success') {
        callback && callback(response)
      } else {

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
};

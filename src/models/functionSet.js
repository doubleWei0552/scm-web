import {

  } from '@/services/api';
  import _ from 'lodash';
  import { notification } from 'antd';

  //系统拓展功能集合
export default {
  namespace: 'functionSet',
  state: {

  },

  effects: {
    
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

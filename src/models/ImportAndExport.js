import {
  queryExport
} from '@/services/api';
import _ from 'lodash';
import { notification } from 'antd';

//导向页
export default {
namespace: 'importAndExport',
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

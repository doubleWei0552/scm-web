import request from '@/utils/request';
import { stringify } from 'qs';

class HyDeliveryOrderService {
  async getModalList(params) {
    return request('/delivery/newMerge/findPurchaseDs', {
      method: 'POST',
      body: params,
    });
  }

  // /delivery/newMerge/savePurchaseDsTodeliverAndPurchaseDemand
  async confirmSelect(params) {
    return request('/delivery/newMerge/savePurchaseDsTodeliverAndPurchaseDemand', {
      method: 'POST',
      body: params,
    });
  }

  // async saveShipmentOrder(params) {
  //   return request('/ShipMent/SaveShipmentOrder', {
  //     method: 'POST',
  //     body: params,
  //   });
  // }
}

export default new HyDeliveryOrderService();

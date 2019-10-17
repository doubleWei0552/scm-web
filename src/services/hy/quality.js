import request from '@/utils/request';
import { stringify } from 'qs';

class QualityService {
  async getDatalList(params) {
    return request('/hy/QualityAssurance/load', {
      method: 'POST',
      body: params,
    });
  }

  async handleQuality(params) {
    return request('/hy/QualityAssurance/authorized', {
      method: 'POST',
      body: params,
    });
  }

  async handleResetQuality(params) { //201908000106
    return request('/hy/QualityAssurance/revocation', {
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

export default new QualityService();

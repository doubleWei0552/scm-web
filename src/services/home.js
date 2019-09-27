import { stringify } from 'qs';
import request from '@/utils/request';


// 获取BasicTable表格中的数据
export async function queryNoticeList(params) {
  return request('/summaryPage/queryResult', {
    method: 'POST',
    body: params,
  });
}

// 获取BasicTable表格中的数据
export async function queryNoticeById(params) {
  return request('/detailPage/load', {
    method: 'POST',
    body: params,
  });
}
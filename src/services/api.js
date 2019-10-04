import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

// 登陆时触发的方法
export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

// 获取导航栏数据
export async function queryNavData(params) {
  return request('/menus/queryScmModule', {
    method: 'POST',
    body: params,
  });
}

// 获取菜单列表
export async function queryMenuData(params) {
  return request('/menu/load', {
    method: 'POST',
    body: params,
  });
}

// 获取BasicTable表格中的表头数据
export async function querySummaryPageConfig(params) {
  return request('/summaryPageConfig/load', {
    method: 'POST',
    body: params,
  });
}

// 获取BasicTable表格中的数据
export async function queryPagelist(params) {
  return request('/summaryPage/queryResult', {
    method: 'POST',
    body: params,
  });
}

// 详情页表头
export async function queryDetailPageConfig(params) {
  const { isSuperUser = 'no' } = JSON.parse(localStorage.getItem('userData'));
  if (isSuperUser === 'Yes' && localStorage.getItem('developerMode')) {
    return request('/detailPageConfig/load2', {
      method: 'POST',
      body: params,
    });
  } else {
    return request('/detailPageConfig/load', {
      method: 'POST',
      body: params,
    });
  }
}

// 详情页获取数据
export async function queryDetailPage(params) {
  const { isSuperUser = 'no' } = JSON.parse(localStorage.getItem('userData'));
  if (isSuperUser === 'Yes' && localStorage.getItem('developerMode')) {
    return request('/detailPage/loadTwo', {
      method: 'POST',
      body: params,
    });
  } else {
    return request('/detailPage/load', {
      method: 'POST',
      body: params,
    });
  }
}

// 详情页数据保存
export async function queryDetailSave(params) {
  return request('/detail/save', {
    method: 'POST',
    body: params,
  });
}

// 详情页数据编辑
export async function queryDetailEdit(params) {
  return request('/detail/edit', {
    method: 'POST',
    body: params,
  });
}

// 列表页数据删除
export async function queryTableDelete(params) {
  return request('/tableDetail/delete', {
    method: 'POST',
    body: params,
  });
}

// 数据删除
export async function queryRemoveBusiness(params) {
  return request('/detail/delete', {
    method: 'POST',
    body: params,
  });
}

// 子表的数据保存
export async function queryDetailChildSave(params) {
  return request('/detail/childSave', {
    method: 'POST',
    body: params,
  });
}

// 按钮执行方法
export async function queryTransactionProcess(params) {
  return request('/transaction/process', {
    method: 'POST',
    body: params,
  });
}

// 按钮执行方法测试版
export async function queryTransactionProcessTest(params) {
  return request('/transaction1/process', {
    method: 'POST',
    body: params,
  });
}

// 请求分页
export async function queryPagination(params) {
  return request('/summaryPage/queryResult', {
    method: 'POST',
    body: params,
  });
}

// 下拉框事件
export async function queryAutocomplate(params) {
  return request('/summaryQuery/autocomplate', {
    method: 'POST',
    body: params,
  });
}

// 获取子表数据
export async function queryDetailChildPage(params) {
  const { isSuperUser = 'no' } = JSON.parse(localStorage.getItem('userData'));
  if (isSuperUser === 'Yes' && localStorage.getItem('developerMode')) {
    return request('/detailChildPage/resultTwo', {
      method: 'POST',
      body: params,
    });
  } else {
    return request('/detailChildPage/result', {
      method: 'POST',
      body: params,
    });
  }
}

// 登陆接口
export async function queryRSLogin(params) {
  return request('/rs/login', {
    method: 'POST',
    body: params,
  });
}
// 登出接口
export async function queryRSLogOut(params) {
  return request('/rs/ajax/logout', {
    method: 'POST',
  });
}

// rtLink
export async function updateFields(params) {
  return request('/page/update', {
    method: 'POST',
    body: params,
  });
}

// 子表的rtLink
export async function childUpdateFields(params) {
  return request('/page/update', {
    method: 'POST',
    body: params,
  });
}

// 子表新增弹框的表头
export async function queryDetailListConfig(params) {
  return request('/detailObjListConfig/load', {
    method: 'POST',
    body: params,
  });
}

// 子表新增弹框的数据
export async function queryDetailList(params) {
  // return request('/detailObjList/load', {
  return request('/summaryPage/queryResult', {
    method: 'POST',
    body: params,
  });
}

// 文件上传的接口
export async function fileUpdate(params) {
  return request('/rs/uploadImage', {
    method: 'POST',
    body: params,
  });
}

// 列表页自定义导向页按钮获取数据
export async function detailButtonGuide(params) {
  return request('/buttonGuideConfig/load', {
    method: 'POST',
    body: params,
  });
}

// 获取向导页table类型的content表头数据方法
export async function queryButtonGuideConfig(params) {
  return request('/buttonGuideConfig/load', {
    method: 'POST',
    body: params,
  });
}

// 获取向导页table类型的content数据数据方法
export async function queryButtonGuideData(params) {
  return request('/excelButtonGuideData/list', {
    method: 'POST',
    body: params,
  });
}

// 开户提交时调的接口
export async function queryOpenAccount(params) {
  return request('/button/newUser', {
    method: 'POST',
    body: params,
  });
}

//导出方法
export async function queryExport(params = {}) {
  return request(`/summary/export?${stringify(params)}`, {
    method: 'GET',
  });
}

// 导向页下一步额外执行的方法
export async function queryGuideBean(params) {
  return request('/guide/guideBean', {
    method: 'POST',
    body: params,
  });
}

// 导向页点击额外执行的方法
export async function queryButtonGuideClean() {
  return request('/buttonGuideClean/load', {
    method: 'POST',
    body: {},
  });
}

// 获取用户配置的基本信息
export async function queryLogoParameter(params) {
  return request('/app/work/queryLogoParameter', {
    method: 'POST',
    body: {},
  });
}

// 获取数据量大的子表数据方法
export async function queryLargeChilddata(params) {
  return request('/detailChildPageNew/result', {
    method: 'POST',
    body: params,
  });
}

// 多用户操作
export async function guideBack(params) {
  return request('/guide/guideBack', {
    method: 'POST',
    body: params,
  });
}

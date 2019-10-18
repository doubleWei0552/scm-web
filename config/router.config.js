export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
    ],
  },
  // 租户功能
  {
    path: '/tenant',
    component: '../layouts/BlankLayout',
    routes: [
      { path: '/tenant', redirect: '/tenant/select' },
      { path: '/tenant/select', name: 'login', component: './Tenant/index' },
    ],
  },
  // user
  {
    path: '/account',
    component: '../layouts/BasicLayout',
    routes: [
      { path: '/account', redirect: '/account/me' },
      { path: '/account/me', name: 'login', component: './Account/PersonalCenter' },
      { path: '/account/book', name: 'login', component: './Account/Book' },
    ],
  },
  // errorPage
  {
    name: 'ErrorPage',
    path: '/ErrorPage',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/ErrorPage',
        component: './ErrorPage/Error',
      },
      {
        path: '/ErrorPage/403',
        name: 'not-permission',
        component: './ErrorPage/403.jsx',
      },
      {
        path: '/ErrorPage/404',
        name: 'not-find',
        component: './ErrorPage/404.jsx',
      },
      {
        path: '/ErrorPage/500',
        name: 'server-error',
        component: './ErrorPage/500.jsx',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      { path: '/', redirect: '/user' },

      // 动态路由
      { path: '/2328/deliveryOreer', name: '', component: './HY/DeliveryOrder' },
      { path: '/2328/deliveryOreer/list', name: '', component: './HY/DeliveryOrder' },
      {
        path: '/5078',
        name: 'rs_paas',
        icon: 'snippets',
        routes: [
          { path: '/5078/:first/:second', name: '', component: './HY/QualityAssurance' },
          { path: '/5078/:first/:second/list', name: '', component: './HY/QualityAssurance' },
          // /2328/deliveryOreer
          { path: '/2328/deliveryOreer', name: '', component: './HY/DeliveryOrder' },
          {
            path: '/2328/deliveryOreer/detail/:detailId',
            name: '',
            component: './HY/DeliveryOrderDetail',
          },
          {
            path: '/hy/deliveryOrder/detail/:detailId',
            name: '',
            component: './HY/DeliveryOrderDetail',
          },

          { path: '/hy/:first/:second/:third/list', name: '', component: './HY/ListTemplate' },

          {
            path: '/hy/:first/:second/:third/:fourth/list',
            name: '',
            component: './HY/ListTemplate',
          },

          {
            path: '/hy/:first/:second/:third/:fourth/:fifth/list',
            name: '',
            component: './HY/ListTemplate',
          },
        ],
      },
      {
        path: '/:first',
        name: 'rs_paas',
        icon: 'snippets',
        routes: [
          // 3004/reportForm1
          { path: '/:first/reportForm1', name: '', component: './ReportForm' },
          { path: '/:first/:second/reportForm1', name: '', component: './ReportForm' },
          { path: '/:first/:second/:third/reportForm1', name: '', component: './ReportForm' },
          {
            path: '/:first/:second/:third/:fourth/reportForm1',
            name: '',
            component: './ReportForm',
          },

          { path: '/:first/:second', name: '', component: './Template' },
          { path: '/:first/:second/list', name: '', component: './ListTemplate' },
          { path: '/:first/:second/detail', name: '', component: './Template' },
          { path: '/:first/:second/detail/:detailId', name: '', component: './Template' },

          { path: '/:first/reportForm1/:third', name: '', component: './ReportForm' },
          { path: '/:first/:second/:third', name: '', component: './Template' },
          { path: '/:first/:second/:third/list', name: '', component: './ListTemplate' },
          { path: '/:first/:second/:third/detail', name: '', component: './Template' },
          { path: '/:first/:second/:third/detail/:detailId', name: '', component: './Template' },

          { path: '/:first/reportForm1/:third/:fourth', name: '', component: './ReportForm' },
          { path: '/:first/:second/:third/:fourth', name: '', component: './Template' },
          { path: '/:first/:second/:third/:fourth/list', name: '', component: './ListTemplate' },
          { path: '/:first/:second/:third/:fourth/detail', name: '', component: './Template' },
          {
            path: '/:first/:second/:third/:fourth/detail/:detailId',
            name: '',
            component: './Template',
          },

          {
            path: '/:first/reportForm1/:third/:fourth/:fifth',
            name: '',
            component: './ReportForm',
          },
          { path: '/:first/:second/:third/:fourth/:fifth', name: '', component: './Template' },
          {
            path: '/:first/:second/:third/:fourth/:fifth/list',
            name: '',
            component: './ListTemplate',
          },
          {
            path: '/:first/:second/:third/:fourth/:fifth/detail',
            name: '',
            component: './Template',
          },
          {
            path: '/:first/:second/:third/:fourth/:fifth/detail/:detailId',
            name: '',
            component: './Template',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];

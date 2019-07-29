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
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      { path: '/', redirect: '/user' },
      // 动态路由
      {
        path: '/:first',
        name: 'rs_paas',
        icon: 'snippets',
        routes: [

          
          // 3004/reportForm1
          { path: '/:first/reportForm1', name: '', component: './ReportForm', },
          { path: '/:first/:second/reportForm1', name: '', component: './ReportForm', },
          { path: '/:first/:second/:third/reportForm1', name: '', component: './ReportForm', },
          { path: '/:first/:second/:third/:fourth/reportForm1', name: '', component: './ReportForm', },

          { path: '/:first/:second', name: '', component: './Template', },
          { path: '/:first/:second/list', name: '', component: './ListTemplate', },
          { path: '/:first/:second/detail', name: '', component: './Template', },
          { path: '/:first/:second/detail/:detailId', name: '', component: './Template', },

          { path: '/:first/reportForm1/:third', name: '', component: './ReportForm', },
          { path: '/:first/:second/:third', name: '', component: './Template', },
          { path: '/:first/:second/:third/list', name: '', component: './ListTemplate', },
          { path: '/:first/:second/:third/detail', name: '', component: './Template', },
          { path: '/:first/:second/:third/detail/:detailId', name: '', component: './Template', },

          { path: '/:first/reportForm1/:third/:fourth', name: '', component: './ReportForm', },
          { path: '/:first/:second/:third/:fourth', name: '', component: './Template', },
          { path: '/:first/:second/:third/:fourth/list', name: '', component: './ListTemplate', },
          { path: '/:first/:second/:third/:fourth/detail', name: '', component: './Template', },
          { path: '/:first/:second/:third/:fourth/detail/:detailId', name: '', component: './Template', },

          { path: '/:first/reportForm1/:third/:fourth/:fifth', name: '', component: './ReportForm', },
          { path: '/:first/:second/:third/:fourth/:fifth', name: '', component: './Template', },
          { path: '/:first/:second/:third/:fourth/:fifth/list', name: '', component: './ListTemplate', },
          { path: '/:first/:second/:third/:fourth/:fifth/detail', name: '', component: './Template', },
          { path: '/:first/:second/:third/:fourth/:fifth/detail/:detailId', name: '', component: './Template', },

          
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];

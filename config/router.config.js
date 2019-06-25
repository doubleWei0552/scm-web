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
          { path: '/:first/:second', name: '', component: './Template', },

          { path: '/:first/:second/:third', name: '', component: './Template', },

          { path: '/:first/:second/:third/:fourth', name: '', component: './Template', },

          { path: '/:first/:second/:third/:fourth/:fifth', name: '', component: './Template', },
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

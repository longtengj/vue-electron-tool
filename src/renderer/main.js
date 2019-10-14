import Vue from 'vue'
import axios from 'axios'
import iView from 'iview'
// import ViewUI from 'view-design';//升级4.0.0
import Router from 'vue-router'
import App from './App'
import store from './store'

import filters from './utils/util';
import db from './utils/db';
import logger from './utils/logger';
import routes from './router/route';
import serialport from "./api/index";

import './utils/upgrade';
import 'iview/dist/styles/iview.css';
// import 'view-design/dist/styles/iview.css';//升级4.0.0
import './assets/less/common.less';

Vue.use(Router)
Vue.use(iView)
// Vue.use(ViewUI);


Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));
const router = new Router({
  routes,
});
Vue.prototype.$db = db;

Vue.prototype.$logger = logger;

Vue.prototype.$serialport = serialport

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
// new Vue({
//   components: { App },
//   router,
//   store,
//   template: '<App/>'
// }).$mount('#app')

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
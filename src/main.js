import Vue from "vue";

import Cookies from 'js-cookie'
import 'normalize.css/normalize.css'  
import 'default-passive-events' //浏览器兼容
import ElementUI from 'element-ui';
import '@/styles/comcss.css'
import '@/styles/common.scss'
import './styles/element-variables.scss'
import '@/styles/index.scss' // global css
import '@/icons'
import App from "./App.vue";
import router from "./router";
import store from "./store";
import api from './http/api';
import http from './http/index';
import util from './utils/util.js'
import permission from './utils/vPermission';
import './permission' // permission control
import './utils/error-log' // error log
require('../mock')
Vue.directive('permission',permission)
Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
});
Vue.prototype.$api = api;
Vue.prototype.$http = http;
Vue.prototype.$util = util;
Vue.prototype.$loading = false;
Vue.config.productionTip = false;
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#app");

import Vue from 'vue'
import i18n from 'Lang'
import App from './App.vue'

// 引入样式reset
import '~/normalize.css'

import './registerServiceWorker'

// 引入插件
import router from 'Plugins/router';
import store from 'Plugins/store';
import inject from 'Plugins/inject';
import 'Plugins/icons'
import 'Plugins/element.js'

// 可作为全局通信的载体,用于非父子关系的组件间的通信上，常见的业务一般都可以用vuex替代
window.GLOBAL.vbus = new Vue();

// 在Vue实例上挂载某些对象
Vue.use(inject);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

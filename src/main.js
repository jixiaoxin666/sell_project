// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// "vue-router" 是因为node_modules=>vue-router=>package.json=>name:vue-router
import VueRouter from 'vue-router';
import App from './App';
// 引入goods组件
import goods from './components/goods/goods.vue';

Vue.config.productionTip = false;
Vue.use(VueRouter);

// let app = Vue.extend(App);

const routes = [
  {path: '/goods', component: goods}
];

const router = new VueRouter({
  routes
});

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能

/* eslint-disable no-new */
// new Vue({
//   router
// }).$mount('#app');

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});

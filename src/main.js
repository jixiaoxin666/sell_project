// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 需要明确安装路由功能
import Vue from 'vue';
// "vue-router" 是因为node_modules=>vue-router=>package.json=>name:vue-router
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';

Vue.use(VueRouter);
Vue.use(VueResource);

// 1.定义组件，这里使用从其他文件import进来
// 引入goods组件
// 引入路径不是相对路径 因为build=>webpack.base.conf.js中配置
import goods from 'components/goods/goods.vue';
import ratings from 'components/ratings/ratings.vue';
import seller from 'components/seller/seller.vue';

import 'common/stylus/index.styl';
// Vue.config.productionTip = false;
// 2.定义路由
const routes = [
  {path: '/goods', component: goods},
  {path: '/ratings', component: ratings},
  {path: '/seller', component: seller}
];
// 3.创建 router 实例，然后传 routes 配置
const router = new VueRouter({
  // 设置链接激活时的class 如果不设置 默认值是router-link-active
  linkActiveClass: 'active',
  // ES6缩写语法，相当于routes:routes
  routes
});
// 4.创建和挂载根实例。通过 router 配置参数注入路由，从而让整个应用都有路由功能/

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

// 经过上面的配置之后呢，路由匹配到的组件将会渲染到Ap.vue里的<router-view></router-view>

// 设置当前默认页面
router.push('/goods');


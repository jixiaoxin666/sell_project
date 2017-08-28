<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <!-- 使用 router-link 组件来导航. -->
        <!-- 通过传入 `to` 属性指定链接. -->
        <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>

    <!--keep-alive组件 用来缓存组件,避免多次加载相应的组件,减少性能消耗-->
    <keep-alive>
      <!-- 路由出口 -->
      <!-- 路由匹配到的组件将渲染在这里 -->
      <!--将seller传递给组件-->
    <router-view :seller="seller" ></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  // 引入urlParse方法
  import {urlParse} from './common/js/util';
  import header from './components/header/header.vue';

  const ERR_OK = 0;

  export default {
    data() {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            console.log(queryParam);
            return queryParam.id;
          })()
          // 立即执行函数
        }
      };
    },
    created() {
      this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
        response = response.body;
        console.log('kaishi');
        console.log(response.data);
        console.log(this.seller);
        if (response.errno === ERR_OK) {
          // 追加id属性
          // 有时你想向已有对象上添加一些属性，例如使用 Object.assign() 或 _.extend() 方法来添加属性。但是，添加到对象上的新属性不会触发更新。在这种情况下可以创建一个新的对象，让它包含原对象的属性和新的属性：
          // 代替 `Object.assign(this.someObject, { id: 12345, a:b })`
          // 使用 this.someObject = Object.assign({}, this.someObject, { id: 12345, a:b })
          this.seller = Object.assign({}, this.seller, response.data);
          console.log(this.seller);
        }
      });
    },
    components: {
      'v-header': header
    }
  };
</script>


<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"
  #app
    .tab
      display: flex
      width: 100%
      height: 40px
      line-height: 40px
      border-1px(rgba(7,17,27,0.1))
      // border-bottom: 1px solid rgba(7,17,27,0.1)
      .tab-item
        flex: 1
        text-align: center
        & > a
          display:block
          font-size: 14px
          color: rgb(77,85,95)
          &.active
            color: rgb(240,20,20)

</style>

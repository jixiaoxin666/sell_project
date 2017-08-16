<template>
  <transition name="move">
    <!--BScroll 绑定的元素 是一个视口的高度 下一个子节点是内容的高度 当内容高度超过视口高度时就滚动-->
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="hide">
            <i class="icon-close"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}</span>
            <span class="rating">好评率{{food.rating}}</span>
          </div>
          <div class="price">
            <span class="now">¥{{food.price}}</span><span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
          </div>
        </div>
        <div class="cartcontrol-wrapper">
          <cartcontrol :food="food"></cartcontrol>
        </div>
        <transition name="fade">
          <div class="buy" v-show="!food.count || food.count === 0" @click="addFirst">加入购物车
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>


<script type="text/ecmascript-6">
  // 上下滚动js插件
  import BScroll from 'better-scroll';
  import Vue from 'vue';
  // 引入组件之间通信的bus
  import Bus from '../../common/js/bus.js';
  // 引入增减商品数量组件
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  export default {
    // 接收从goods组件中传过来的food
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false
      };
    },
    methods: {
      // 设计组件的时候,父组件是可以调用子组件方,但是子组件不能调用父组件的方法
      // 设计组件方法时,一般可以被外部组件调用的就命名成不带下划线的,如果是自己私有的就设置成下划线开头的 例如goods组件下的_initScroll()方法
      show() {
        this.showFlag = true;
        this.$nextTick(() => {
          if (!this.scroll) {
            // 绑定元素
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide() {
        this.showFlag = false;
      },
      addFirst(event) {
        // 如果不是派生的 就返回
        if (!event._constructed) {
          return;
        }
        // 设置count属性
        Vue.set(this.food, 'count', 1);
        // 派发一个事件(cart.add) 把当前的元素(event.target)传过去
        // 可以在兄弟组件(shopcart组件)中监听这个事件
        Bus.$emit('cart.add', event.target);
      }
    },
    components: {
      cartcontrol
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30 // 小于底部购物车 而且 小于底部购物车弹出的mask层
    width: 100%
    background: #fff
    transform: translate3d(0, 0, 0)
    &.move-enter-active, &.move-leave-active
      transition: all 0.2s linear
    &.move-enter, &.move-leave-to
      transform: translate3d(100%, 0, 0)
    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100% //该百分比是相对于盒子的宽度计算的 该设置可以实现一个宽高相等的容器
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-close
          display: block
          padding: 10px
          font-size: 20px
          color: #fff
    .content
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .detail
        margin-bottom: 18px
        line-height: 10px
        height: 10px
        font-size: 0
        .sell-count, .rating
          font-size: 10px
          color: rgb(147, 153, 159)
        .sell-count
          margin-right: 12px
      .price
        font-weight: 700px
        line-height: 24px
        .now
          margin-right: 8px
          font-size: 14px
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size: 10px
          color: rgb(147, 153, 159)

    .cartcontrol-wrapper
      position: absolute
      right: 12px
      bottom: 12px
    .buy
      position: absolute
      right: 18px
      bottom: 18px
      z-index: 10
      height: 24px
      line-height: 24px
      padding: 0 12px
      box-sizing: border-box
      border-radius: 12px
      font-size: 10px
      color: #fff
      background: rgb(0, 160, 220)
      opacity: 1
      //做小球下落动画的时候需要获取当前元素的位置(来确定小球开始下落的位置) 但是.buy这个元素点击之后就马上消失 所以可能会造成获取位置不准确 动画效果不准确 因此给该元素加上一个渐隐的动画 利用渐隐动画的时间就可以获取到该元素的位置
      &.fade-enter-active, &.fade-leave-active
        transition: all 0.2s
      &.fade-enter, &.fade-leave-to
        opacity: 0

</style>

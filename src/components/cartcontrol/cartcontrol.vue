<template>
  <div class="cartcontrol">
    <transition name="move">
      <!--把减号分为两部分div和span是为了div负责平移 span负责滚动-->
    <div class="cart-decrease " v-show="food.count>0" @click="decreaseCart">
      <span class="inner icon-offline"></span>
    </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-addition_fill" @click="addCart"></div>
  </div>
</template>


<script type="text/ecmascript-6">
  import Vue from 'vue';
  import Bus from '../../common/js/bus.js';
  export default {
    props: {
      food: {
        type: Object
      }
    },
//  created() {
//    console.log(this.food);
//  },
    methods: {
//      给被选中的商品 添加count属性(该方法只有派生的click事件 才会执行)
      addCart(event) {
//      防止PC端执行两次
//      把原生click事件给阻止 只执行派生的
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
//          给this.food添加一个本身没有的属性 count属性
//          前提需要 import Vue from 'vue';
          Vue.set(this.food, 'count', 1);
//          this.food.count = 1;
        } else {
          this.food.count++;
        }
//    通过$dispatch方法去派发一个事件
        Bus.$emit('cart.add', event.target);
      },
      decreaseCart() {
        //      防止PC端执行两次
        if (!event._constructed) {
          return;
        }
        if (this.food.count > 0) {
          this.food.count--;
        }
      }
    }
  };
</script>


<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      transition: all 0.4s linear
      &.move-enter-active, &.move-leave-active
        opacity: 1
        transform:translate3d(0,0,0)
        .inner
          transform:rotate(0)
      &.move-enter, &.move-leave-active
        opacity: 0
        transform:translate3d(46px,0,0)
        .inner
          transform:rotate(180deg)

      .inner
        display: inline-block
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)
        transition: all 0.4s linear
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147,153,159)
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
</style>

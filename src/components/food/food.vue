<!--商品详情组件-->
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
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" v-show="!food.count || food.count === 0" @click="addFirst">加入购物车
            </div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <!--传值的话连接符需要中划线-->
          <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-enter':rating.rateType === 0,'icon-close':rating.rateType === 1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>


<script type="text/ecmascript-6">
  // 上下滚动js插件
  import BScroll from 'better-scroll';
  // 引入组件之间通信的bus
  import Bus from '../../common/js/bus.js';
  import Vue from 'vue';
  // 引入formateDate方法 带花括号是因为该文件是以
  import {formatDate} from 'common/js/date';
  // 引入增减商品数量组件
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  // 分割样式组件
  import split from 'components/split/split';
  // 评价组件
  import ratingselect from 'components/ratingselect/ratingselect';
  //  const POSITIVE = 0;
  //  const NEFATIVE = 1;
  const ALL = 2;

  export default {
    // 接收从goods组件中传过来 的food
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    created() {
      // 监听子组件(ratingselect)传过来的名为'ratingtype.select'的事件
      Bus.$on('ratingtype.select', target => {
        console.log('cc');
        this.selectType = target;
        // nextTick()在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
        // 异步更新scroll
        this.$nextTick(() => {
          if (this.scroll) {
            this.scroll.refresh();
          }
        });
      });
      // 监听子组件(ratingselect)传过来的名为'content.toggle'的事件
      Bus.$on('content.toggle', target => {
        this.onlyContent = target;
        // 异步更新scroll
        this.$nextTick(() => {
          if (this.scroll) {
            this.scroll.refresh();
          }
        });
      });
    },
    methods: {
      // 设计组件的时候,父组件是可以调用子组件方,但是子组件不能调用父组件的方法
      // 设计组件方法时,一般可以被外部组件调用的就命名成不带下划线的,如果是自己私有的就设置成下划线开头的 例如goods组件下的_initScroll()方法
      show() {
        this.showFlag = true;
        this.selectType = ALL;
        this.onlyContent = false;
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
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
  }
    },
    // 过滤器
    filters: {
      // 把时间戳转换成时间格式
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
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
      position: relative
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

    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7,17,27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color:rgb(77,85,93)
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7,17,27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7,17,27,0.1))
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147,153,159)
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147,153,159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7,17,27)
            .icon-enter,.icon-close
              margin-right: 4px
              line-height: 16px
              font-size: 12px
            .icon-enter
              color: rgb(0,160,220)
            .icon-close
              color: rgb(147,153,159)

        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147,153,159)
</style>

<template>
  <!--bscroll的结构有一个外层的wrapper 里面内容有一个div 会根据里面的内容来判断如果里面的内容超过固定的wrapper就滚动-->
<div class="ratings" ref="ratings">
  <div class="ratings-content">
    <div class="overview">
      <div class="overview-left">
        <h1 class="score">{{seller.score}}</h1>
        <div class="title">综合评分</div>
        <div class="rank">高于周边商家{{seller.rankRate}}%</div>
      </div>
      <div class="overview-right">
        <div class="score-wrapper">
          <span class="title">服务态度</span>
          <star :size="36" :score="seller.seviceScore"></star>
          <span class="score">{{seller.serviceScore}}</span>
        </div>
        <div class="score-wrapper">
          <span class="title">商品评分</span>
          <star :size="36" :score="seller.foodScore"></star>
          <span class="score">{{seller.foodScore}}</span>
        </div>
        <div class="delivery-wrapper">
          <span class="title">送达时间</span>
          <span class="delivery">{{seller.deliveryTime}}分钟</span>
        </div>
      </div>
    </div>
    <split></split>
    <!--传值的话连接符需要中划线-->
    <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="ratings"></ratingselect>
    <div class="rating-wrapper">
      <ul>
        <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in ratings" class="rating-item">
          <div class="avatar">
            <img :src="rating.avatar" width="28" height="28">
          </div>
          <div class="content">
            <h1 class="name">{{rating.username}}</h1>
            <div class="star-wrapper">
              <star :size="24" :score="rating.score"></star>
              <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟</span>
            </div>
            <p class="text">{{rating.text}}</p>
            <div class="recommend" v-show="rating.recommend.length">
              <span :class="{'icon-enter':rating.rateType === 0}"></span>
              <span class="item" v-for="item in rating.recommend" >{{item}}</span>
            </div>
            <div class="time">
              {{rating.rateTime | formatDate}}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  // 上下滚动js插件
  import BScroll from 'better-scroll';
  // 引入组件之间通信的bus
  import Bus from '../../common/js/bus.js';
  // 引入formateDate方法 带花括号是因为该文件是以export function 开始的 文件里面可以定义多个function,如果有多个,我们可以用逗号隔开,例如{formateDate,formateMonth}
  import {formatDate} from 'common/js/date';
  import star from 'components/star/star';
  // 分割样式组件
  import split from 'components/split/split';
  // 评价组件
  import ratingselect from 'components/ratingselect/ratingselect';
  const ALL = 2;
  const ERR_OK = 0;
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
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
      // 获取评论数据
      this.$http.get('/api/ratings').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.ratings = response.data;

          // 等DOM加载完之后调用里面的方法
          // 把需要在dom加载完之后 调用的方法 放里面
          this.$nextTick(() => {
            // 防止报undefined错误
            // 如果页面从rating url直接刷新 会跳转至默认的goods页面 rating的dom会被移除 但是nextTick下的异步执行的函数在goods页面的dom加载完仍会被执行 就会报错
            // 也可把main.js里的默认路由关掉 就不会报错
            if (this.$refs.ratings) {
              this.scroll = new BScroll(this.$refs.ratings, {
                // BScroll 会监听touchStart touchEnd事件 移动端 默认会阻止该事件 导致点击事件不起作用 但是pc端是不会阻止的
                // 该设置使click事件有作用 默认派发了一个点击事件
                click: true
              });
            }
          });
        }
        ;
      });
      // 监听子组件(ratingselect)传过来的名为'ratingtype.select'的事件
      Bus.$on('ratingtype.select', target => {
        console.log('vv');
        console.log(this.scroll);
        this.selectType = target;
        // nextTick()在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
        // 异步更新scroll
        this.$nextTick(() => {
          // 防止报undefined错误
          if (this.scroll) {
            this.scroll.refresh();
          }
        });
      });
      // 监听子组件(ratingselect)传过来的名为'content.toggle'的事件
      Bus.$on('content.toggle', target => {
        this.onlyContent = !target;
        // 异步更新scroll
        this.$nextTick(() => {
          // 防止报undefined错误
          if (this.scroll) {
            this.scroll.refresh();
          }
        });
      });
    },
    methods: {
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
        // 在common/js/date.js中定义
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      star,
      split,
      ratingselect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
.ratings
  position: absolute
  top: 174px
  bottom: 0
  left: 0
  width: 100%
  overflow: hidden
  .overview
    display: flex
    padding: 18px 0
    .overview-left
      flex: 0 0 137px
      padding: 6px 0
      width: 137px
      border-right: 1px solid rgba(7,17,27,0.2)
      text-align: center
      @media only screen and (max-width: 320px)
        flex: 0 0 120px
        width: 120px
      .score
        margin-bottom: 6px
        line-height: 28px
        font-size: 24px
        color: rgb(255,153,0)
      .title
        margin-bottom: 8px
        line-height: 12px
        font-size: 12px
        color: rgb(7,17,27)
      .rank
        line-height: 10px
        font-size: 10px
        color: rgb(147,153,159)
    .overview-right
      flex: 1
      padding: 6px 0 6px 24px
      @media only screen and (max-width: 320px)
        padding-left: 6px
      .score-wrapper
        margin-bottom: 8px
        font-size: 0
        .title
          display: inline-block
          line-height: 18px
          vertical-align: top
          font-size: 12px
          color: rgb(7,17,27)
          // star组件会变更 一个class="star"的div
          // 给star组件追加样式
        .star
          display: inline-block
          /*line-height: 18px*/
          margin: 0 12px
          vertical-align: top
        .score
          display: inline-block
          line-height: 18px
          vertical-align: top
          font-size: 12px
          color: rgb(255,153,0)

      .delivery-wrapper
        font-size: 0
        .title
          line-height: 18px
          font-size: 12px
          color: rgb(7,17,27)
        .delivery
          margin-left: 12px
          font-size: 12px
          color: rgb(147,153,159)
  .rating-wrapper
    padding: 0 18px
    .rating-item
      display: flex
      padding: 18px 0
      border-1px(rgba(7,17,27,0.1))
      .avatar
        flex: 0 0 28px
        width: 28px
        margin-right: 12px
        img
          border-radius: 50%
      .content
        position: relative
        flex:1
        .name
          margin-bottom: 4px
          line-height: 12px
          font-size: 10px
          color: rgb(7,17,27)
        .star-wrapper
          margin-bottom: 6px
          font-size: 0
          .star
            display: inline-block
            margin-right: 6px
            vertical-align: top
          .delivery
            line-height: 12px
            font-size: 10px
            color: rgb(147,153,159)
        .text
          margin-bottom:8px
          line-height: 18px
          color: rgb(7,17,27)
          font-size: 12px
        .recommend
          line-height: 16px;
          font-size: 0
          .icon-enter, .item
            display: inline-block
            margin: 0 8px 4px 0
            font-size: 9px
          .icon-enter
            color: rgb(0,160,220)
          .item
            padding: 0 6px
            border: 1px solid rgba(7,17,27,0.1)
            border-radius: 1px
            color: rgb(147,153,159)
            background: #fff
        .time
          position: absolute
          top: 0
          right: 18px
          line-height: 12px
          font-size: 10px
          color: rgb(147,153,159)

</style>

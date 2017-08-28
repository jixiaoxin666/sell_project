<template>
  <div>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item, index) in goods" class="menu-item" :class="{'current':currentIndex === index} " @click="selectMenu(index,$event)">
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">
            {{item.name}}
          </h1>
          <ul>
            <li @click="selectFood(food, $event)" v-for="food in item.foods" class="food-item border-1px">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">¥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!--把选中的商品传递给购物车组件(select-foods)-->
    <shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
  </div>
  <!--把选中的食物传给food组件-->
  <food :food="selectedFood" ref="food"></food>
  </div>
</template>


<script type="text/ecmascript-6">
  // 上下滚动js插件
  import BScroll from 'better-scroll';
  // 引入购物车组件
  import shopcart from 'components/shopcart/shopcart';
  // 引入增减商品数量组件
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  // 引入商品详情组件
  import food from 'components/food/food';
  const ERR_OK = 0;
  export default{
//    接收传过来的seller 在页面中就可以使用
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      };
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
//          当遍历到最后一个或在一个区间内
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
//      返回被选择的商品信息
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          // 等DOM加载完之后调用里面的方法
          // 把需要在dom加载完之后 调用的方法 放里面
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          });
        }
      });
    },
    methods: {
      selectMenu(index, event) {
//        click事件 一种是默认的 一种是派发的
//        该判断是为了防止执行两次click事件 重复执行该方法 所以把默认的click事件return
//        event 是click事件传过来的event
//        如果是自定义派发的click事件 则event._constructed为true 如果是默认的则值为false
        if (!event._constructed) {
          return;
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300);
        console.log(index);
      },
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          // BScroll 会监听touchStart touchEnd事件 移动端 默认会阻止该事件 导致点击事件不起作用 但是pc端是不会阻止的
          // 该设置使click事件有作用 默认派发了一个点击事件
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          // probeType: 1：滚动的时候会派发scroll事件，会截流。2：滚动的时候实时派发scroll事件，不会截流。 3：除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
          probeType: 3
        });

        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
        console.log(this.listHeight);
      },
      // 选择当前点击的食物
      selectFood(food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        // 调用food子组件里的show()方法
        this.$refs.food.show();
      }
    },
//    注册组件
    components: {
      shopcart,
      cartcontrol,
      food
    }
  };
</script>
s.

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      felx: 0 0 80px
      /*兼容性考虑 不设置width安卓手机会有问题*/
      width: 80px
      background: #f3f5f7
      .menu-item
        /* 1. 垂直居中*/
        display: table
        height: 54px
        width: 56px
        line-height: 14px
        padding: 0 12px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')

        .text
          /*2. display: table-cell 元素必须作为 display: table 的元素的子孙出现*/
          display: table-cell
          width: 56px
          /*3. 在table-cell 中表示垂直居中*/
          vertical-align: middle
          border-1px(rgba(7,17,27,0.1))
          font-size: 12px


    .foods-wrapper
      flex: 1
      .food-list
        .title
          padding-left: 14px
          height: 26px
          line-height: 26px
          border-left: 2px solid #d9dde1
          font-size: 12px
          color: rgb(147,153,159)
          background: #f3f5f7
        .food-item
          display: flex
          margin: 18px
          padding-bottom: 18px
          border-1px(rgba(7,17,27,0.1))
          &:last-child
            border-none()
            margin-bottom: 0
          .icon
            flex: 0 0 57px
            margin-right: 10px
          .content
            flex: 1
            .name
              margin: 2px 0 8px 0
              height: 14px
              line-height: 14px
              font-size:14px
              color: rgb(7,17,27)
            .desc,extra
              line-height: 10px
              font-size: 10px
              color: rgb(147,153,159)
            .desc
              margin-bottom: 8px
              line-height: 12px
            .extra
              line-height: 10px
              .count
                margin-right: 12px
            .price
              font-weight: 700px
              line-height: 24px
              .now
                margin-right: 8px
                font-size: 14px
                color: rgb(240,20,20)
              .old
                text-decoration: line-through
                font-size: 10px
                color: rgb(147,153,159)

            .cartcontrol-wrapper
              position: absolute
              right: 0
              bottom: 12px


</style>

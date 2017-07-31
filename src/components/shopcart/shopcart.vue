<template>
<div class="shopcart">
  <div class="content">
    <div class="content-left">
      <div class="logo-wrapper">
        <div class="logo">
          <i class="icon-丸_pill5"></i>
        </div>
      </div>
      <div class="price">
        78元
      </div>
      <div class="desc">
另需配送费¥{{deliveryPrice}}元
      </div>
    </div>
    <div class="content-right"></div>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
export default{
//  接收变量
  props: {
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.shopcart
  position: fixed
  left: 0
  bottom: 0
  z-index: 50
  width: 100%
  height: 48px
  background: #000
  .content
    display: flex
    background: #141d27
    .content-left
      flex: 1
      .logo-wrapper
        display: inline-block
        position: relative
        top: -10px
        margin: 0 12px
        padding: 6px
        width: 56px
        height: 56px
        /*ie盒模型 Element width = width*/
        box-sizing: border-box
        vetical-align: top
        border-radius: 50%
        background: #141d27
        .logo
          width: 100%
          height: 100%
          border-radius: 50%
          text-align: center
          background: #2b343c
          .icon-丸_pill5
            line-height: 44px
            font-size: 24px
            color: #80858a

      .price
        display: inline-block
        vertical-align: top
        margin-top: 12px
        line-height: 24px
        padding-right: 12px
        box-sizing: border-box
        border-right: 1px solid rgba(255,255,255,0.1)
        font-size: 16px
        font-weight: 700
        color: rgba(255,255,255,0.1)
      .desc
        display: inline-block
        vertical-align: top
        line-height: 24px
        margin: 12px 0 0 12px
        color: rgba(255,255,255,0.1)
        font-size: 10px
    .content-right
      flex: 0 0 105px
      width: 105px

</style>

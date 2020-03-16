<template>
  <div class="hm-navbar">
    <div class="left">
      <img :src="imgSrc" alt="美女图片">
    </div>
    <div class="center">
      <div class="ctop">
        <!-- 对于类名 -->
        <span
          :class="{'sexIcon':true ,'iconfont':true ,'iconxingbienan':iconSex,'iconxingbienv':!iconSex}"
        ></span>
        <span class="netName">{{netName}}</span>
      </div>
      <div class="cbottom">{{time}}</div>
    </div>
    <div class="right iconfont iconjiantou1"></div>
  </div>
</template>
<script>
export default {
  props: {
    netName: {
      type: String,
      required: true
    },
    time: "",
    imgSrc: "",
    iconSex: ""
  }
  // mounted() {
  //   if (this.iconSex == "iconxingbienan" || "nan" || "男") {
  //     this.iconSex = true;
  //   }
  //   if (this.iconSex == "iconxingbienv" || "nv" || "女") {
  //     this.iconSex = false;
  //   }
  // }
};
</script>
 <style lang="less" scoped>
.hm-navbar {
  margin: 20px;
  padding: 10px;
  display: flex;
  border-bottom: 2px solid #ccc;
  justify-content: space-between;

  .left {
    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
  }
  .center {
    margin: 10px;
    flex: 1;
    font-size: 18px;
    color: sandybrown;
  }
  .right {
    width: 50px;
    height: 80px;
    line-height: 80px;
    text-align: right;
  }
}
</style>


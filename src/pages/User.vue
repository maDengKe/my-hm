<template>
  <div class="hm-user">
    <hm-navbar :imgSrc="imgSrc" :netName="netName" :time="time" :iconSex="iconSex"></hm-navbar>
    <van-cell title="我的关注" is-link to="/login" value="关注的用户"/>
    <van-cell title="我的跟帖" is-link arrow-direction value="跟帖/回复"/>
    <van-cell title="我的收藏" is-link arrow-direction value="文章/视频"/>
    <van-cell title="设置" is-link arrow-direction value/>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      imgSrc:
        "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2936363377,3460708172&fm=26&gp=0.jpg",
      netName: "火星网友",
      time: "",
      iconSex: false,
      isLink: true
    };
  },
  mounted() {
    this.time = moment().format("LTS");
  },
  methods: {}
};
</script>

<style lang="less" scoped>
</style>



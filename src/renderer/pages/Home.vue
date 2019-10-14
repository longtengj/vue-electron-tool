<template>
  <div class="home-background theme-color1">
    <Header class="header"></Header>
    <Aside class="aside"></Aside>
    <div class="container">
      <router-view class="clearfix"></router-view>
    </div>
    <Footer class="footer"></Footer>

  </div>
</template>
<script>
  import Aside from "../components/aside/aside.vue";
  import Header from "../components/header/header.vue";
  import Footer from "../components/footer/footer.vue";

  export default {
    data() {
      return {};
    },
    components: {
      Aside,
      Header,
      Footer
    },
    created() {
      // serialport.list((err, ports) => {
      //   ports.forEach(function(port) {
      //     console.log(port.comName);
      //     console.log(port.pnpId);
      //     console.log(port.manufacturer);
      //   });
      // });
    },
    methods: {}
  };
</script>
<style lang="less">
  @import "../assets/less/global.less";

  .home-background {
    position: relative;
    background-color: @bg-color;
    .header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: @view-top;
      line-height: @view-top;
    }
    .aside {
      position: absolute;
      top: @view-top;
      bottom: @view-bottom;
      left: 0;
      width: @view-left;
    }
    .footer {
      position: absolute;
      bottom: 0;
      // left: @view-left;
      left: 0;
      right: 0;
      height: @view-bottom;
      line-height: @view-bottom;
    }
    .container {
      position: absolute;
      top: @view-top;
      right: 0;
      left: @view-left;
      bottom: 0;
      overflow: auto;
      padding: @view-padding;
    }
  }
</style>

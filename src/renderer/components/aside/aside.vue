<style lang="less">
  @import "../../assets/less/global.less";

  aside {
    position: relative;
    background-color: @aside-color;
    box-shadow: 0 0 7px #000;
    .layout-menu-left {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 40px;
    }
    .aside-drop-menu {
      position: absolute;
      height: 40px;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      .ivu-dropdown {
        .ivu-dropdown-rel {
          cursor: pointer;
        }
      }
    }
  }

  .aboutText {
    p {
      line-height: 26px;
    }
  }

  .psText {
    margin-top: 20px;
  }
</style>

<template>
  <aside>
    <Menu ref="menu"
          @on-select="selectMenu"
          theme="dark"
          width="100%"
          :active-name="activeMenuName"
          accordion
          class="layout-menu-left">
      <Menu-item v-for="(menu, index) in MENU"
                 :name="menu.path"
                 :key="index">
        <Tooltip :content="menu.title"
                 placement="right"
                 :delay="800">
          <Icon :type="menu.icon"
                :size="20"></Icon>
        </Tooltip>
      </Menu-item>
    </Menu>
    <div class="aside-drop-menu">
      <Dropdown trigger="click"
                placement="top-start"
                @on-click="dropMenuClick">
        <Icon type="navicon-round"
              :size="26"
              color="white"></Icon>
        <DropdownMenu slot="list">
          <DropdownItem name="serialport">
            <Icon type="ios-hammer-outline"
                  :size="18" />串口设置
          </DropdownItem>
          <DropdownItem name="update">
            <Icon type="ios-cloud-download-outline"
                  :size="18"></Icon>检查更新
          </DropdownItem>
          <DropdownItem name="about">
            <Icon type="ios-person-outline"
                  :size="18" />关于
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <Modal v-model="modalShow"
           title="关于">
      <div class="aboutText">
        <p>
          <strong>XPoctTool {{version}}</strong>
        </p>
        <p>poct类仪器工具</p>
        <p>
          我的邮箱：
          <strong>632098912@qq.com</strong>
        </p>
      </div>
      <div class="psText">
        <p>
          PS：数据与配置文件存放在
          <a href="javascript:void(0)"
             @click="openPath(docDir)">{{docDir}}</a>下。若有重装系统等操作，请记得统一备份。
        </p>
      </div>
      <div slot="footer">
        <Button @click="modalShow = false">关闭</Button>
      </div>
    </Modal>
    <SerialportCompontent @cancel="modalCancel"
                          v-if="serialportModal" />
  </aside>
</template>

<script>
  import SerialportCompontent from './serialport.vue'
  import MENU from "../../router/menu";
  import packageJson from "../../../../package.json";
  import { docDir } from "../../utils/settings";
  import store from "../../store";

  export default {
    data() {
      return {
        MENU,
        activeMenuName: "",
        modalShow: false,
        serialportModal: false,
        version: packageJson.version,
        docDir,
      };
    },
    components: {
      SerialportCompontent
    },
    methods: {
      selectMenu(path) {
        this.$router.push({ path });
      },
      dropMenuClick(name) {
        switch (name) {
          case "serialport":
            console.log("serialport setting");
            this.serialportModal = true;
            break;
          case "update":
            console.log("check update");
            break;
          case "about":
            this.modalShow = true;
            break;
          default:
            null;
        }
      },
      openUrl(url) {
        this.$electron.shell.openExternal(url);
      },
      openPath(path) {
        this.$electron.shell.openItem(path);
      },
      modalCancel(type, reload) {
        this[type + 'Modal'] = false;
      }
    },
    watch: {
      $route() {
        this.activeMenuName = this.$route.path;
        this.$nextTick(() => {
          this.$refs.menu.updateActiveName();
        });
      }
    },
    created() {
      this.activeMenuName = this.$route.path;
      this.$nextTick(() => {
        this.$refs.menu.updateActiveName();
      });
      console.log("store", this.$store.state.Counter.main);
    }
  };
</script>

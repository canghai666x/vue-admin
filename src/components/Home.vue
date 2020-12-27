<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <span>电商管理系统后台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapsed?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--        侧边栏菜单区-->
        <el-menu
            background-color="darkcyan"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened
            :collapse="isCollapsed"
            :collapse-transition="false"
            router
            :default-active="activePath">
          <!--          一级菜单-->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <!--            一级菜单模版-->
            <template slot="title">
              <!--              图标-->
              <i :class="iconsObj[item.id]"></i>
              <!--              文本-->
              <span>{{ item.authName }}</span>
            </template>
            <!--            二级菜单-->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <!--              图标-->
                <i class="el-icon-menu"></i>
                <!--              文本-->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  created() {
    this.getMenuList()
    this.activePath = this.$route.path},
 watch:{
   '$route.path':function (newVal){
     this.activePath=newVal
   }
 },
  data() {
    return {
      menulist: [],
      iconsObj: {
        '125': 'el-icon-user',
        '103': 'el-icon-lock',
        '101': 'el-icon-goods',
        '102': 'el-icon-tickets',
        '145': 'el-icon-data-line',
      },
      isCollapsed: false,
      activePath:''
    }
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
      this.$message({
        message: "退出登陆",
        type: "info",
        duration: 1000
      })
    },
    async getMenuList() {
      const {data: res} = await this.$http.get('menus');
      if (res.meta.status !== 200) return this.$message.error("res.meta.msg")
      this.menulist = res.data;
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    }
  }
}
</script>

<style type="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background: cornflowerblue;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: white;
  font-size: 20px;

}

.el-header > div {
  padding-left: 20px;
}

.el-aside {
  background-color: darkcyan;
}

.el-menu {
  border-right: none;
}

.el-main {
  background-color: aliceblue;
}

.toggle-button {
  background-color: darkcyan;
  text-align: center;
  font-size: 10px;
  line-height: 24px;
  color: white;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
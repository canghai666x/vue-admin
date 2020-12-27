<template>
  <div class="login-container">
    <!--    登陆框-->
    <div class="login_box">
      <!--      头像-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!--      输入表单-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="0px" class="login_form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重制</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //数据绑定表单对象
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      //表单验证规则
      loginRules: {
        username: [
          {require: true, message: "请填写用户名", trigger: "blur"},
          {min: 3, max: 10, message: "长度必须在3到10位", trigger: "blur"}
        ],
        password: [
          {require: true, message: "请输入密码", trigger: "blur"},
          {min: 6, max: 16, message: "长度必须在6到16位", trigger: "blur"}
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const {data: res} = await this.$http.post("login", this.loginForm);
        if(res.meta.status != 200){
          this.$message({
            duration: "1000",
            type: "error",
            message: "登陆失败"
          })
          return;
        }
        this.$message({
          duration: "1000",
          type: "success",
          message: "登陆成功"
        })
        window.sessionStorage.setItem("token",res.data.token);
        this.$router.push("/home")
      });
    }
  }
}

</script>

<style lang="less" scoped>
.login-container {
  background-color: #156666;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background: white;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    padding: 10px;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #eee;
    }
  }
}

.login_form {
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
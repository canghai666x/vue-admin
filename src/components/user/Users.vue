<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model='querryinfo.query' clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑用户" placement="top" :enterable=false>
              <!--            修改按钮-->
              <el-button type="primary" icon="el-icon-edit" circle size="mini"
                         @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除用户" placement="top" :enterable=false>
              <!--            删除按钮-->
              <el-button type="danger" icon="el-icon-delete" circle size="mini"
                         @click="removeUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable=false>
              <!--             分配角色-->
              <el-button type="warning" icon="el-icon-setting" circle size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="querryinfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="querryinfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
    <!--    添加用户对话框-->
    <el-dialog
        title="提示"
        :visible.sync="addDialogVisible"
        width="30%"
        @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRoles" ref="addFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
    </el-dialog>
    <el-dialog title="修改用户" :visible.sync="editDialogVisiable" width="30%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="editDialogVisiable=false">取消</el-button>
      <el-button type="primary" @click="editUserInfo">确定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "users",
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value))
        return callback()
      callback('请输入正确的邮箱号')
    }
    var checkPhone = (rule, value, callback) => {
      const regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regPhone.test(value))
        return callback()
      callback('请输入正确的手机号')
    }
    return {
      querryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisiable: false,
      editForm: {},
      editFormRules: {
        email: [
          {required: true, message: '必须输入邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '必须输入邮箱', trigger: 'blur'},
          {validator: checkPhone, trigger: 'blur'}
        ]
      },
      //添加用户信息
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //添加用户信息验证
      addFormRoles: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '用户名需3-10个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 16, message: '密码需要6-16个字符', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {validator: checkPhone, trigger: 'blue'}
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const {data: res} = await this.$http.get('users', {params: this.querryinfo})
      if (res.meta.status !== 200) return this.$message.error("获取用户列表失败")
      this.userlist = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.querryinfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.querryinfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChanged(userInfo) {
      const {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        this.$message.error("更新用户状态失败")
      }
      this.$message({
        duration: '1000',
        type: 'success',
        message: '更新用户状态'
      })
    },
    editUserInfo() {
      this.$refs.editDialogRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.put('users/' + this.editForm.id,
            {
              email: this.editForm.email,
              mobile: this.editForm.mobile
            })
        if (res.meta.status !== 200)
          return this.$message.error("更新用户信息失败")
      })
      //  关闭对话框
      this.editDialogVisiable = false
      //  刷新列表
      this.getUserList()
      //  提示修改成功
      this.$message.success("更新用户信息成功")
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    async showEditDialog(id) {
      this.editDialogVisiable = true
      const {data: res} = await this.$http.get('users/' + id)
      if (res.meta.status !== 200)
        return this.$message.error("获取用户信息失败")
      this.editForm = res.data
      this.editDialogVisiable = true
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message({
            type: "error",
            message: '添加用户失败',
            duration: 1000
          })
        }
        this.$message({
          type: "success",
          message: '添加用户成功',
          duration: 1000
        })
        this.addDialogVisible = false
        await this.getUserList()
      })
    },
    //删除用户
    async removeUserById(id) {
      //  弹窗询问
      const confirmResult = await this.$confirm('此操作将永久删除该用户，是否确认', '提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err=> err)
      if (confirmResult!=='confirm')
        return this.$message.info('已取消删除')
      const {data:res} = await this.$http.delete('users/'+id)
      if (res.meta.status!==200){
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getUserList()
    }
  }
}
</script>

<style type="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
}

.el-pagination {
  margin-top: 15px;
}

.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
</style>
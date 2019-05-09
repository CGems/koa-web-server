<template>
  <div class="user-manage-container">
    <el-table :data="userList" border style="width: 100%">
      <el-table-column prop="userName" label="用户名"></el-table-column>
      <el-table-column label="角色">
        <template slot-scope="scope">{{roleChart[scope.row.roleName]}}</template>
      </el-table-column>
      <el-table-column prop="parentName" label="邀请人"></el-table-column>
      <el-table-column prop="remark" label="备注" fit></el-table-column>
      <el-table-column label="创建时间" width="160">
        <template slot-scope="scope">{{ scope.row.createdAt | parseTime }}</template>
      </el-table-column>
      <el-table-column label="更新时间" width="160">
        <template slot-scope="scope">{{ scope.row.updatedAt | parseTime }}</template>
      </el-table-column>
      <el-table-column label="操作" width="60">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="small"
            @click="editUserInfo(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="用户管理"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @close="dialogClose"
      width="30%"
    >
      <el-form ref="form" :model="form" label-width="80px" size="small">
        <el-form-item label="用户名">
          <el-input v-model="form.userName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.roleName" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邀请人">
          <el-input v-model="form.parentName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="isBtnLoading" @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="isBtnLoading" @click="updateUserManage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { parseTime } from "Filters";
import { mapState } from "vuex";
export default {
  name: "userManage",
  data() {
    return {
      userList: [],
      editDialogVisible: false,
      form: {},
      isBtnLoading: false,
      roleList: [],
      roleChart: {}
    };
  },
  filters: {
    parseTime
  },
  computed: {
    ...mapState({
      roleName: state => state.user.roleName
    })
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.getUserManageInfo();
      this.getRoleList();
    },
    async getUserManageInfo() {
      this.userList = await this.$api["userGetUserManage"]();
    },
    async getRoleList() {
      let roleList = await this.$api["userGetRoleList"]();
      let isMatch = false;
      const roleChart = {};
      roleList.sort((a, b) => {
        return a.index - b.index;
      });
      roleList = roleList.map(item => {
        roleChart[item.roleName] = item.desc;
        if (!isMatch && item.roleName !== this.roleName) {
          return {
            label: item.desc,
            value: item.roleName,
            disabled: true,
            notShow: true
          };
        } else if (!isMatch && item.roleName === this.roleName) {
          isMatch = true;
          return { label: item.desc, value: item.roleName, disabled: true };
        } else {
          return { label: item.desc, value: item.roleName, disabled: false };
        }
      });
      roleList = roleList.filter(item => {
        return !item.notShow;
      });
      this.roleList = roleList;
      this.roleChart = roleChart;
    },
    editUserInfo(obj) {
      this.form = { ...obj };
      this.editDialogVisible = true;
    },
    dialogClose() {
      this.form = {};
    },
    async updateUserManage() {
      const data = {};
      const userInfo = this.userList.find(item => item.id === this.form.id);
      if (userInfo.roleName !== this.form.roleName) {
        data.roleName = this.form.roleName;
      }
      if (userInfo.remark !== this.form.remark) {
        data.remark = this.form.remark;
      }
      if (Object.keys(data).length === 0) {
        this.$message({ type: "error", message: "无修改" });
        return;
      }
      try {
        this.isBtnLoading = true;
        await this.$api["userUpdateUserManage"](data, {
          url: `/user/manage/${this.form.id}`
        });
        this.getUserManageInfo();
        this.$message({
          type: "success",
          message: "修改成功"
        });
        this.editDialogVisible = false;
      } catch (error) {
        this.$message({
          type: "error",
          message: error.msg
        });
      }
      this.isBtnLoading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.user-manage-container {
  padding: 10px 10px;
}
</style>

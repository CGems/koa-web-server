<template>
  <div class="user-manage-container">
    <el-table :data="userList" border style="width: 100%">
      <el-table-column prop="userName" label="用户名"></el-table-column>
      <el-table-column prop="roleName" label="角色"></el-table-column>
      <el-table-column prop="parentName" label="邀请人"></el-table-column>
      <el-table-column prop="remark" label="备注" fit></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "userManage",
  data() {
    return {
      userList: []
    };
  },
  computed: {
    ...mapState({
      roleName: state => state.user.roleName
    })
  },
  created() {
    this.getUserManageInfo();
  },
  methods: {
    async getUserManageInfo() {
      this.userList = await this.$api["userGetUserManage"]();
    }
  }
};
</script>
<style lang="scss" scoped>
.user-manage-container {
  padding: 10px 10px;
}
</style>

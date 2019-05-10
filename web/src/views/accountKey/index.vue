<template>
  <div class="key-view-container">
    <div class="page-header">
      <el-button type="primary" plain size="small" @click="openDialog">新增</el-button>
    </div>
    <el-table :data="keyData" border style="width: 100%" size="small">
      <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
      <el-table-column prop="title" label="账户描述" fit></el-table-column>
      <el-table-column prop="accessKey" label="Access Key" width="325"></el-table-column>
      <el-table-column prop="secretKey" label="Secret Key" width="325"></el-table-column>
      <el-table-column label="创建时间" width="135">
        <template slot-scope="scope">{{ scope.row.createdAt | parseTime }}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="60">
        <template slot-scope="scope">
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="small"
            @click="deleteKey(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="新增账户"
      :visible.sync="keyConfigDialogVisible"
      @close="dialogClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="form" :model="form" label-width="110px" :rules="rules" size="small">
        <el-form-item label="账户描述" prop="title">
          <el-input v-model="form.title" placeholder="请输入账户描述，方便配置机器人时选取"></el-input>
        </el-form-item>
        <el-form-item label="Access Key" prop="accessKey">
          <el-input v-model="form.accessKey" placeholder="请输入R网账户Access Key"></el-input>
        </el-form-item>
        <el-form-item label="Secret Key" prop="secretKey">
          <el-input v-model="form.secretKey" placeholder="请输入R网账户Secret Key"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="keyConfigDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAccountKey" v-loading="commitLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { parseTime } from "Filters";
export default {
  name: "accountKey",
  data() {
    return {
      keyData: [],
      keyConfigDialogVisible: false,
      commitLoading: false,
      form: {},
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        accessKey: [
          { required: true, message: "请输入Access Key", trigger: "blur" }
        ],
        secretKey: [
          { required: true, message: "请输入Secret Key", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getAccountKey();
  },
  filters: {
    parseTime
  },
  methods: {
    async getAccountKey() {
      this.keyData = await this.$api["robotGetAccountKey"]();
    },
    openDialog() {
      this.keyConfigDialogVisible = true;
    },
    deleteKey(id) {
      this.$confirm("是否永久删除该账号?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        await this.$api["robotDeleteAccountKey"]({},{url:`/robot/accountKey/${id}`})
        this.getAccountKey();
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        // window.globalObj.vbus.$emit("CHANGE_KEY_DATA");
      });
    },
    dialogClose() {
      this.$refs.form.resetFields();
      this.form = {};
    },
    addAccountKey() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.commitLoading = true;
          try {
            const isExistAccessKey = this.keyData.some(key => {
              return key.accessKey === this.form.accessKey;
            });
            if (isExistAccessKey) {
              this.commitLoading = false;
              this.$message({
                type: "error",
                message: "access_key已存在"
              });
              return;
            }
            await this.$api["robotAddAccountKey"](this.form);
            await this.getAccountKey();
            //   window.globalObj.vbus.$emit("CHANGE_KEY_DATA");
            this.commitLoading = false;
            this.keyConfigDialogVisible = false;
          } catch (error) {
            this.commitLoading = false;
            this.$message({
              type: "error",
              message: error.msg
            });
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.key-view-container {
  padding: 10px;
  .page-header {
    margin-bottom: 10px;
  }
}
</style>

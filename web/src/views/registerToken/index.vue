<template>
  <div class="register-token-container">
    <!-- <el-button type="primary" :loading="isBtnLoading" @click="applyRegisterToken">生成注册码</el-button> -->
    <div class="page-header">
      <el-button type="primary" plain size="small" @click="openDialog">新增注册码</el-button>
    </div>
    <el-table :data="allRegisterToken" border style="width: 100%">
      <el-table-column prop="token" label="注册码" width="150"></el-table-column>
      <el-table-column prop="desc" label="账户描述" fit></el-table-column>
      <el-table-column prop="status" label="状态" width="70"></el-table-column>
      <el-table-column label="创建时间" width="160">
        <template slot-scope="scope">{{ scope.row.createdAt | parseTime }}</template>
      </el-table-column>
      <el-table-column label="过期时间" width="160">
        <template slot-scope="scope">{{ scope.row.expireAt | parseTime }}</template>
      </el-table-column>
      <el-table-column prop="applyUserName" label="申请者" width="100"></el-table-column>
      <el-table-column prop="useUserName" label="使用者" width="100"></el-table-column>
      <el-table-column label="使用时间" width="160">
        <template slot-scope="scope" v-if="scope.row.isUsed">{{ scope.row.updatedAt | parseTime}}</template>
        <template v-else></template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="60">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status!=='已使用'"
            type="danger"
            icon="el-icon-delete"
            circle
            size="small"
            @click="deleteRegisterToken(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="新增注册码"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @close="dialogClose"
      width="30%"
    >
      <template v-if="isApplyNotSend">
        <el-form
          ref="form"
          :model="form"
          label-width="100px"
          :rules="rules"
          size="small"
          @submit.native.prevent
        >
          <el-form-item label="注册码描述" prop="desc">
            <el-input v-model.trim="form.desc" placeholder="请填写新增注册码原因描述"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button :loading="isBtnLoading" @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" :loading="isBtnLoading" @click="applyRegisterToken">确 定</el-button>
        </span>
      </template>
      <template v-else>
        <el-row class="register-token-result-row">
          <el-col :span="4" class="label">注册码</el-col>
          <el-col :span="20" class="value">{{applyResult.token}}</el-col>
        </el-row>
        <el-row class="register-token-result-row">
          <el-col :span="4" class="label">过期时间</el-col>
          <el-col :span="20" class="value">{{applyResult.expireAt|parseTime}}</el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { parseTime } from "Filters";
import moment from "moment";
export default {
  name: 'registerToken',
  data() {
    return {
      isBtnLoading: false,
      dialogVisible: false,
      allRegisterToken: [],
      form: { desc: "" },
      rules: {
        desc: [
          {
            required: true,
            message: "请填写新增注册码原因描述",
            trigger: "blur"
          }
        ]
      },
      isApplyNotSend: true,
      applyResult: {}
    };
  },
  created() {
    this.getAllRegisterToken();
  },
  filters: {
    parseTime
  },
  methods: {
    async applyRegisterToken() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.isBtnLoading = true;
          try {
            this.applyResult = await this.$api["userApllyRegisterToken"]({
              desc: this.form.desc
            });
            this.isBtnLoading = false;
            this.getAllRegisterToken();
            this.$message({ type: "success", message: "新增成功" });
            this.isApplyNotSend = false;
          } catch (error) {
            this.isBtnLoading = false;
            this.$message({ type: "error", message: error.msg });
          }
        } else {
          return false;
        }
      });
    },
    async getAllRegisterToken() {
      const allRegisterToken = await this.$api["userGetAllRegisterToken"]();
      allRegisterToken.forEach(item => {
        item.status = item.isUsed
          ? "已使用"
          : moment(item.expireAt).isAfter(new Date())
          ? "未使用"
          : "已过期";
      });
      this.allRegisterToken = allRegisterToken;
    },
    openDialog() {
      this.dialogVisible = true;
    },
    dialogClose() {
      this.$refs.form && this.$refs.form.resetFields();
      this.form = {
        desc: ""
      };
      this.isApplyNotSend = true;
      this.applyResult = {};
    },
    async deleteRegisterToken(id) {
      try {
        await this.$api["userDeleteRegisterToken"](
          {},
          {
            url: `/user/registerToken/${id}`
          }
        );
        this.getAllRegisterToken();
        this.$message({ type: "success", message: "删除成功" });
      } catch (error) {
        this.$message({ type: "error", message: error.msg });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.register-token-container {
  padding: 10px 10px;
  .page-header {
    padding-bottom: 10px;
  }
  .register-token-result-row {
    height: 30px;
    line-height: 30px;
    .label {
      font-size: 16px;
    }
    .value {
      font-size: 14px;
    }
  }
}
</style>

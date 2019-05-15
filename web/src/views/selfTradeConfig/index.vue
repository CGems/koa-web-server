<template>
  <div class="config-view-container">
    <div class="page-header">
      <el-button type="primary" plain size="small" @click="openDialog">新增</el-button>
      <el-button v-if="marketsOptions.length===0" type="primary" plain size="small" @click="init">刷新</el-button>
    </div>
    <el-table :data="selfConfigData" border style="width: 100%" size="small">
      <el-table-column prop="accountEmail" label="账户" fit></el-table-column>
      <el-table-column prop="market" label="市场" width="110">
        <template
          slot-scope="scope"
        >{{ `${scope.row.market[1].toUpperCase()} / ${scope.row.market[0].toUpperCase()}` }}</template>
      </el-table-column>
      <el-table-column prop="minV" label="最小成交量" width="120">
        <template slot-scope="scope">{{ `${scope.row.minV} ${scope.row.market[1].toUpperCase()}` }}</template>
      </el-table-column>
      <el-table-column prop="maxV" label="最大成交量" width="120">
        <template slot-scope="scope">{{ `${scope.row.maxV} ${scope.row.market[1].toUpperCase()}` }}</template>
      </el-table-column>
      <el-table-column prop="minI" label="最小成交间隔(秒)" fit></el-table-column>
      <el-table-column prop="maxI" label="最大成交间隔(秒)" fit></el-table-column>
      <el-table-column prop="selfPriceFixed" label="自定义价格小数位数" fit></el-table-column>
      <el-table-column prop="selfAmountFixed" label="自定义数量小数位数" fit></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status===''" type="info" disable-transitions>未运行</el-tag>
          <el-tag v-else-if="scope.row.status==='running'" type="success" disable-transitions>运行中</el-tag>
          <el-tag v-else-if="scope.row.status==='stop'" type="info" disable-transitions>已停止</el-tag>
          <el-tooltip
            v-else-if="scope.row.status==='error'"
            effect="dark"
            :content="scope.row.msg"
            placement="bottom-start"
          >
            <el-tag type="danger" disable-transitions>发生错误</el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- <el-table-column label="创建时间" width="135">
            <template slot-scope="scope">{{ scope.row.createdAt | parseTime }}</template>
          </el-table-column>
          <el-table-column label="更新时间" width="135">
            <template slot-scope="scope">{{ scope.row.updatedAt | parseTime }}</template>
      </el-table-column>-->
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <template
            v-if="scope.row.status===''||scope.row.status==='stop'||scope.row.status==='error'"
          >
            <el-button
              :loading="scope.row.isSendRunCommand"
              type="primary"
              icon="el-icon-edit"
              circle
              size="small"
              @click="editConfig(scope.row)"
            ></el-button>
            <el-button
              :loading="scope.row.isSendRunCommand"
              type="danger"
              icon="el-icon-delete"
              circle
              size="small"
              @click="deleteConfig(scope.row.id)"
            ></el-button>
            <el-button
              :loading="scope.row.isSendRunCommand"
              style="width:73px;"
              size="mini"
              type="primary"
              @click="runConfig(scope.row.type,scope.row.id)"
            >启动</el-button>
          </template>
          <template v-else-if="scope.row.status==='running'">
            <el-button
              :loading="scope.row.isSendStopCommand"
              style="width:73px;"
              size="mini"
              type="primary"
              @click="stopConfig(scope.row.type,scope.row.id)"
            >停止</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="selfForm.id?'自成交配置修改':'新增自成交配置'"
      :visible.sync="selfConfigDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      class="config-dialog"
      width="900px"
    >
      <el-form
        :model="selfForm"
        ref="selfForm"
        :rules="selfFormRules"
        label-width="155px"
        label-position="left"
        size="small"
      >
        <el-form-item label="账户" prop="account">
          <el-select v-model="selfForm.account" placeholder="请选择账户" style="width:100%">
            <el-option v-for="item in keyData" :key="item.id" :label="item.email" :value="item.id">
              <span style="float: left">{{ item.email }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{
                item.title
                }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市场" prop="market">
          <el-cascader
            placeholder="请选择市场"
            style="width:100%"
            expand-trigger="hover"
            :options="marketsOptions"
            v-model="selfForm.market"
            filterable
            :show-all-levels="false"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="最小成交量" prop="minV">
          <el-input v-model="selfForm.minV" type="number"></el-input>
        </el-form-item>
        <el-form-item label="最大成交量" prop="maxV">
          <el-input v-model="selfForm.maxV" type="number"></el-input>
        </el-form-item>
        <el-form-item label="最小成交间隔(秒)" prop="minI">
          <el-input v-model="selfForm.minI" type="number"></el-input>
        </el-form-item>
        <el-form-item label="最大成交间隔(秒)" prop="maxI">
          <el-input v-model="selfForm.maxI" type="number"></el-input>
        </el-form-item>
        <el-form-item label="自定义价格小数位数" prop="selfPriceFixed">
          <el-input v-model="selfForm.selfPriceFixed" type="number"></el-input>
        </el-form-item>
        <el-form-item label="自定义数量小数位数" prop="selfAmountFixed">
          <el-input v-model="selfForm.selfAmountFixed" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeSelfDialog">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateSelfForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { BigNumber } from "bignumber.js";
import { parseTime } from "Filters";
import axios from "axios";
export default {
  name: "selfTradeConfig",
  data() {
    const validatorSelfMarket = (rule, value, callback) => {
      if (this.selfForm.minV) {
        this.$refs.selfForm.validateField("minV");
      }
      if (this.selfForm.maxV) {
        this.$refs.selfForm.validateField("maxV");
      }
      callback();
    };
    const validatorSelfMinV = (rule, value, callback) => {
      if (!this.selfForm.market) {
        this.$refs.selfForm.validateField("market");
        this.selfForm.minV && (this.selfForm.minV = "");
      } else {
        if (value === undefined || value === "") {
          callback(new Error("请输入最小成交量!"));
        } else {
          const currentMarketAmountFixed = this.markets[
            this.selfForm.market[0]
          ][this.selfForm.market[1]].ask.fixed;
          const minVCanTrade = new BigNumber(0.1).pow(currentMarketAmountFixed).toFixed(currentMarketAmountFixed,1);
          if (new BigNumber(minVCanTrade).isGreaterThan(value)) {
            callback(
              new Error(`最小成交量应大于或等于${minVCanTrade.toString()}`)
            );
            return;
          }
          const decimal = parseFloat(value)
            .toString()
            .split(".")[1];
          if (decimal && decimal.length > currentMarketAmountFixed) {
            callback(
              new Error(`小数位数应该小于等于${currentMarketAmountFixed}`)
            );
          } else if (this.selfForm.maxV) {
            this.$refs.selfForm.validateField("maxV");
            callback();
          } else {
            callback();
          }
        }
      }
    };
    const validatorSelfMaxV = (rule, value, callback) => {
      if (!this.selfForm.market) {
        this.$refs.selfForm.validateField("market");
        this.selfForm.maxV && (this.selfForm.maxV = "");
      } else {
        if (value === undefined || value === "") {
          callback(new Error("请输入最大成交量!"));
        } else {
          const currentMarketAmountFixed = this.markets[
            this.selfForm.market[0]
          ][this.selfForm.market[1]].ask.fixed;
          const decimal = parseFloat(value)
            .toString()
            .split(".")[1];
          if (decimal && decimal.length > currentMarketAmountFixed) {
            callback(
              new Error(`小数位数应该小于等于${currentMarketAmountFixed}`)
            );
          } else if (this.selfForm.minV && +this.selfForm.minV >= +value) {
            callback(new Error("最大成交量应大于最小成交量!"));
          } else {
            callback();
          }
        }
      }
    };
    const validatorSelfMinI = (rule, value, callback) => {
      if (value === undefined || value === "") {
        callback(new Error("请输入最小成交间隔!"));
      } else if (value < 1) {
        callback(new Error("最小间隔应大于1秒!"));
      } else {
        if (this.selfForm.maxI) {
          this.$refs.selfForm.validateField("maxI");
          callback();
        } else {
          callback();
        }
      }
    };
    const validatorSelfMaxI = (rule, value, callback) => {
      if (value === undefined || value === "") {
        callback(new Error("请输入最大成交间隔!"));
      } else {
        if (this.selfForm.minI && +this.selfForm.minI >= +value) {
          callback(new Error("最大成交间隔应大于最小成交间隔!"));
        } else {
          callback();
        }
      }
    };

    const validatorSelfPriceFixed = (rule, value, callback) => {
      if (!this.selfForm.market) {
        this.$refs.selfForm.validateField("market");
        this.selfForm.selfPriceFixed && (this.selfForm.selfPriceFixed = "");
      } else {
        if (value !== undefined && value !== "") {
          const currentMarketPriceFixed = this.markets[this.selfForm.market[0]][
            this.selfForm.market[1]
          ].bid.fixed;
          if (value > currentMarketPriceFixed || value < 0) {
            callback(
              new Error(`应该大于等于0，小于等于${currentMarketPriceFixed}`)
            );
          } else {
            callback();
          }
        } else {
          callback();
        }
      }
    };

    const validatorSelfAmountFixed = (rule, value, callback) => {
      if (!this.selfForm.market) {
        this.$refs.selfForm.validateField("market");
        this.selfForm.selfAmountFixed && (this.selfForm.selfAmountFixed = "");
      } else {
        if (value !== undefined && value !== "") {
          const currentMarketAmountFixed = this.markets[
            this.selfForm.market[0]
          ][this.selfForm.market[1]].ask.fixed;
          if (value > currentMarketAmountFixed || value < 0) {
            callback(
              new Error(`应该大于等于0，小于等于${currentMarketAmountFixed}`)
            );
          } else {
            callback();
          }
        } else {
          callback();
        }
      }
    };
    return {
      selfConfigData: [],
      selfConfigDialogVisible: false,
      selfForm: {},
      selfFormRules: {
        account: [
          {
            required: true,
            message: "请选择账户"
          }
        ],
        market: [
          {
            required: true,
            message: "请选择市场"
          },
          {
            validator: validatorSelfMarket,
            trigger: "change"
          }
        ],
        minV: [
          {
            validator: validatorSelfMinV,
            trigger: "blur"
          }
        ],
        maxV: [
          {
            validator: validatorSelfMaxV,
            trigger: "blur"
          }
        ],
        minI: [
          {
            validator: validatorSelfMinI,
            trigger: "blur"
          }
        ],
        maxI: [
          {
            validator: validatorSelfMaxI,
            trigger: "blur"
          }
        ],
        selfPriceFixed: [
          {
            validator: validatorSelfPriceFixed,
            trigger: "blur"
          }
        ],
        selfAmountFixed: [
          {
            validator: validatorSelfAmountFixed,
            trigger: "blur"
          }
        ]
      },
      keyData: [],
      marketsOptions: [],
      markets: {},
      shouldShowHistoryId: "",
      exchangeArr: { binance: "币安" }
    };
  },
  filters: {
    parseTime
  },
  async created() {
    this.init();
  },
  methods: {
    robotFromServer(event, data) {
      const { id, configType, res } = data;
      const index = this[`${[configType]}ConfigData`].findIndex(item => {
        return item.id === id;
      });
      switch (res.type) {
        case "running":
          this.$message({
            type: "success",
            message: "启动成功"
          });
          this.addHistory(id, "启动成功", res.timestamp, "log");
          this[`${[configType]}ConfigData`].splice(index, 1, {
            ...this[`${[configType]}ConfigData`][index],
            isSendRunCommand: false,
            status: "running",
            msg: ""
          });
          break;
        case "stop":
          this.$message({
            type: "success",
            message: "停止成功"
          });
          this.addHistory(id, "停止成功", res.timestamp, "log");
          this[`${[configType]}ConfigData`].splice(index, 1, {
            ...this[`${[configType]}ConfigData`][index],
            isSendStopCommand: false,
            status: "stop",
            msg: ""
          });
          break;
        case "log":
          this.addHistory(id, res.msg, res.timestamp, "log");
          break;
        case "error":
          this[`${[configType]}ConfigData`].splice(index, 1, {
            ...this[`${[configType]}ConfigData`][index],
            isSendStopCommand: false,
            status: "error",
            msg: res.msg
          });
          this.$message({
            type: "error",
            message: res.msg
          });
          this.addHistory(id, res.msg, res.timestamp, "error");
          break;
      }
    },
    async init() {
      await Promise.all([this.getAccount(), this.getMarkets()]);
      this.getAllRobotsConfig();
    },
    openDialog() {
      this.selfConfigDialogVisible = true;
    },
    async getAllRobotsConfig() {
      const data = await this.$api["robotGetSelfTradeConfig"]();
      this.selfConfigData = data;
    },
    async getAccount() {
      this.keyData = await this.$api["robotGetAccountKey"]();
      return Promise.resolve();
    },
    async getMarkets() {
      try {
        const { data } = await axios.get(
          "https://api.58token.cn/api/v1/markets"
        );
        const markets = {};
        const marketsOptions = [];
        data.forEach(item => {
          if (item.visible) {
            if (!markets[item.quote_unit]) {
              markets[item.quote_unit] = {};
            }
            markets[item.quote_unit][item.base_unit] = item;
          }
        });
        for (let [i, v] of Object.entries(markets)) {
          const children = [];
          const length = marketsOptions.push({
            value: i,
            label: i
          });
          for (let childI of Object.keys(v)) {
            children.push({
              value: childI,
              label: `${childI}_${i}`
            });
          }
          marketsOptions[length - 1].children = children;
        }
        this.markets = markets;
        this.marketsOptions = marketsOptions;
        return Promise.resolve();
      } catch (error) {
        console.dir(error);
        if (!this.marketsOptions.length) {
          this.$message({
            type: "error",
            message: "获取市场信息失败，请点击重试"
          });
        }
      }
    },
    closeSelfDialog() {
      this.selfForm = {};
      this.$refs.selfForm.resetFields();
      this.selfConfigDialogVisible = false;
    },
    // closeFollowDialog() {
    //   this.followForm = {};
    //   this.$refs.followForm.resetFields();
    //   this.followConfigDialogVisible = false;
    // },
    saveOrUpdateSelfForm() {
      this.$refs.selfForm.validate(async valid => {
        if (valid) {
          if (this.selfForm.id) {
            // await updateSingleRobotConfig(this.selfForm.id, {
            //   status: "",
            //   msg: "",
            //   type: "self",
            //   account: this.selfForm.account,
            //   market: this.selfForm.market,
            //   minV: this.selfForm.minV,
            //   maxV: this.selfForm.maxV,
            //   minI: this.selfForm.minI,
            //   maxI: this.selfForm.maxI,
            //   selfPriceFixed: this.selfForm.selfPriceFixed,
            //   selfAmountFixed: this.selfForm.selfAmountFixed
            // });
            this.$message({
              type: "success",
              message: "修改成功"
            });
            await this.getAllRobotsConfig();
            if (this.runHistory[this.selfForm.id]) {
              this.$delete(this.runHistory, this.selfForm.id);
            }
          } else {
            const obj = { ...this.selfForm };
            obj.market = [...obj.market].reverse().join("_");
            await this.$api["robotAddSelfTradeConfig"]({
              status: "",
              msg: "",
              ...obj
            });
            this.$message({
              type: "success",
              message: "添加成功"
            });
            await this.getAllRobotsConfig();
          }
          this.closeSelfDialog();
        } else {
          return false;
        }
      });
    }
    // deleteConfig(id) {
    //   this.$confirm("是否永久删除该配置?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   }).then(async () => {
    //     await deleteRobotConfig(id);
    //     this.$message({
    //       type: "success",
    //       message: "删除成功!"
    //     });
    //     if (this.runHistory[id]) {
    //       this.$delete(this.runHistory, id);
    //     }
    //     this.getAllRobotsConfig();
    //   });
    // },
    // editConfig(data) {
    //   this[`${data.type}Form`] = { ...data };
    //   this[`${data.type}ConfigDialogVisible`] = true;
    // },
    // runConfig(type, id) {
    //   const index = this[`${type}ConfigData`].findIndex(item => {
    //     return item.id === id;
    //   });
    //   this[`${type}ConfigData`].splice(index, 1, {
    //     ...this[`${type}ConfigData`][index],
    //     isSendRunCommand: true
    //   });
    //   const account = this.keyData.find(key => {
    //     return key.id === this[`${type}ConfigData`][index].account;
    //   });
    //   const currentMarket = this.markets[
    //     this[`${type}ConfigData`][index].market[0]
    //   ][this[`${type}ConfigData`][index].market[1]];
    //   const commandData = {
    //     id: id,
    //     type,
    //     config: {
    //       ...this[`${type}ConfigData`][index],
    //       priceFix: this[`${type}ConfigData`][index].selfPriceFixed?this[`${type}ConfigData`][index].selfPriceFixed:currentMarket.bid.fixed,
    //       volumeFix: this[`${type}ConfigData`][index].selfAmountFixed?this[`${type}ConfigData`][index].selfAmountFixed:currentMarket.ask.fixed
    //     },
    //     accountObj: account
    //   };
    //   ipc2promise.send("robotFromWeb", {
    //     command: "run",
    //     data: commandData
    //   });
    // },
    // stopConfig(type, id) {
    //   const index = this[`${type}ConfigData`].findIndex(item => {
    //     return item.id === id;
    //   });
    //   this[`${type}ConfigData`].splice(index, 1, {
    //     ...this[`${type}ConfigData`][index],
    //     isSendStopCommand: true
    //   });
    //   ipc2promise.send("robotFromWeb", {
    //     command: "stop",
    //     data: {
    //       id: id,
    //       type
    //     }
    //   });
    // },
  }
};
</script>
<style lang="scss" scoped>
.config-view-container {
  padding: 10px;
  position: relative;
  .page-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .new-config-btn {
    position: absolute;
    top: 34px;
    right: 65px;
    font-size: 28px;
  }
}
</style>
<style lang="scss">
.config-view-container {
  .run-history-dialog {
    .el-dialog__body {
      padding: 10px 20px;
    }
    .el-scrollbar {
      height: 100%;
    }
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
}
</style>
const sequelize = require('./../config/db');
const User = sequelize.import('./../schema/user.js');
const AccountKey = sequelize.import('./../schema/accountKey.js');
const SelfTradeConfig = sequelize.import('./../schema/selfTradeConfig.js');
User.hasMany(AccountKey, { foreignKey: 'userId', constraints: false })
User.hasMany(SelfTradeConfig, { foreignKey: 'userId', constraints: false });
AccountKey.hasMany(SelfTradeConfig, { foreignKey: 'accountKeyId', constraints: false })
AccountKey.sync({ force: false });
SelfTradeConfig.sync({ force: false });
module.exports = class robotModule {
    // 获取R网账户Key
    static async getAccountKeyByUserId(userId) {
        return await AccountKey.findAll({ where: { userId } })
    }
    // 新增R网账户Key
    static async addAccountKey(accountKey) {
        return await AccountKey.create(accountKey)
    }
    // 删除R网账户Key
    static async deleteAccountKey(id, userId) {
        return await AccountKey.destroy({ where: { id, userId } })
    }
    // 获取自成交配置
    static async getSelfTradeConfigByUserId(userId) {
        return await SelfTradeConfig.findAll({ where: { userId } })
    }
}
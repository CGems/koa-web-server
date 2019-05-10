const sequelize = require('./../config/db');
const AccountKey = sequelize.import('./../schema/accountKey.js');
const User = sequelize.import('./../schema/user.js');
User.hasMany(AccountKey, { foreignKey: 'userId', constraints: false })
AccountKey.sync({ force: false });

module.exports = class robotModule {
    static async getAccountKeyByUserId(userId) {
        return await AccountKey.findAll({ where: { userId } })
    }
    static async addAccountKey(accountKey){
        return await AccountKey.create(accountKey)
    }
}
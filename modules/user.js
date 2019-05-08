const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = require('./../config/db')
const User = sequelize.import('./../schema/user.js');
const Role = sequelize.import('./../schema/role.js');
const Token = sequelize.import('./../schema/token.js');
const RegisterToken = sequelize.import('./../schema/registerToken.js');

Role.sync({ force: false }).then(() => {
    Role.findOne({ where: { roleName: 'user' }, attributes: ['roleName'] }).then(result => {
        if (result === null) {
            Role.bulkCreate([{ roleName: 'user', desc: '普通用户' }, { roleName: 'admin', desc: '管理员' }, { roleName: 'superAdmin', desc: '超级管理员' }])
        }
    })
});
User.belongsTo(Role, { foreignKey: 'roleId', constraints: false });
Role.hasMany(User, { foreignKey: 'roleId', constraints: false });
User.hasOne(Token, { foreignKey: 'userId', constraints: false });
Token.belongsTo(User, { foreignKey: 'userId', constraints: false });
User.hasMany(RegisterToken, { foreignKey: 'applyUserId', constraints: false });
RegisterToken.belongsTo(User, { foreignKey: 'applyUserId', constraints: false });
User.sync({ force: false }).then(() => {
    User.findCreateFind({ defaults: { userName: 'admin', password: '$2a$10$y1ifXaN7gN4OP52zf8z1NeEY1C8wBoSdM4eWhFN4zmxMUxIZ73r.i', roleId: '3' }, where: { userName: 'admin' } })
});
Token.sync({ force: false });
RegisterToken.sync({ force: false });
module.exports = class userModule {
    // 根据参数查找用户信息(能查到密码)
    static async findUserByUserName(userName) {
        return await User.unscoped().findOne({
            where: {
                userName
            },
            include: [Role]
        })
    }
    // 根据参数查找角色信息
    static async findUserByIds(ids) {
        return await User.findAll({
            where: {
                id: {
                    [Op.in]: ids
                }
            },
            attributes: ['userName', 'id']
        })
    }
    // 根据参数查找角色信息
    static async findRoleByRoleName(roleName) {
        return await Role.findOne({
            where: {
                roleName
            }
        })
    }
    // 创建登录令牌
    static async createLoginToken(token, expireAt, userId) {
        await userModule.deleteLoginToken(userId)
        return await Token.create({
            token,
            userId,
            expireAt
        })
    }
    static async deleteLoginToken(userId) {
        return await Token.destroy({
            where: {
                userId
            }
        })
    }
    // 根据参数查找令牌信息
    static async findTokenByParam(param) {
        return await Token.findOne({
            where: {
                ...param
            }
        })
    }
    // 创建注册码
    static async createRegisterToken(applyUserId, token, expireAt, desc) {
        return await RegisterToken.create({ applyUserId, token, expireAt, desc, isUsed: false })
    }
    // 获取当前用户创建的注册码`
    static async getRegisterTokenByUser(userId) {
        return await RegisterToken.findAll({
            order: [['id', 'DESC']], where: { applyUserId: userId }
        })
    }
    // 获取所有用户创建的注册码
    static async getAllRegisterToken() {
        return await RegisterToken.findAll({
            order: [['id', 'DESC']]
        })
    }
    // 删除未使用或过期注册码
    static async deleteRegisterToken(id) {
        return await RegisterToken.destroy({ where: { id } })
    }
    // 根据注册码id查找注册码
    static async getRegisterTokenById(id, t) {
        return await RegisterToken.findOne({ where: { id } })
    }
    // 根据注册码id查找注册码
    static async getRegisterTokenByToken(token) {
        return await RegisterToken.findOne({ where: { token } })
    }
    // 使用注册码
    static async useRegisterToken(id, useUserId) {
        return await RegisterToken.update({ useUserId, isUsed: true }, { where: { id } })
    }
}
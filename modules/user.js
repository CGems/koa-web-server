const sequelize = require('./../config/db')
const User = sequelize.import('./../schema/user.js');
const Role = sequelize.import('./../schema/role.js');
const Token = sequelize.import('./../schema/token.js');
Role.sync({ force: false }).then(() => {
    Role.findOne({ where: { roleName: 'user' }, attributes: ['roleName'] }).then(result => {
        if (result === null) {
            Role.bulkCreate([{ roleName: 'user', desc: '普通用户' }, { roleName: 'admin', desc: '管理员' }, { roleName: 'superAdmin', desc: '超级管理员' }])
        }
    })
});
User.belongsTo(Role);
Role.hasMany(User, { foreignKey: 'roleId' });
User.hasOne(Token, { foreignKey: 'userId' });
Token.belongsTo(User);
User.sync({ force: false }).then(() => {
    User.findOrCreate({ defaults: { userName: 'wwh', password: '$2a$10$y1ifXaN7gN4OP52zf8z1NeEY1C8wBoSdM4eWhFN4zmxMUxIZ73r.i', roleId: '3' }, where: { userName: 'wwh' } })
});
Token.sync({ force: false });

module.exports = class userModule {
    // 根据参数查找用户信息
    static async findUserByParam(param) {
        return await User.findOne({
            where: {
                ...param
            },
            include: [Role]
        })
    }
    // 根据参数查找角色信息
    static async findRoleByParam(param) {
        return await Role.findOne({
            where: {
                ...param
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
}
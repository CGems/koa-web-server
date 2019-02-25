const sequelize = require('./../config/db')
const User = sequelize.import('./../schema/user.js');
const Role = sequelize.import('./../schema/role.js');
const Token = sequelize.import('./../schema/token.js');

User.belongsTo(Role);
Role.hasMany(User);
User.sync({ force: false });
Role.sync({ force: false });
Token.sync({ force: false });

module.exports = class {
    // 根据用户名查找用户
    static async findUserByName(userName) {
        return await User.findOne({
            where: {
                userName
            }
        })
    }
    // 根据角色名查找角色信息
    static async findRoleByRoleName(roleName) {
        return await Role.findOne({
            where: {
                roleName
            }
        })
    }
    // 根据角色表id查找角色信息
    static async findRoleByRoleId(id) {
        return await Role.findOne({
            where: {
                id
            }
        })
    }
    static async createLoginToken(token, expireAt, userId) {
        await Token.destroy({
            where: {
                userId
            }
        })
        return await Token.create({
            token,
            userId,
            expireAt
        })
    }
    static async findUserIdByToken(token) {
        return await Token.findOne({
            where: {
                token
            }
        })
    }
    static async findTokenByUserId(userId) {
        return await Token.findOne({
            where: {
                userId
            }
        })
    }
}
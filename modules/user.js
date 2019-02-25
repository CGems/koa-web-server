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
    static async findRoleIdByRoleName(roleName) {
        return await Role.findOne({
            where: {
                roleName
            }
        })
    }
    static async findUserIdByToken(token) {
        return await Token.findOne({
            where: {
                token
            }
        })
    }
    static async createLoginToken(token, expireAt, userId) {
        return await Token.create({
            token,
            userId,
            expireAt
        })
    }
}
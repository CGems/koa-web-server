const sequelize = require('./../config/db')
const User = sequelize.import('./../schema/user.js');
const Role = sequelize.import('./../schema/role.js');
User.sync({ force: false });
Role.sync({ force: false });
module.exports = class {
    static async create({ username, password }) {
        return await User.create({
            username, password
        })
    }
    static async findUserByName(username) {
        return await User.findOne({
            where: {
                username
            }
        })
    }
}
const sequelize = require('./../config/db')
const User = sequelize.import('./../schema/user.js');
User.sync({ force: false });
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
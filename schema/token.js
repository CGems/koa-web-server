const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('token', {
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        expireAt: {
            type: DataTypes.DATE,
            allowNull: false,
            get() {
                return moment(this.getDataValue('expireAt')).format('YYYY-MM-DD HH:mm:ss')
            }
        }
    })
}
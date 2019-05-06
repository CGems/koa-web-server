const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('role', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        roleName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        desc: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}
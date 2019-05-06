const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('token', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
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
            allowNull: false
        }
    })
}
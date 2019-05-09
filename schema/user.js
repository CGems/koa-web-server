const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        parentId: {
            type: DataTypes.INTEGER
        },
        remark: {
            type: DataTypes.STRING
        }
    }, {
            defaultScope: {
                attributes: {
                    exclude: ['password']
                }
            }
        })
}
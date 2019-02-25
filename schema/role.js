const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('role', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        roleName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        desc: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDateValue('createdAt')).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        updatedAt: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDateValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss')
            }
        }
    })
}
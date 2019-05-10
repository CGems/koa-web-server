module.exports = (sequelize, DataTypes) => {
    return sequelize.define('accountKey', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        accessKey: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        secretKey: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}
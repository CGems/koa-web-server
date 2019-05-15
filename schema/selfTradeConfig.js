module.exports = (sequelize, DataTypes) => {
    return sequelize.define('selfTradeConfig', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        market: {
            type: DataTypes.STRING,
            allowNull: false
        },
        minV: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        maxV: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        minI: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        maxI: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        selfPriceFixed: {
            type: DataTypes.INTEGER
        },
        selfAmountFixed: {
            type: DataTypes.INTEGER
        },
        status: {
            type: DataTypes.ENUM,
            values: ['notstarted', 'running', 'stopping']
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        accountKeyId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    })
}
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('registerToken', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            comment: '注册码'
        },
        applyUserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '申请人ID'
        },
        useUserId: {
            type: DataTypes.INTEGER,
            comment: '使用人ID'
        },
        isUsed: {
            type: DataTypes.BOOLEAN,
            comment: '是否已使用'
        },
        desc: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: '申请描述'
        },
        expireAt: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: '过期时间'
        }
    } ,
    // {
    //     indexes: [{ fields: ['applyUserId'] }, { fields: ['useUserId'] }]
    // }
    )
}
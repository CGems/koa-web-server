const Sequelize = require('sequelize');
const envConfig = require('./../config/index')
const sequelize = new Sequelize(envConfig.database, envConfig.databaseUsername, envConfig.databasePassword, {
    host: 'localhost',
    dialect: 'mysql',
    dialectOptions: {
        supportBigNumbers: true
    },
    pool: { // 连接池
        max: 5,
        min: 0,
        acquire: 30000, // 池在抛出错误之前尝试获取连接的最长时间（以毫秒为单位）
        idle: 10000 // 连接在释放之前可以空闲的最长时间（以毫秒为单位）
    },
    timezone: '+08:00'
})

module.exports = sequelize
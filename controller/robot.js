const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = require('./../config/db')
const { responseFormatter } = require('./../utils/tolls');
const robotModule = require('./../modules/robot');

module.exports = class {
    // 获取角色列表
    static async getAccountKey(ctx) {
        const data = await sequelize.model('role').findAll()
        responseFormatter({
            ctx,
            code: '1000',
            data
        })
    }
};
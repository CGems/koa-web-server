const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = require('./../config/db')
const { responseFormatter } = require('./../utils/tolls');
const robotModule = require('./../modules/robot');
const apiRfinex = require('./../api/rfinex')

module.exports = class {
    // 获取R网账户Key
    static async getAccountKey(ctx) {
        const { userId } = ctx.state.user;
        const data = await robotModule.getAccountKeyByUserId(userId)
        data.forEach(item => {
            item.secretKey = item.secretKey.slice(0, 3) + '******************************' + item.secretKey.slice(-3)
        })
        responseFormatter({
            ctx,
            code: '1000',
            data
        })
    }
    // 新增R网账户Key
    static async addAccountKey(ctx) {
        const { userId } = ctx.state.user;
        const bodyData = ctx.request.body;
        if (bodyData && bodyData.title && bodyData.accessKey && bodyData.secretKey) {
            responseFormatter({
                ctx,
                code: '1000'
            })
            const apiInstance = new apiRfinex(
                bodyData.accessKey,
                bodyData.secretKey
            );
            try {
                const userInfo = await apiInstance.getUserInfo();
                await robotModule.addAccountKey({
                    title: bodyData.title,
                    accessKey: bodyData.accessKey,
                    secretKey: bodyData.secretKey,
                    email: userInfo.email,
                    userId
                })
                responseFormatter({
                    ctx,
                    code: '1000'
                });
            } catch (error) {
                if (error.response && (error.response.data.head.code === "2008" || error.response.data.head.code === "2005")) {
                    responseFormatter({
                        ctx,
                        code: '1020'
                    });
                } else {
                    responseFormatter({
                        ctx,
                        code: '9999'
                    });
                }
            }
        } else {
            // 入参不对
            responseFormatter({
                ctx,
                code: '1003'
            });
        }
    }
    // 删除R网账户Key
    static async deleteAccountKey(ctx) {
        const { userId } = ctx.state.user;
        const paramData = ctx.params
        if (paramData && paramData.id) {
            const affectedRows = await sequelize.model('accountKey').destroy({ where: { id: paramData.id, userId } })
            if (affectedRows === 1) {
                responseFormatter({
                    ctx,
                    code: '1000'
                });
            }
            else {
                responseFormatter({
                    ctx,
                    code: '1021'
                });
            }
        } else {
            // 入参不对
            responseFormatter({
                ctx,
                code: '1003'
            });
        }
    }
};
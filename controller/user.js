const bcrypt = require('bcryptjs');

const { responseFormatter } = require('./../utils/tolls');
const userModule = require('./../modules/user');

module.exports = class {
    static async creat(ctx) {
        const bodyData = ctx.request.body
        if (bodyData.username && bodyData.password && bodyData.password_confirm) {
            if (bodyData.password !== bodyData.password_confirm) {
                responseFormatter({
                    ctx, code: '1007'
                })
            } else {
                const existUser = await userModule.findUserByName(bodyData.username)
                if (existUser) {
                    responseFormatter({
                        ctx, code: '1006'
                    })
                } else {
                    const salt = bcrypt.genSaltSync();
                    const hash = bcrypt.hashSync(bodyData.password, salt);
                    await userModule.create({ username: bodyData.username, password: hash })
                    const newUser = await userModule.findUserByName(bodyData.username);
                    const userToken = {
                        username: newUser.username,
                        id: newUser.id
                    }
                }
            }
        } else {
            responseFormatter({
                ctx,
                code: '1003'
            });
        }
    }
    static async login(ctx) {
        ctx.session.id = 123
        ctx.session.name = 'wwh'
        responseFormatter({
            ctx,
            code: '1000',
            data: {
                username: '哈哈哈',
                age: 30
            }
        })
    }
    static async getUserInfo(ctx) {
        responseFormatter({
            ctx,
            code: '1000',
            data: {
                id: ctx.session.id,
                name: ctx.session.name
            }
        })
    }
};
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const moment = require('moment');

const { responseFormatter } = require('./../utils/tolls');
const userModule = require('./../modules/user');

module.exports = class {
    // 用户注册
    static async create(ctx) {
        const bodyData = ctx.request.body
        if (bodyData.userName && bodyData.password && bodyData.passwordConfirm) {
            if (bodyData.password !== bodyData.passwordConfirm) {
                responseFormatter({
                    ctx, code: '1008'
                })
            } else {
                const userNameLength = bodyData.userName.length
                if (userNameLength < 5 || userNameLength > 20) {
                    // 检查用户名长度
                    responseFormatter({
                        ctx, code: '1012'
                    })
                    return
                }
                const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,24}$/;
                if (!reg.test(bodyData.password)) {
                    // 检查密码强度
                    responseFormatter({
                        ctx, code: '1009'
                    })
                    return
                }
                // 查询用户名是否重复
                const existUser = await userModule.findUserByParam({ userName: bodyData.userName })
                if (existUser) {
                    // 反馈存在用户名
                    responseFormatter({
                        ctx, code: '1007'
                    })
                } else {
                    // 查找普通用户的角色实例
                    const role = await userModule.findRoleByParam({ roleName: 'user' });
                    // 加密密码
                    const salt = bcrypt.genSaltSync();
                    const hash = bcrypt.hashSync(bodyData.password, salt);
                    // 创建用户并绑定为普通用户
                    await role.createUser({ userName: bodyData.userName, password: hash });
                    responseFormatter({
                        ctx, code: '1000'
                    })
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
    // 用户登录
    static async login(ctx) {
        const bodyData = ctx.request.body
        if (bodyData.userName && bodyData.password) {
            const user = await userModule.findUserByParam({ userName: bodyData.userName });
            // 判断用户是否存在
            if (user) {
                // 判断前端传递的用户密码是否与数据库密码一致
                if (bcrypt.compareSync(bodyData.password, user.password)) {
                    const token = crypto.randomBytes(32).toString('hex');
                    const expireAt = moment().add(7, 'days')
                    await userModule.deleteLoginToken(user.id)
                    await user.createToken({ token, expireAt: expireAt.toDate() })
                    responseFormatter({
                        ctx,
                        code: '1000',
                        data: {
                            userName: user.userName,
                            token: {
                                value: token,
                                expireAt: expireAt.format('YYYY-MM-DD HH:mm:ss')
                            },
                            roleName: user.role.roleName
                        }
                    })
                } else {
                    responseFormatter({
                        ctx, code: '1011'
                    })
                }

            } else {
                responseFormatter({
                    ctx, code: '1011'
                })
            }
        } else {
            // 入参不对
            responseFormatter({
                ctx, code: '1003'
            })
        }
    }
    // 用户鉴权
    static async authByToken(ctx) {
        if (ctx.request.header.authorization) {
            const token = await userModule.findTokenByParam({ token: ctx.request.header.authorization })
            if (token && moment().isBefore(token.expireAt)) { // token存在且未过期
                const user = await token.getUser()
                const role = await user.getRole()
                ctx.state.user = { userId: user.id, userName: user.userName, roleId: role.id, roleName: role.roleName }
            }
        }
    }
    // 获取用户信息
    static async getUserInfo(ctx) {
        responseFormatter({
            ctx,
            code: '1000',
            data: {
                userName: ctx.state.user.userName,
                roleName: ctx.state.user.roleName
            }
        })
    }
    // 用户登出
    static async logout(ctx) {
        await userModule.deleteLoginToken(ctx.state.user.userId)
        responseFormatter({
            ctx,
            code: '1000'
        })
    }
};
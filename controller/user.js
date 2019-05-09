const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = require('./../config/db')
const { responseFormatter } = require('./../utils/tolls');
const userModule = require('./../modules/user');

module.exports = class {
    // 用户注册
    static async create(ctx) {
        const bodyData = ctx.request.body
        if (bodyData && bodyData.userName && bodyData.password && bodyData.passwordConfirm && bodyData.token) {
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
                let t = await sequelize.transaction();
                try {
                    const existUser = await sequelize.model('user').findOne({
                        where: {
                            userName: bodyData.userName
                        },
                        transcation: t
                    })
                    if (existUser) {
                        // 反馈存在用户名
                        responseFormatter({
                            ctx, code: '1007'
                        })
                    } else {
                        const registerToken = await sequelize.model('registerToken').findOne({
                            where: { token: bodyData.token },
                            transcation: t, lock: true
                        });
                        if (registerToken) {
                            if (registerToken.isUsed) {
                                responseFormatter({
                                    ctx,
                                    code: '1015'
                                })
                            } else if (moment(registerToken.expireAt).isSameOrBefore(new Date())) {
                                responseFormatter({
                                    ctx,
                                    code: '1016'
                                })
                            } else {
                                // 查找普通用户的角色实例
                                const role = await userModule.findRoleByRoleName('user');
                                // 加密密码
                                const salt = bcrypt.genSaltSync();
                                const hash = bcrypt.hashSync(bodyData.password, salt);
                                // 创建用户并绑定为普通用户
                                const newUser = await role.createUser({ userName: bodyData.userName, password: hash, parentId: registerToken.applyUserId }, { transcation: t });
                                await userModule.useRegisterToken(registerToken.id, newUser.id);
                                responseFormatter({
                                    ctx, code: '1000'
                                })
                            }
                        } else {
                            responseFormatter({
                                ctx,
                                code: '1013'
                            })
                        }
                    }
                    t.commit()
                } catch (error) {
                    await t.rollback()
                    responseFormatter({
                        ctx,
                        code: '1010'
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
        if (bodyData && bodyData.userName && bodyData.password) {
            const user = await userModule.findUserByUserName(bodyData.userName);
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
    // 创建注册码
    static async createRegisterToken(ctx) {
        const bodyData = ctx.request.body;
        if (bodyData && bodyData.desc) {
            const token = crypto.randomBytes(4).toString('hex').toUpperCase();
            const expireAt = moment().add(12, 'hours');
            try {
                await userModule.createRegisterToken(ctx.state.user.userId, token, expireAt, bodyData.desc);
                responseFormatter({
                    ctx,
                    code: '1000',
                    data: {
                        token,
                        expireAt: expireAt.format('YYYY-MM-DD HH:mm:ss')
                    }
                })
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') { // token生成重复
                    responseFormatter({
                        ctx,
                        code: '1010'
                    });
                    return
                }
                responseFormatter({
                    ctx,
                    code: '1003'
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
    // 获取当前用户申请注册码情况
    static async getRegisterTokenByUser(ctx) {
        let result
        if (ctx.state.user.roleName === 'superAdmin') {
            result = await userModule.getAllRegisterToken();
        } else {
            result = await userModule.getRegisterTokenByUser(ctx.state.user.userId);
        }
        const userIds = new Set()
        const userIdName = {}
        result.forEach(item => {
            userIds.add(item.applyUserId);
            item.useUserId && userIds.add(item.useUserId);
        })
        const userInfo = await userModule.findUserByIds([...userIds])
        userInfo.forEach(item => {
            userIdName[item.id] = item.userName
        })
        result = result.map(item => {
            return {
                id: item.id,
                token: item.token,
                desc: item.desc,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                expireAt: item.expireAt,
                isUsed: item.isUsed,
                applyUserName: userIdName[item.applyUserId],
                useUserName: item.useUserId ? userIdName[item.useUserId] : ''
            }
        })
        responseFormatter({
            ctx,
            code: '1000',
            data: result
        })
    }
    // 删除未使用或过期注册码
    static async deleteRegisterToken(ctx) {
        const { userId, roleName } = ctx.state.user;
        const paramData = ctx.params
        if (paramData && paramData.id) {
            let t = await sequelize.transaction();
            try {
                const registerToken = await sequelize.model('registerToken').findOne({ where: { id: paramData.id }, transaction: t, lock: true })
                if (registerToken) {
                    if (registerToken.applyUserId === userId || roleName === 'superAdmin') { // 是该用户申请或超级管理员删除
                        if (registerToken.isUsed) {
                            responseFormatter({
                                ctx,
                                code: '1015'
                            })
                        } else {
                            await await sequelize.model('registerToken').destroy({ where: { id: paramData.id }, transaction: t })
                            responseFormatter({
                                ctx,
                                code: '1000'
                            })
                        }
                    } else {
                        responseFormatter({
                            ctx,
                            code: '1014'
                        })
                    }

                } else {
                    responseFormatter({
                        ctx,
                        code: '1013'
                    })
                }
                await t.commit()
            } catch (error) {
                await t.rollback()
                responseFormatter({
                    ctx,
                    code: '1010'
                })
            }

        } else {
            // 入参不对
            responseFormatter({
                ctx,
                code: '1003'
            });
        }
    }
    // 获取用户管理信息
    static async getUserManage(ctx) {
        const { userId, roleName, userName } = ctx.state.user;
        let data;
        let userData = [];
        if (roleName === 'admin') {
            data = await sequelize.model('user').findAll({ where: { parentId: userId }, include: ['role'] });
            userData = data.map(item => {
                return {
                    id: item.id,
                    userName: item.userName,
                    roleName: item.role.roleName,
                    parentName: userName,
                    remark: item.remark,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                }
            })
        } else if (roleName === 'superAdmin') {
            data = await sequelize.model('user').findAll({ include: ['role'] });
            const adminIdName = {}
            data.forEach(item => {
                if (item.role.roleName !== 'user') {
                    adminIdName[item.id] = item.userName
                }
                if (item.role.roleName !== 'superAdmin') {
                    userData.push(item)
                }
            })
            userData = userData.map(item => {
                return {
                    id: item.id,
                    userName: item.userName,
                    roleName: item.role.roleName,
                    parentName: item.parentId ? adminIdName[item.parentId] : '',
                    remark: item.remark,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                }
            })
        }
        responseFormatter({
            ctx,
            code: '1000',
            data: userData
        })
    }
    // 用户管理信息更新
    static async updateUserManage(ctx) {
        const bodyData = ctx.request.body;
        const modifiedPersonId = ctx.params.id;
        if (bodyData) {
            const canUpdateAttributes = ['roleName', 'remark'];
            // 检测是否传入了别的参数
            if (Object.keys(bodyData).some(item => {
                return !canUpdateAttributes.includes(item)
            })) {
                // 入参不对
                responseFormatter({
                    ctx,
                    code: '1003'
                });
                return
            }
            if (bodyData.roleName) {
                const { userId, roleName } = ctx.state.user;
                const roleList = await sequelize.model('role').findAll()
                let roleIndex = {}
                roleList.forEach(item => {
                    roleIndex[item.roleName] = item.index
                })
                if (roleIndex[bodyData.roleName] === undefined) {
                    // 入参不对
                    responseFormatter({
                        ctx,
                        code: '1003'
                    });
                    return
                }
                if (roleIndex[roleName] >= roleIndex[bodyData.roleName]) {
                    // 修改人的角色小于被修改人的即将修改角色 则失败
                    responseFormatter({
                        ctx,
                        code: '1005',
                    })
                    return
                }
                userModule.deleteLoginToken(modifiedPersonId) // 删除被修改用户的token
                bodyData.roleId = roleList.find(item => { return item.roleName === bodyData.roleName }).id
                delete bodyData.roleName
            }
            await sequelize.model('user').update(bodyData, { where: { id: modifiedPersonId } })
            responseFormatter({
                ctx,
                code: '1000'
            });
        } else {
            // 入参不对
            responseFormatter({
                ctx,
                code: '1003'
            });
        }
    }
    // 获取角色列表
    static async getRole(ctx) {
        const data = await sequelize.model('role').findAll()
        responseFormatter({
            ctx,
            code: '1000',
            data
        })
    }
};
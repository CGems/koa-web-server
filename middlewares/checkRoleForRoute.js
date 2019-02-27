const userController = require('../controller/user')
module.exports = function (roles = []) { // 允许访问该路由的角色
    return async function (ctx, next) {
        if (ctx.state.userId) {
            const result = await userController.checkRoleForRoute(roles)
            if (result) {
                await next()
            } else {
                // 当前用户无访问该路由的权限
                throw {
                    status: 403
                }
            }
        } else {
            // 一般不会走这 除非忘记配置改路由需要token
            throw {
                status: 401
            }
        }
    }
}
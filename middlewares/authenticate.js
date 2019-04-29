const userController = require('../controller/user')
const { responseFormatter } = require('../utils/tolls')
const needAuthApi = require('../config/needAuthApi')

module.exports = function () {
    for (let method in needAuthApi) {
        needAuthApi[method] = needAuthApi[method].map(item => {
            let path = item.path.replace(/\//g,'\\/')
            path = path.replace(/:(\w+)/g,'([^(\\/)]+)')
            return {
                reg: new RegExp(`^${path}$`),
                role: item.role
            }
        })
    }
    return async function (ctx, next) {
        let match;
        for (let item of needAuthApi[ctx.method]) {
            if (item.reg.test(ctx.path)) {
                match = item
                break
            }
        }
        if (match) {
            await userController.authByToken(ctx)
            if (ctx.state.user) {
                if (match.role === 'all' || match.role.includes(ctx.state.user.roleName)) {
                    await next()
                } else {
                    ctx.status = 403;
                    responseFormatter({
                        ctx, code: '1005'
                    })
                }
            } else {
                ctx.status = 401;
                responseFormatter({
                    ctx, code: '1004'
                })
            }
        } else {
            await next()
        }
    };
}
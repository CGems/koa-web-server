const unless = require('koa-unless');
const userController = require('../controller/user')

module.exports = function () {
    const ware = async function (ctx, next) {
        const result = await userController.authByToken(ctx)
        if (result) {
            await next()
        } else {
            throw {
                status: 401
            }
        }
    };
    ware.unless = unless;
    return ware;
}
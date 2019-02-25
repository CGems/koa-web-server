const unless = require('koa-unless');
module.exports = function () {
    const ware = async function (ctx, next) {
        if (ctx.session.id === null) {
            throw {
                status: 401
            }
        } else {
            next()
        }
    };
    ware.unless = unless;
    return ware;
}
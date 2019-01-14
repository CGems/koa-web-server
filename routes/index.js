const Router = require('koa-router');
const user = require('./user')

const router = new Router({
    prefix: '/api/v1'
})

router.use('/user', user.routes(), user.allowedMethods());

module.exports = router;
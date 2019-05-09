const Router = require('koa-router');
const user = require('./user')
const robot = require('./robot')

const router = new Router({
    prefix: '/api/v1'
})

router.use('/user', user.routes(), user.allowedMethods());
router.use('/robot', robot.routes(), robot.allowedMethods());

module.exports = router;
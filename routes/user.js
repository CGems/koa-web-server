const Router = require('koa-router');
const koaBody = require('koa-body');

const userController = require('../controller/user')

const router = new Router();

/**
 * 用户相关
 * */

// 注册 
router.post('/', koaBody(), userController.create)
// 登录
router.post('/login', koaBody(), userController.login)
// 用户信息
router.get('/', userController.getUserInfo)

module.exports = router;
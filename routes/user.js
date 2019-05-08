const Router = require('koa-router');
const koaBody = require('koa-body');

const userController = require('../controller/user')

const router = new Router();

/**
 * 用户相关
 * */

// 注册 
router.post('/', koaBody(), userController.create)
// 用户信息
router.get('/', userController.getUserInfo)
// 用户管理列表
router.get('/manage', userController.getUserManage)
// 登录
router.post('/login', koaBody(), userController.login)
// 用户登出
router.post('/logout', userController.logout)
// 申请注册码
router.post('/registerToken', koaBody(), userController.createRegisterToken)
// 获取当前用户所有注册码情况
router.get('/registerToken', userController.getRegisterTokenByUser)
// 删除注册码
router.delete('/registerToken/:id', userController.deleteRegisterToken)

module.exports = router;
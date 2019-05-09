const Router = require('koa-router');
const koaBody = require('koa-body');

const robotController = require('../controller/robot')

const router = new Router();

/**
 * 机器人
 * */

// 注册 
router.get('/accountKey', robotController.getAccountKey)

module.exports = router;
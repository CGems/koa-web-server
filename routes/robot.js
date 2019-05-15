const Router = require('koa-router');
const koaBody = require('koa-body');

const robotController = require('../controller/robot')

const router = new Router();

/**
 * 机器人
 * */

// 获取R网账户Key
router.get('/accountKey', robotController.getAccountKey)
// 新增R网账户Key
router.post('/accountKey', koaBody(), robotController.addAccountKey)
// 删除R网账户Key
router.delete('/accountKey/:id', robotController.deleteAccountKey)

// 获取自成交配置
router.get('/selfTradeConfig', robotController.getSelfTradeConfigByUserId)
// 新增自成交配置
router.post('/selfTradeConfig', koaBody(), robotController.addSelfTradeConfig)

module.exports = router;
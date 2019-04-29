const Koa = require('koa');
const cors = require('koa2-cors');
const json = require('koa-json');
const static = require('koa-static');
const path = require('path');
const index = require('./routes');
const envConfig = require('./config')
const { responseFormatter } = require('./utils/tolls')
const authenticateMiddleware = require('./middlewares/authenticate')

const app = new Koa();

app.use(static(
  path.join( __dirname,  './web_build')
))
app.use(cors());
app.use(json());

app.use(async (ctx, next) => {
    return next().then(() => {
        if (ctx.status === 405) { // 方法不存在
            ctx.status = 200
            responseFormatter({
                ctx, code: '1002'
            })
        }
    }).catch(err => {
        console.error(err)
        responseFormatter({
            ctx, code: '1001'
        })
    })
})

app.use(authenticateMiddleware())

app.use(async (ctx, next) => {
    const start = new Date()
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app
    .use(index.routes())
    .use(index.allowedMethods());

app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
})

app.listen(envConfig.port, () => {
    console.log('服务器已经启动！');
});
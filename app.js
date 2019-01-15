const Koa = require('koa');
const koaJwt = require('koa-jwt');
const cors = require('koa2-cors');
const json = require('koa-json');

const index = require('./routes/index')
const secret = require('./config/secret.json');
const website = require('./config/website')
const needTokenApi = require('./config/needTokenApi.json')
const { responseFormatter } = require('./utils/tolls')

const app = new Koa();
app.use(cors());
app.use(json());
app.use(async (ctx, next) => {
    return next().catch(err => {
        if (err.status === 401) {
            ctx.status = 401;
            responseFormatter({
                ctx, code: '1006'
            })
        } else {
            throw err;
        }
    })
})

app.use(koaJwt({
    secret: secret.sign,
    // passthrough: true // 不携带Authorization继续传递到下层
}).unless((ctx) => {
    for (let reg of needTokenApi[ctx.method]) {
        reg = new RegExp(reg);
        if (reg.test(ctx.path)) {
            return true
        }
    }
    return false
}))

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

app.listen(website.port, () => {
    console.log(`${website.join()} 服务器已经启动！`);
});
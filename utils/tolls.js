const errorDescs = require('./../config/error.json')
const responseFormatter = ({ ctx, code, data }) => {
    if (code === '1000') {
        ctx.body = {
            body: data,
            head: {
                code: '1000',
                msg: 'success'
            }
        }
    } else {
        const errDesc = errorDescs[code]
        if (errDesc) {
            ctx.body = {
                head: {
                    code,
                    msg: errDesc
                }
            }
        } else {
            ctx.body = {
                head: {
                    code: '9999',
                    msg: '未知错误'
                }
            }
        }
    }
}

module.exports = {
    responseFormatter
}
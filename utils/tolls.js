const errorDescs = require('./../config/error.json')
const responseFormatter = ({ ctx, code, data }) => {
    if (code === '1000') {
        ctx.body = {
            code: '1000',
            msg: 'success',
            data
        }
    } else {
        const errDesc = errorDescs[code]
        if (errDesc) {
            ctx.body = {
                code,
                msg: errDesc
            }
        } else {
            ctx.body = {
                code: '9999',
                msg: '未知错误'
            }
        }
    }
}

module.exports = {
    responseFormatter
}
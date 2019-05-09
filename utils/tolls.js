const errorDescs = require('./../config/error.json')
const responseFormatter = ({ ctx, code, data, msgObj }) => {
    const reg = /{(\w+)}/g;
    if (code === '1000') {
        ctx.body = {
            code: '1000',
            msg: 'success',
            data
        }
    } else {
        let errDesc = errorDescs[code]
        if (errDesc) {
            if (errDesc.match(reg)) {
                errDesc = errDesc.replace(reg, (match, key) => {
                    return msgObj[key] === undefined ? match : msgObj[key]
                })
            }
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
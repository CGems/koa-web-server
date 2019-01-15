const { responseFormatter } = require('./../utils/tolls')
module.exports = class {
    static async creat(ctx) { }
    static async login(ctx) { }
    static async getUserInfo(ctx) {
        responseFormatter({
            ctx,
            code: '1000',
            data: {
                username: '哈哈哈',
                age: 30
            }
        })
    }
};
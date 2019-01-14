module.exports = class {
    static async creat(ctx) { }
    static async login(ctx) { }
    static async getUserInfo(ctx) {
        ctx.body = {
            username: '哈哈哈',
            age: 30
        }
    }
};
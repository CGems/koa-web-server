const website = {
    scheme: 'http',
    host: 'localhost',
    port: 3000,
    join: function () {
        return `${this.scheme}://${this.host}:${this.port}`
    }
}
module.exports = website;
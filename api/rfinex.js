const axios = require('axios');
const crypto = require('crypto');
// const https = require('https');
let axiosInstance = axios.create({
    baseURL: 'https://api.58token.cn',
    headers: {},
    timeout: 20000, // 超时时间
    // httpsAgent: new https.Agent({
    //     rejectUnauthorized: false
    // })
})

module.exports = class rfinex {
    constructor(accessKey, secretKey) {
        this.accessKey = accessKey
        this.secretKey = secretKey
    }
    static assemblyParams(method, url, data, access_key, secret_key) {
        let queryStr = '';
        let tonce = Date.now();
        let params;
        if (method === 'get') {
            params = {
                tonce,
                access_key,
                ...data
            }
        } else if (method === 'post') {
            params = {
                tonce,
                access_key,
                ...data
            }
        }
        const keys = Object.keys(params).sort()
        keys.forEach((v) => {
            queryStr += v + "=" + encodeURI(params[v]) + "&"
        })
        queryStr = queryStr.substr(0, queryStr.length - 1)
        const payload = `${method.toUpperCase()}|${url}|${queryStr}`;
        const signature = crypto.createHmac('sha256', secret_key).update(payload).digest('hex');
        return {
            ...params,
            signature
        }
    }
    static buildQueryString(method, url, data, access_key, secret_key) {
        let tonce = Date.now();
        let params;
        if (method === 'get') {
            params = {
                tonce,
                access_key,
                ...data
            }
        } else if (method === 'post') {
            params = {
                tonce,
                access_key,
                ...data
            }
        }
        params = rfinex.restructParams(params)
        params = rfinex.sortParams(params)
        const queryString = rfinex.toQuery(params)
        const payload = `${method.toUpperCase()}|${url}|${queryString}`;
        const signature = crypto.createHmac('sha256', secret_key).update(payload).digest('hex');
        return `${queryString}&signature=${signature}`;
    }
    static toQuery(params) {
        return params.map(param => {
            const key = Object.keys(param)[0]
            const value = param[key]
            return key + '=' + value
        }).join('&')
    }

    static flat(name, value) {
        let result = []
        value.forEach(obj => {
            Object.keys(obj).forEach(key => {
                result.push({
                    [name + "[][" + key + "]"]: `${obj[key]}`
                })
            })
        })
        return result
    }
    static restructParams(params) {
        let result = []

        params = Object.keys(params)
            .filter(key => params[key])
            .map(key => {
                return {
                    [key]: params[key]
                }
            })

        params.forEach(param => {
            const key = Object.keys(param)[0]
            const value = param[key]
            if (typeof value == 'string' || typeof value == 'number') {
                result.push(param)
            } else if (Array.isArray(value)) {
                result = result.concat(rfinex.flat(key, value))
            }
        })

        return result
    }
    static sortParams(params) {
        const keys = params.map(param => Object.keys(param)[0])

        return keys.sort().map(key => {
            return params.filter(param => Object.keys(param)[0] == key)[0]
        })
    }

    async getUserInfo() {
        const url = '/api/v1/members/me'
        const data = rfinex.assemblyParams('get', url, {}, this.accessKey, this.secretKey)
        const res = await axiosInstance.get(url, {
            params: data
        })
        return res.data;
    }

    async getTickers() {
        const res = await axiosInstance.get('/api/v1/tickers');
        return res.data;
    }
    async getRecentTransaction(market) {
        const res = await axiosInstance.get(`/api/v1/trades`, {
            params: {
                market
            }
        });
        return res.data;
    }

    async sellOrBuy(side, market, volume, price) {
        const url = '/api/v1/orders'
        const data = rfinex.assemblyParams('post', url, {
            side,
            market,
            volume,
            price
        }, this.accessKey, this.secretKey)
        const res = await axiosInstance({
            method: 'post',
            url,
            params: data,
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        });
        return res.data.body
    }

    async sell(market, volume, price) {
        return await rfinex.sellOrBuy('sell', market, volume, price);
    }

    async buy(market, volume, price) {
        return await rfinex.sellOrBuy('buy', market, volume, price);
    }

    async getDepth(market, limit) {
        const res = await axiosInstance.get('/api/v1/depth', {
            params: {
                market,
                limit
            }
        });
        return res.data;
    }

    async getMyAccountByCurrency(currency) {
        // 返回了 head和body
        const url = `/api/v1/members/accounts/${currency}`
        const data = rfinex.assemblyParams('get', url, {
        }, this.accessKey, this.secretKey)
        const res = await axiosInstance.get(url, {
            params: data
        });
        return res.data.body;
    }

    async getMyAccount() {
        // 返回了 head和body
        const url = '/api/v1/members/accounts'
        const data = rfinex.assemblyParams('get', url, {
        }, this.accessKey, this.secretKey)
        const res = await axiosInstance.get(url, {
            params: data
        });
        return res.data.body;
    }

    async getOrdersByMarket(market, limit = 200) {
        const url = '/api/v1/orders'
        const data = rfinex.assemblyParams('get', url, {
            market,
            limit
        }, this.accessKey, this.secretKey)
        const res = await axiosInstance.get(url, {
            params: data
        });
        return res.data;
    }
    async cancelOrderById(id) {
        const url = '/api/v1/order/delete'
        const data = rfinex.assemblyParams('post', url, {
            id
        }, this.accessKey, this.secretKey)
        const res = await axiosInstance({
            method: 'post',
            url,
            params: data,
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        });
        return res.data;
    }
    async cancelOrderIds(ids) {
        const url = '/api/v1/orders/delete'
        const data = rfinex.assemblyParams('post', url, {
            ids
        }, this.accessKey, this.secretKey)
        const res = await axiosInstance({
            method: 'post',
            url,
            params: data,
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        });
        return res.data;
    }
    async cancelAllOrdersByMarket(market) {
        const url = '/api/v1/orders/clear'
        const data = rfinex.assemblyParams('post', url, {
            market
        }, this.accessKey, this.secretKey)
        const res = await axiosInstance({
            method: 'post',
            url,
            params: data,
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        });
        return res.data;
    }

    async getMarkets() {
        const res = await axiosInstance.get('/api/v1/markets');
        return res.data;
    }

    async sendOrders(market, orders, otherOption = {}) {
        const url = '/api/v1/orders/multi2'
        const queryStr = rfinex.buildQueryString('post', url, {
            market,
            orders: JSON.stringify(orders),
            ...otherOption
        }, this.accessKey, this.secretKey)
        const res = await axiosInstance.post(`${url}?${queryStr}`);
        return res.data;
    }

    async getTickerByMarket(market) {
        const res = await axiosInstance.get(`/api/v1/tickers/${market}`);
        return res.data;
    }
    
    // async getOrderById(id) {
    //     const res = await axiosInstance.get('/api/v1/order', {
    //         params: { id },
    //         needAuth: true // 需要鉴权
    //     });
    //     return res.data;
    // }
}

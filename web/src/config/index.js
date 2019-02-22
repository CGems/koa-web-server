// 当前的运行环境
export const NODE_ENV = process.env.NODE_ENV || 'production'

// 路由默认配置，路由表并不从此注入
export const ROUTER_DEFAULT_CONFIG = {
  waitForData: true,
  transitionOnLoad: true,
  mode: 'history',
  base: '/'
}

// axios 默认配置
export const AXIOS_DEFAULT_CONFIG = {
  maxContentLength: 2000,
  headers: {},
  baseURL: '/api/v1',
  timeout: 20000, // 超时时间
  retry: 4, // 超时再次请求次数
  retryDelay: 1000, // 超时后再次发起请求的时间间隔
  withCredentials: true
}

// vuex 默认配置
export const VUEX_DEFAULT_CONFIG = {
  strict: process.env.NODE_ENV !== 'production'
}

// API 默认配置
export const API_DEFAULT_CONFIG = {
  mockBaseURL: '/test/api/v1', // mock时的baseUrl
  mock: NODE_ENV === 'production' ? false : false, // true：访问测试服务器：'http://watt.lotw.in'  false: 访问线上接口： 'https://watt.rfinex.com'
  debug: false
}

// CONST 默认配置
export const CONST_DEFAULT_CONFIG = {
  sep: '/'
}

// 还有一些业务相关的配置
// ...

export const CONSOLE_REQUEST_ENABLE = true // 开启请求参数打印

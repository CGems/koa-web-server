export default [{
    name: 'authenticate',
    method: 'POST',
    desc: '登录',
    path: '/user/login',
    mockPath: '/user/login',
    params: {},
    options: {
        notNeedAuth: true
    }
}, {
    name: 'register',
    method: 'POST',
    desc: '注册',
    path: '/user',
    mockPath: '/user',
    params: {},
    options: {
        notNeedAuth: true
    }
}, {
    name: 'getUserInfo',
    method: 'GET',
    desc: '获取用户信息',
    path: '/user',
    mockPath: '/user',
    params: {},
    options: {}
}]
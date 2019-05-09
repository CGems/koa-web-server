export const constantRouterMap = [
    {
        path: '/redirect',
        component: 'layout/Layout',
        hidden: true,
        children: [
            {
                path: '/redirect/:path*',
                component: 'redirect'
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: 'login',
        hidden: true
    },
    {
        path: '/register',
        name: 'Register',
        component: 'register',
        hidden: true
    },
    {
        path: '/404',
        name: '404',
        component: 'errorPage/404',
        hidden: true
    },
    {
        path: '/401',
        name: '401',
        component: 'errorPage/401',
        hidden: true
    },
    {
        path: '',
        component: 'layout/Layout',
        redirect: 'dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: 'dashboard',
                meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
            }
        ]
    },
    {
        path: '/accountKey',
        component: 'layout/Layout',
        children: [
            {
                path: 'index',
                name: 'accountKey',
                component: 'accountKey',
                meta: { title: 'R网账户管理', icon: 'key', noCache: true }
            }
        ]
    }
]

export const asyncRouterMap = [{
    path: '/manage',
    component: 'layout/Layout',
    meta: {
        title: '后台管理',
        icon: 'backend',
        roles: ['admin', 'superAdmin'] // you can set roles in root nav
    },
    children: [{
        path: 'registerToken',
        name: 'registerToken',
        component: 'registerToken',
        meta: {
            title: '注册码',
            icon: 'token',
            noCache: true
        }
    }, {
        path: 'userManage',
        name: 'userManage',
        component: 'userManage',
        meta: {
            title: '用户管理',
            icon: 'user',
            noCache: true
        }
    }]

}, { path: '*', redirect: '/404', hidden: true }]
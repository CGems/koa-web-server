/* Layout */
import Layout from '@/views/layout/Layout'

export const constantRouterMap = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path*',
                component: () => import( /* webpackChunkName: "redirect" */ 'Views/redirect')
            }
        ]
    },
    {
        path: '/login',
        component: () => import( /* webpackChunkName: "login" */ 'Views/login'),
        hidden: true
    },
    {
        path: '/register',
        component: () => import( /* webpackChunkName: "register" */ 'Views/register'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import( /* webpackChunkName: "404" */ 'Views/errorPage/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import( /* webpackChunkName: "401" */ 'Views/errorPage/401'),
        hidden: true
    },
    {
        path: '',
        component: Layout,
        redirect: 'dashboard',
        children: [
          {
            path: 'dashboard',
            component: () => import( /* webpackChunkName: "401" */ 'Views/errorPage/401'),
            name: 'Dashboard',
            meta: { title: 'dashboard', icon: 'dashboard', noCache: true, affix: true }
          }
        ]   
    }
]

export const asyncRouterMap = [{ path: '*', redirect: '/404', hidden: true }]
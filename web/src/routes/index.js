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
    }
]

export const asyncRouterMap = []
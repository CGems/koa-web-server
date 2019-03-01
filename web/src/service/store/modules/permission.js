import { asyncRouterMap, constantRouterMap } from 'Routes'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roleName
 * @param route
 */
function hasPermission(roleName, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roleName)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roleName
 */
function filterAsyncRouter(routes, roleName) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roleName, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roleName)
      }
      res.push(tmp)
    }
  })

  return res
}

const permission = {
  state: {
    routers: [],
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit, rootState }) {
      const roleName = rootState.user.roleName
      return new Promise(resolve => {
        let accessedRouters = filterAsyncRouter(asyncRouterMap, roleName)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission

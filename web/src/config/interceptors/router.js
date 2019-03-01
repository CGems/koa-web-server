import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import store from 'Plugins/store';
import { getToken } from 'Utils/auth';
import { transformFilePathToRoute } from 'Utils/router';
import router from 'Plugins/router'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

export function routerBeforeEachFunc(to, from, next) {
  // 这里可以做页面拦截，也可以在这里面做权限处理
  NProgress.start()
  if (getToken()) {
    // 已有token
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.userLoginStatus === 'notyet') { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(() => { // 拉取user_info
          store.dispatch('GenerateRoutes').then(() => {
            router.addRoutes(transformFilePathToRoute(store.getters.addRouters)) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        })
      } else {
        next()
      }
    }
  } else {
    const whiteList = ['/login', '/register', '/auth-redirect', '/401', '/404']// no redirect whitelist
    if (whiteList.indexOf(to.path) > -1) {
      // 免登录白名单
      next()
    } else {
      next({ path: `/login?redirect=${to.path}` })
    }
  }
}

export function routerAfterEachFunc() {
  NProgress.done() // finish progress bar
  // 跳转页面窗口置顶
  // window.scroll(0, 0);
}
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import store from 'Plugins/store';
import { getToken } from 'Utils/auth';

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
      // NProgress.done()
    } else {
      if (store.getters.userLoginStatus === 'notyet') { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          console.log(res)
        })
      }
    }
  } else {
    const whiteList = ['/login', '/register', '/auth-redirect']// no redirect whitelist
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
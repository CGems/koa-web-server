const getters = {
    sidebar: state => state.app.sidebar,
    language: state => state.app.language,
    size: state => state.app.size,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    token: state => state.user.token,
    userName: state => state.user.userName,
    roleName: state => state.user.roleName,
    userLoginStatus: state => state.user.userLoginStatus,
    permission_routers: state => state.permission.routers,
    addRouters: state => state.permission.addRouters,
    // errorLogs: state => state.errorLog.logs
}
export default getters

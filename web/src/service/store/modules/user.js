import apiArr from 'Plugins/api'
import { getToken, setToken, removeToken } from 'Utils/auth'

const { userAuthenticate, userLogout, userGetUserInfo } = apiArr

const user = {
  state: {
    token: getToken(),
    userName: '',
    roleName: '',
    userLoginStatus: 'notyet', // 登录状态
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER_NAME: (state, userName) => {
      state.userName = userName
    },
    SET_ROLE: (state, roleName) => {
      state.roleName = roleName
    },
    SET_LOGIN_STATUS: (state, status) => {
      state.userLoginStatus = status
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      return userAuthenticate({
        userName: userInfo.userName,
        password: userInfo.password
      }).then(res => {
        commit('SET_TOKEN', res.token.value)
        setToken(res.token.value)
      })
    },
    // 获取用户信息
    GetUserInfo({ commit }) {
      commit('SET_LOGIN_STATUS', 'process')
      return new Promise((resolve, reject) => {
        userGetUserInfo().then(res => {
          commit('SET_ROLE', res.roleName)
          commit('SET_USER_NAME', res.userName)
          commit('SET_LOGIN_STATUS', 'already')
          resolve(res)
        }).catch(error => {
          commit('SET_LOGIN_STATUS', 'notyet')
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        userLogout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLE', '')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user

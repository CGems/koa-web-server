import axios from './axios'
import _assign from 'lodash/assign'

import {
  assert
} from 'Utils/tools'
import {
  API_DEFAULT_CONFIG
} from 'Config'
import API_CONFIG from 'Service/api'


class MakeApi {
  constructor(options) {
    this.api = {}
    this.apiBuilder(options)
  }


  apiBuilder({
    config = {},
    mock = false,
    debug = false,
    mockBaseURL = ''
  }) {
    Object.keys(config).map(namespace => {
      this._apiSingleBuilder({
        namespace,
        mock,
        mockBaseURL,
        debug,
        config: config[namespace]
      })
    })
  }
  _apiSingleBuilder({
    namespace,
    config = {},
    mock = false,
    debug = false,
    mockBaseURL = ''
  }) {
    config.forEach(api => {
      const {
        name,
        desc,
        method,
        path,
        mockPath,
        options,
        baseURL
      } = api
      let apiname = `${namespace}${_firstUpperCase(name)}`,
        url = mock ? mockPath : path,
        baseUrl = mock ? baseURL ? '/test' + baseURL : mockBaseURL : baseURL ? baseURL : ''

      debug && assert(name, `${url} :接口name属性不能为空`)
      debug && assert(url.indexOf('/') === 0, `${url} :接口路径path，首字符应为/`)

      Object.defineProperty(this.api, apiname, {
        value(outerParams, outerOptions) {
          // let _data = _isFormData(outerParams) ? outerParams : _isEmpty(outerParams) ? params : _pick(_assign({}, params, outerParams), Object.keys(params))
          let _data = outerParams
          let obj = {
            name,
            url,
            desc,
            // baseURL,
            method
          }
          baseUrl && (obj['baseURL'] = baseUrl)
          return axios(_normoalize(_assign(obj, _assign({}, options, outerOptions)), _data))
        }
      })
    })
  }
}

function _normoalize(options, data) {
  if (options.method === 'GET') {
    options.params = data
  } else {
    options.data = data
  }
  return options
}

function _firstUpperCase(str) {
  return str.replace(/\b(\w)/g, function ($1) {
    return $1.toUpperCase();
  })
}
export default new MakeApi({
  config: API_CONFIG,
  ...API_DEFAULT_CONFIG
})['api']

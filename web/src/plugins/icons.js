import Vue from 'vue'
import IconSvg from 'Components/SvgIcon'// svg组件
// register globally

Vue.component('svg-icon', IconSvg)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('../assets/images/svg/', false, /\.svg$/)
requireAll(req)

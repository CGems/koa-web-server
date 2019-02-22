import Vue from 'vue'
import { Button, Form, FormItem,Dropdown,DropdownMenu,DropdownItem,Dialog,Input } from 'element-ui'
import ElementLocale from 'element-ui/lib/locale'
import i18n from 'Lang'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Dialog)
Vue.use(Input)

ElementLocale.i18n((key, value) => i18n.t(key, value))
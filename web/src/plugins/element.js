import Vue from 'vue'
import ElementLocale from 'element-ui/lib/locale'
import i18n from 'Lang'
import {
    Loading,
    MessageBox,
    // Notification,
    Message,
    Button,
    Carousel,
    CarouselItem,
    Breadcrumb,
    BreadcrumbItem,
    InputNumber,
    Dialog,
    Collapse,
    CollapseItem,
    Input,
    Col,
    Row,
    Menu,
    Submenu,
    MenuItem,
    Tooltip,
    Form,
    FormItem,
    Tabs,
    TabPane,
    Table,
    TableColumn,
    Pagination,
    Popover,
    Select,
    Option,
    Badge,
    Scrollbar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    Cascader
} from 'element-ui'
// 按需引入element-ui的部分功能
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
// Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
// Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

Vue.use(Button)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(InputNumber)
Vue.use(Dialog)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Input)
Vue.use(Col)
Vue.use(Row)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Tooltip)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Popover)
Vue.use(Select)
Vue.use(Option)
Vue.use(Badge)
Vue.use(Scrollbar)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Cascader)

ElementLocale.i18n((key, value) => i18n.t(key, value))
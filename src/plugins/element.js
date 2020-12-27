import Vue from 'vue';
import {Button} from "element-ui";
import {Form, FormItem, Input} from "element-ui";
import {Message} from "element-ui";
import {Container, Aside, Header, Main} from "element-ui";
import {Menu, Submenu, MenuItemGroup, MenuItem} from "element-ui";
import {Breadcrumb, BreadcrumbItem} from "element-ui";
import {Card} from "element-ui";
import {Row, Col} from "element-ui";
import {Table, TableColumn} from "element-ui";
import {Switch, Tooltip, Pagination, Dialog, MessageBox} from "element-ui";

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
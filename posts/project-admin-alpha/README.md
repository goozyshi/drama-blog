---
date: 2020-07-06
category: Projects
tags:
  - Vue2
  - Element UI
spot: 留学生创业大厦
location: 深圳，科苑
outline: deep
---

# 后台管理系统--可折叠菜单

> [【源码】https://github.com/goozyshi/vnode-demo](https://github.com/goozyshi/vnode-demo)

## 效果预览

![](./nav-preview.png)

<figure>
  <figcaption>
    整体效果
  </figcaption>
</figure>

## 核心思路

路由匹配 + 利用`vuex`实现组件状态共享控制折叠

## 路由 route.js

主组件交由`Layout组件`控制，其下的子组件都将在【Layout 视图下进行加载展示】。

而不在 Layout 组件下的组件，如`Login组件`，则会单独展示。

路由组件采用`import`方式进行【懒加载】。

下例有删减部分路由。

```javascript
/* route.js 文件 */
import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "../views/Layout.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "登录",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/",
    name: "Layout",
    component: Layout,
    children: [
      // 子标签页都需要放到统一的父组件内
      {
        path: "/",
        name: "首页",
        component: () => import("../views/Home.vue"),
      },
    ],
  },
  {
    path: "/other",
    name: "其他",
    label: "其他",
    redirect: "/about",
    component: Layout,
    children: [
      {
        path: "/about",
        name: "关于",
        component: () => import("../views/About.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
```

## Layout 主组件

- 左侧：common-menu，左侧菜单栏
- 右上：common-header，头部导航组件
- 右下：common-tab-view，标签页组件

```html
<template>
  <el-container>
    <el-aside width="auto">
      <common-menu></common-menu>
    </el-aside>
    <div class="app-main">
      <el-header class="app-header">
        <common-header></common-header>
      </el-header>
      <el-main class="app-wrap">
        <common-tab-view></common-tab-view>
      </el-main>
    </div>
  </el-container>
</template>
<script>
  import commonMenu from "@/components/commonMenu";
  import commonHeader from "@/components/commonHeader";
  import commonTabView from "@/components/commonTabView";

  export default {
    components: { commonMenu, commonHeader, commonTabView },
    data() {
      return {};
    },
  };
</script>
```

## vuex 控制折叠

store 实例中声明`isCollapse`，

state 中属性值的改变通过 commit 触发 mutations 中的事件 type 来改变。

```javascript
import Vue from "vue";
import Vuex from "vuex";
import { COLLAPSE_MENU } from "./mutations-type";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isCollapse: false,
  },
  mutations: {
    [COLLAPSE_MENU](state) {
      state.isCollapse = !state.isCollapse;
    },
  },
});
```

设置【常量事件类型】并引入，便于在拼写错误时 linter 类组件能及时发挥作用。

```javascript
/* mutations-type.js 文件 */
export const COLLAPSE_MENU = "collapse-menu";
```

点击 header 栏的【展开|收缩 图标】对 store 实例中的`isCollapse`进行反转

```javascript
/** commonHeader 组件 **/
// computed 阶段引入，可以自动监听变化
computed: {
    isCollapse () {
        return this.$store.state.isCollapse
    }
}

...

// 点击图标后触发 triggerCollapse 方法
triggerCollapse () {
    this.$store.commit('collapse-menu')
},
```

## 菜单栏组件 commonMenu

通过 computed 监听 vuex 中的 isCollaps 来进行控制菜单折叠，

点击菜单，则将该菜单对应的路由压入路由栈中。

**template**

```javascript
  <el-menu
    :collapse="isCollapse"
    :default-active="$route.path"
    :default-openeds="defaultOpenProps"
    class="el-menu-vertical-demo"
    style="width: 100%"
    background-color="#24292e"
    text-color="#fff"
    active-text-color="#ffd04b"
    :collapse-transition="false"
  >
    <div class="menu-title">
      <img class="logo" src="https://img.icons8.com/color/96/000000/avengers.png"/>
      <h4 v-show="!isCollapse">花栗鼠后台管理系统</h4>
    </div>
    <template v-for="(item, index) in menuData">
        <!-- 不含子菜单 -->
        <el-menu-item v-if="!item.hidden && !item.children"
        	:index="item.path" @click="clickMenu(item)" :key="index">
          <i :class="item.icon"></i>
          <span slot="title">{{item.label}}</span>
        </el-menu-item>
        <!-- 含子菜单 -->
        <el-submenu v-if="!item.hidden && item.children && item.children.length"
        	:index="index+''" :key="index">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{item.label}}</span>
          </template>
          <el-menu-item v-for="child in item.children" :index="child.path"
          	:key="child.path" @click="clickMenu(child)">
            <span slot="title">{{child.label}}</span>
          </el-menu-item>
        </el-submenu>
    </template>
  </el-menu>
```

**script**

```javascript
<script>
import menuData from '../router/menu'
export default {
  computed: {
    isCollapse () {
      // 从vuex中获取
      return this.$store.state.isCollapse
    }
  },
  methods: {
    clickMenu (item) {
      this.$router.push({ path: item.path })
    }
  },
  data () {
    return {
      defaultOpenProps: ['1'],
      menuData
    }
  }
}
</script>
```

### menuData 菜单栏数据

```javascript
const menu = [
  {
    path: "/",
    name: "Home",
    label: "首页",
    icon: "el-icon-s-home",
  },
  {
    path: "/book",
    name: "书籍",
    label: "书籍",
    icon: "el-icon-reading",
    children: [
      { path: "/cover", name: "cover", label: "封面" },
      { path: "/codex", name: "codex", label: "附录" },
    ],
  },
  {
    path: "/other",
    name: "other",
    label: "其他",
    icon: "el-icon-magic-stick",
    children: [{ path: "/about", name: "about", label: "关于" }],
  },
];
export default menu;
```

## 遇坑填坑

### 1. 设置默认展开后，激活路由不展开其他菜单

![](./bug1.png)

<figure>
  <figcaption>
    <em>bug</em>: 路由菜单不匹配
  </figcaption>
</figure>

这里默认激活了第二栏【书籍】，而在激活【其他】内的【关于】时却没有自动展开【其他】

大概率是因为把默认激活的`default-openeds`写死了。
【错误示范】

```javascript
<el-menu default-openeds="['1']"></el-menu>
```

【正确写法】

    用来激活的`default-opendeds`需要绑定要绑定一个变量，

    这样DOM刷新时默认展开的菜单才能及时更新到变量中

```html
<el-menu :default-openeds="defaultProp"></el-menu>
```

```javascript
export default {
  data() {
    return {
      defaultOpenProps: ["1"],
    };
  },
};
```

### 2. 折叠后存在文字重叠

![](./bug2.png)

<figure>
  <figcaption>
    <em>bug</em>: 样式错乱
  </figcaption>
</figure>

这是因为在`el-menu`的嵌套中出现了意外的标签。

el-menu 本身希望内嵌的标签是：`el-menu-group`, `el-menu-item`,  `el-submenu`

【错误示范】

由于外部加了 div 来总体控制菜单的显隐，此时 el-menu 内嵌了一个 div 标签

但也不是所有的菜单折叠后都存在文字，像是【没有 children 子菜单的首页】，折叠后就只剩下图标。

而其他含有子菜单的则会出现重叠文字。

```html
<el-menu>
  <template v-for="(item, index) in menuData">
    <div v-if="item.hidden">
      <!-- 不含子菜单 -->
      <el-menu-item v-if="!item.children" :index="item.path">
        <i :class="item.icon"></i>
        <span slot="title">{{item.label}}</span>
      </el-menu-item>
      <!-- 含子菜单 -->
      <el-submenu v-if="item.children">
        <template slot="title">
          <i :class="item.icon"></i>
          <span slot="title">{{item.label}}</span>
        </template>
        <el-menu-item
          v-for="child in item.children"
          :index="child.path"
          :key="child.path"
        >
          <span slot="title">{{child.label}}</span>
        </el-menu-item>
      </el-submenu>
    </div>
  </template>
</el-menu>
```

【正确写法】

去除 div，仅内嵌 el-menu 标签希望的三个标签即可。

将显隐条件`item.hidden`带到具体的子组件。

```html
<el-menu>
  <template v-for="(item, index) in menuData">
    <!-- 不含子菜单 -->
    <el-menu-item v-if="!item.hidden && !item.children" :index="item.path">
      <i :class="item.icon"></i>
      <span slot="title">{{item.label}}</span>
    </el-menu-item>
    <!-- 含子菜单 -->
    <el-submenu v-if="!item.hidden && item.children && item.children.length">
      <template slot="title">
        <i :class="item.icon"></i>
        <span slot="title">{{item.label}}</span>
      </template>
      <el-menu-item v-for="child in item.children">
        <span slot="title">{{child.label}}</span>
      </el-menu-item>
    </el-submenu>
  </template>
</el-menu>
```

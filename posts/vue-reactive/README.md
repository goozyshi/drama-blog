---
date: 2023-03-26
category: Frontend
tags:
  - Vue
spot: 巷寓
location: 深圳，海滨社区
outline: deep
draft: true
---

# Vue 知识

## Vue 是什么

`Vue` 是一款基于 `MVVM` 架构的 `渐进式框架`，它主要用于构建 `单页面应用（spa）`，它的特点有 `声明式渲染 `、`响应式` 两大点。

### MVVM 是什么

**Model View ViewModel**，`Model ` 代表数据模型，`View ` 表示视图，数据绑定到 `ViewModel ` 自动渲染到 View 层，View 层发生变化通知 ViewModel 更新数据。

- `MVC` 中 `Controller` 演变成 `MVVM` 中的 `ViewModel`
- `MVVM` 通过数据来更新视图层而不是节点操作
- `MVVM` 主要解决了 `MVC` 中大量的 `dom` 操作使页面渲染性能降低, 加载速度变慢, 影响用户体验

### 数据双向绑定原理

Vue2 通过 `Object.defineProperty` 方法对对象进行数据劫持, 重写 **对象属性** 的 `getter/setter`，数据发生变化时通过 `发布订阅` 模式进行页面更新操作。

但无法直接对对象、数组进行劫持。通过 **原型链重写数组方法** 实现对数组的监听。

**依赖收集**

1. `vue` 将 `data` 初始化为一个 `Observer` 并对对象中的每个 key， 通过 `Object.defineProperty` 重写了其中的 `get`、`set` 方法，进行响应式处理
2. Compile 对模板执行编译，从 `data` 中获取数据并初始化视图
3. `defineReactive` 时为每⼀个 `key` 创建⼀个 `Dep` 实例
4. mount 初始化视图时读取某个 `key`，例如 `name1`，创建⼀个 `watcher1`
5. 触发 `name1` 的 `getter` 方法，便将 `watcher1` 添加到 `name1` 对应的 Dep 中
6. 当 `name1` 更新，`setter` 触发时，便可通过对应 `Dep` 通知其管理所有 `Watcher` 更新

有两种方式无法直接监听数组变化

1. 根据 `索引` 改变数组
2. 修改数组 `长度`

Vue2 给出的解决方式是利用 ` Vue.$set  | Vue.$delete 添加或删除响应式属性`，或者利用深拷贝复制

### this.$set(target, key, val) 原理

- 目标为数组，使用 **Array.prototype.splice** 方法触发响应式（数组方法 push、 pop、shift、unshift、splice、sort、reverse 被进行包裹，可以触发试图更新）
- 目标为对象，先判断对象属性是否响应式，否则调用 **defineReactive** 方法（动态添加 getter/setter 时调用的方法）进行响应式处理

## v-model 语法糖

v-model 本质上是语法糖， 在 input(`value属性  + input事件`) select(`value 属性 + change事件`) 等元素上通过创建双向数据绑定。

```vue
<input v-model="sth" />
<!-- 相当于 -->
<input :value="sth" @input="sth = $event.target.value" />

Object.defineProperty(sth, { ennumable: true, // 是否可枚举 configurable: true,
// 是否可以delete set(val) { span.innerHtml = val input.value = val } })
```

## v-if、v-show、v-html 的原理

- **v-if** (`display:none`)**不会生成 vnod** e, 也不会在 render 阶段生成真实节点
- **v-show** (`display: hidden`)会生成 vnode 最终生成真实节点，不会显示(opacity: 0)
- **v-html** (`innerHtml`)设置 innerHTML 为 v-html 的值。

## computed 和 Watch 的区别?

- computed 计算属性 : 在初始化时就会执行一次，**依赖其它属性值**，并且 computed 的值 **有缓存**，当依赖的值变化时，它才会触发更新，是同步操作

- watch 更多是 `观察、无缓存`，相对于 computed 可以执行 `异步` 操作，设置中间状态。有两个参数
  - **immediate**：组件 `加载时立即执行回调`
  - **deep** 深度监听，但 `无法监听对象或者数组内部变化`

## v-for 中的 key 的作用？是必须的吗？

key 作为渲染元素的 `唯一标识`，可以优化渲染性能。

不推荐使用 index 作为 key，因为它 `并没有对更新时的渲染起到任何优化作用`。

例如：在第一次渲染时，渲染了 5 个 span 标签，它们的 key 分别为 `0、1、2、3、4`。这时 v-for 遍历的数组 `头部` 插入了一项新的值，页面进行 `更新`，渲染了 6 个 span 标签，它们的 key 变成了 `0、1、2、3、4、5`，虽然新的 `1、2、3、4、5` 就是之前的 `0、1、2、3、4`，但是在进行更新时，会拿 `key` 相同的去对比，这样一来就变成了 `旧的1和新的1（相当于旧的0）`、`旧的2和新的2（相当于旧的1）`......以此类推，明明本来只是 `新增了一个节点，其它节点都不用改变`，但是现在却变成了 `每个节点都需要更新`，影响了渲染性能。这也是为什么不提倡使用 `索引值index` 作为 key 的原因，因为它 `并没有对更新时的渲染起到任何优化作用`。

## data 为什么是函数?

单独 `维护一份组件数据对象的拷贝不会相互影响` 从而实现 `组件复用`

## slot 插槽作用、原理?

slot 是 **Vue 承载分发内容的出口**.

分为 3 类

- 匿名插槽 ` slot`，一个组件中只能有一个默认插槽，可以放在任何位置，不需要设置 name。
- 具名插槽 `slot.name`， 一个组件可以有多个具名插槽，，具名插槽 和 默认插槽 都 **只在 父组件 render 生成 vnode**
- 作用域插槽 `slot-scope`，**在子组件 render 阶段生成 vnode**，因此父组件可以拿到子组件的数据进行自定义展示

## keep-alive 是什么？

Keep-Alive 是 Vue 内置组件用来 `缓存组件状态`。原理是通过插槽的第一个组件的 name 去进行 include/exclude 内容匹配，若不需要缓存则返回该组件 VNode 信息，需要缓存则根据 VNode 的 key（没有则组件 tag + cid 生成 key）是否已在缓存中，否则以 key-组件实例缓存。

**三个属性**：

- exclude 字符串或正则表达式，任何名称匹配的组件都不会被缓存, `exclude优先级高于include`。

- include 字符串或正则表达式，只有名称匹配的组件会被匹配；
- max 数字，`最多可以缓存多少组件实例`。

> Vue 2 中可以给实例添加 name 属性，Vue3 如果要对组件进行 keep-alive 则需要在 defineOptions 提供组件 name。

**两个生命周期**：

组件 `不会再触发beforeDestroy 和 destroyed` 生命周期

- `activated` / `deactivated` 判断当前组件是否激活/销毁

**一个 `LRU`（Least Recently Used） 算法**：

- 维护一个 key 数组和一个缓存对象，当缓存数量超过 max 数值时，keep-alive 会移除掉 key 数组的第一个元素

## $nextTick 原理及作用？

作用：在 `下次 DOM 更新循环结束之后执行延迟回调`，多次调用会 `存入队列并整合` 再进行数据变更。

原理：根据执行环境 **按序** 尝试定义一个异步方法。

1. Promise
2. MutationObserver
3. setImmidiate
4. setTimeout

## Vue 的生命周期？

`生命周期` 就是 `一个 vue 实例从创建到销毁` 的过程。

Vue2 生命周期函数（钩子回调）：

- beforeCreate：Vue 实例初始化，data 和 methods 中的数据还未初始化，无法访问 this
- created： data、methods、computed、watch 都可以使用，`完成响应式`。DOM 还未渲染。一般在此实现异步请求，请求更快，而且 SSR 中没有 beforeMounted 和 Mounted 钩子，有助于一致性
- beforeMount：模板编译完成，生成虚拟 DOM 尚未挂载
- mounted：Vue 实例初始化完毕，可以访问真实 DOM 节点
- beforeUpdate：data 发生更新，DOM 还未更新渲染
- updated：DOM 完成更新，更新阶段操作数据，容易引起性能问题和死循环
- beforeDestroy：组件准备销毁，所有数据都可以正常访问，可以清理一些定时器
- destoryed：Vue 实例完成销毁，数据、指令、事件等不再可用
- actived：**用 `keep-alive` 包裹的组件在切换时不会进行销毁**，而是缓存到内存中并执行 `deactivated` 钩子函数，命中缓存渲染后会执行 `activated` 钩子函数。
- deactived：当前组件处于非活跃状态

Vue 3

- 在 `Vue3` 中，去掉了 `beforeCreate`、`created` 两个生命周期函数，用 `setup` 来替代（也就是说在 setup 中写的代码，相当于之前在这两个函数中写的代码）
- 在 `Vue3中`，将 `beforeDestroy`、`destroyed` 两个生命周期函数更名为 `onBeforeUnmount`、`onUnmounted`
- 在 `Vue3` 中，其它生命周期函数并没有改变，只是在每个生命周期函数前面加上了一个 `on`

## 父子组件生命周期调用顺序？

组件的调用顺序是 `先父后子`，渲染完成的顺序是 `先子后父`

组件的销毁顺序是 `先父后子`，销毁完成的顺序是 `先子后父`

- 渲染顺序
  父 beforeCreate -> 父 created -> 父 beforeMounded ->  `子beforeCreate -> 子created -> 子beforeMounded -> 子mounted` -> 父 mounted
- 更新顺序
  父 beforeUpdate -> `子beforeUpdate -> 子updated` -> 父 updated
- 销毁顺序
  父 beforeDestroy -> `子beforeDestroy -> 子destroyed` -> 父 destroyed

## Vue 组件通信

所有的通信方式都是 `单向数据流`，便于 `集中管理组件状态`

1. **props + $emit**：父组件通过`props`的方式向子组件传递数据，子组件触发`$ emit` 向父组件通信
2. $refs 获取组件实例
3. **parent + children** 获取 parent 实例和 children 实例，children 实例返回一个数组
4. **attrs + $ listener**：

- $attrs：继承`除props、class style 外所有父组件属性`， 一般 `v-bind = "$ attrs "`
- `$listeners`：继承父组件所有监听器，可以配合 `v-on="$listeners"`

5. **provide + inject** ： 组件中通过 `provide` 提供变量, 其他组件中通过 `inject` 来注入非响应式变量，可以通过：`传递父组件实例`、`使用Vue.observable`、`使用computed` 实现注入响应式变量
6. **vuex**
7. **EventBus**: 事件总线一般在 main.js 全局注册，然后通过 on + emit 监听触发

父子组件： 1、2、3

兄弟组件：6、7

隔代组件：4、5、6、7

## Vuex 的原理

**Vuex 是状态管理器，通过 store 仓库集中式管理应用所有组件状态**.

- store 仓库中的 state 变化，相应组件高效更新
- 改变 store 状态的唯一途径是显式提交 commit mutation
- **vuex 的状态保存在内存中，刷新页面 vuex 存储的值会消失**

Vue 组件更新的流程：

1. Vue 组件执行 dispatch 方法触发 actions
2. Actions 操作行为模块，异步用于提交 mutation
3. mutation（type, listener） 是更改 vuex 状态的唯一方法，过程同步
4. State 集中存储页面状态

![](https://cdn.nlark.com/yuque/0/2020/png/608421/1587353295161-ed915b6c-8c41-454d-8c6e-8fc47e456010.png#align=left&display=inline&height=551&margin=%5Bobject%20Object%5D&originHeight=551&originWidth=701&status=done&style=none&width=71）)

## Vue-Router 的路由模式

- hash 模式 #

  - 原理是 `location.hash + onhashchange ` 事件, 触发浏览器 `锚点` 变化，不会进行刷新网页

  - 监听路由 hash 变化

  - ```js
    // 1. 监听$route,当路由发生变化的时候执行
    watch: {
      $route: {
        handler: function(val, oldVal){
          console.log(val);
        },
        // 深度观察监听
        deep: true
      }
    }
    // 2.  通过window.location.hash 获取
    ```

- histroy 模式

  - 主要利用 `pushState()` 和 `replaceState()` 来改变 URL，使用这两种方法，可以给浏览器的历史记录添加一条新纪录或者替换记录，但是这两种方法改变 URL 时，`不会立即` 向服务器发送请求，只有在执行 `history.back()`、`history.forward()`、`history.go()` 的时候才会向服务器发送请求，可以通过监听 `popstate事件`，来监听浏览器的 `前进回退操作`，然后进行 `路由的匹配`。
  - `刷新404`： 线上环境服务器只有 `一个入口index.html`, 未配置的路由需要 `查找文件系统与路由进行匹配`，所以需要配置否则会报 404
  - `本地` 由于开发服务器会 `捕获所有路由导向vue项目的入口文件`，因此 `刷新不会404`

## route 路由信息和 router 路由实例的区别

- $route 是**路由信息对象**，包括` path，params，hash，query，fullPath，matched，name` 等路由信息参数
- $router 是**路由实例对象**包括了路由的`跳转方法，钩子函数`等

### params 和 query

#### params 方式

- 配置路由格式：`/router/:id` 如 /router/123

- 路由跳转方式: **name + params**

- 通过 `$route.params` 获取传递的值

- 不在 url 展示参数，但是刷新会丢失 params 里面的数据

#### query 方式

- 配置路由方式： /router 如 `/route?id=123`

- 路由跳转方式: **path + query**

- 通过 `$route.query` 获取传递的值

- 会在 url 展示参数，刷新不会丢失 query 里面的数据

## 路由守卫

全局路由钩子

- **beforeEach**： 全局前置守卫 进入路由之前, 一般用于 **登录拦截**
- **beforeResolve**： 全局解析守卫（2.5.0+）在 `beforeRouteEnter` 调用之后调用
- **afterEach**： 全局后置钩子 进入路由之后，例如跳转之后 **滚动条回到顶部**

路由独享的守卫

- **beforeEnter** ：如果不想全局配置守卫的话，可以为某些路由单独配置守卫，有三个参数 ∶ to、from、next

组件内的守卫

- **beforeRouteEnter** ∶ 进入组件前触发, **此时组件还访问不到 this，需要传一个回调给 next 来访问**
- **beforeRouteUpdate** ∶ 当前地址改变并且改组件被复用时触发，举例来说，带有动态参数的路径 foo/∶ id，在 /foo/1 和 /foo/2 之间跳转的时候，由于会渲染同样的 foo 组件，这个钩子在这种情况下就会被调用
- **beforeRouteLeave** ∶ 离开组件被调用

### 完整的 VueRouter 导航解析流程

假设是 `从a组件离开，第一次进入b组件`

- 1.导航被触发。
- 2.在失活的组件里调用离开守卫 beforeRouteLeave。
- 3.调用全局的 beforeEach 守卫。
- 4.在重用的组件里调用 beforeRouteUpdate 守卫（2.2+）。
- 5.在路由配置里调用 beforeEnter。
- 6.解析异步路由组件。
- 7.在被激活的组件里调用 beforeRouteEnter。
- 8.调用全局的 beforeResolve 守卫（2.5+）。
- 9.导航被确认。
- 10.调用全局的 afterEach 钩子。
- 11.触发 DOM 更新。
- 12.用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数

## 虚拟 DOM 实现原理

`Virtual DOM ` 的本质就是用 **原生 JS 对象去描述 DOM 节点**，是对真实 DOM 的一层抽象。

### 模板编译原理

1. 解析模板，生成 AST 抽象语法树：包括元素节点、文本节点、指令等。
2. 优化 AST：例如·、静态根节点提取等优化操作，以提高渲染性能。
3. 生成代码：最后，Vue 的编译器会将 AST 转换为渲染函数的代码。这个渲染函数是一个 JavaScript 函数，接收一个参数 h，返回一个 Virtual DOM 节点。
4. 生成 Virtual DOM：渲染函数生成后，Vue 会使用它来生成 Virtual DOM，然后对比新旧 Virtual DOM，计算出需要更新的部分，最终只更新需要更新的部分。
5. 渲染：最后，Vue 将更新后的 Virtual DOM 渲染到真实的 DOM 中。

### diff 算法？Key 的作用？

diff 的过程就是 **先进行同级比较再递归比较子节点**。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e3c68d1b0884d9ca0f8ffc5ee64a28e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

key `作为Vnode的唯一标志`，可以让 diff `更加快速准确`。

体现在：

- 无 key 的 diff 过程: 在 `vnode` 不带 `key` 的情况下，每一轮的 `diff` 过程当中都是 `起始` 和 `结束` 节点进行比较，直到 `oldCh` 或者 `newCh` 被遍历完。

- 有 key 的 diff 过程: 给 `vdom` 上添加 `key` 属性后，遍历 `diff` 的过程中，当 **起始点**，**结束点** 的 **搜寻** 及 `diff` 出现还是无法匹配的情况下时，就会用 `key` 来作为唯一标识，来进行 `diff`

在 Vue2 中，diff 算法采用的是双指针进行 `头头相比、尾尾相比、头尾相比`，最终通过 `映射关系` 来确认可复用的节点，进行更新。

Vue3 中加入快速 diff 算法，`快速diff` 通过静态标记，对一些 `文本`、`空节点` 进行快速更新，`无key方式` 简单粗暴对比每一项，判断是否可以复用节点，`有key的方式` 依旧采用双指针，但是只进行 `头头相比、尾尾相比`，最终根据节点的索引关系，构造出一个最长增长子序列，对能复用的节点进行 patch，需要移动的节点进行移动，最终完成 diff 更新。

> 加入 `旧节点子元素列表的key` 为 [1,2,3,4,5]，经过数据变化，新的节点顺序变动，`key` 变成了 [1,3,5,2,4]，如果我们不进行任何优化，那么只有 1 是可复用的，我们需要把 `2、3、4、5` 四个节点分别移动到 `对应位置`，需要移动 `4次`。如果我们算出来了 `新节点列表的最长递增子序列`（[1,2,4]），那么我们可以保持这三个元素 `不做变动`，只将 `3、5` 两个元素进行移动，只需要移动 `2次`。这就是为什么 `最长递增子序列` 可以 `减少操作dom的次数`，从而达到优化的原因。

## Vue2 和 Vue3 的区别

- 使用 **Composition 组合式 API**
  - 通过引入{ref, reactive} 定义响应式，ref 返回一个 {value}的响应式对象
  - **生命周期改变**: `setup`() (beforeCreate + created)-> `onBeforeMount` -> `onMounted` => `onBeforeUpdate` => `onUpdated` => `onUnmount`（beforeDestroy） => `onUnmounted`（destroyed）
- **新的组件**

  - **Fragment**： `支持多根节点`

  - **Suspense**：异步组件，`允许在异步组件加载完成前渲染兜底内容`，如 loading。两个命名插槽: `#default（展示内容） + #fallback（加载内容）`.

  - **Teleport**: 允许 `将DOM移动到指定位置`(`to`)，如实现 Dialog

- 使用 **Proxy** 代替 Object.definProperty

  - Proxy 直接劫持对象，初始代理最外层对象，嵌套对象通过 Reflect。get 方法判断是否为 Object，调用 reactive 方法深度观测
  - Proxy 多达 13 种拦截方法，不限于 get、set、apply，ownKeys，deletePropery，has 等等
  - Proxy 可以 **监听数组变化**，当满足 2 个条件之一时，才会触发数组的 getter/setter

    - key 是代理数组自身属性

    - 新旧值相等

  - Proxy **存在浏览器兼容问题**，因此在 Vue3 才重写

- 虚拟 DOM 优化

  - `静态节点标记提升`: 首次加载后被提升到 render 方法之外，每次渲染被不停的复用。
  - `动态标签末尾加上 patchFlag`，diff 的时候只需要对比动态节点内容

- 源码引入 **Tree-Shaking** 技术体积变小

  - 可以减少 `冗余代码`，原理是通过 ES6 模块的 `静态分析`，在 `编译时` 分析出 `加载了哪些模块`，以及对 `未引用/未使用的变量、模块` 进行删除

- 支持 **TypeScript**

## Vue 3 中 为什么推荐 ref 而不是 reactive

`ref()` 接收 **基本类型和引用类型**，并将其包裹在一个带有 `.value` 属性的 ref 对象中返回。

`reactive()` 将使对象本身具有响应性，但存在限制：

**有限的值类型**: 只能用于 **对象类型** (对象、数组和如 `Map`、`Set` 这样的 [集合类型](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects#keyed_collections))。

**不能替换整个对象**: 必须始终保持对响应式对象的相同引用，重新赋值或者作为函数参数会丢失响应式

**对解构操作不友好**: 将响应式对象的原始类型属性解构为本地变量时，或者将该属性传递给函数时，我们将丢失响应性连接

## SSR 服务端渲染

同构渲染简单来说就是一份代码，在服务端先通过 **服务端渲染**(server-side rendering)，**生成静态 html 字符串以及初始化数据发送给浏览器**，客户端渲染 HTML 内容并下载打包 JS，此时 **不再创建 DOM** 而是通过在 **虚拟 DOM 真实 DOM 建立联系** 以及 **对 DOM 添加事件绑定** 进行 **客户端激活**，这个整体的过程叫同构渲染。

SSR 主要解决了 CSR 以下两种问题：

- SEO：搜索引擎优先爬取页面 `HTML` 结构，使用 `ssr` 时，服务端已经生成了和业务想关联的 `HTML`，有利于 `seo`
- **首屏** 呈现渲染：用户无需等待页面所有 `js` 加载完成就可以看到页面视图（压力来到了服务器，所以需要权衡哪些用服务端渲染，哪些交给客户端）

服务端渲染存在的问题：

- 生命周期只有 beforeCreate 和 created
- 代码要根据环境不同如 cookie，windows
- 服务端渲染会 **为每个请求生成一个新的应用实例**，避免 **状态污染**。
- **客户端代码** 可以用 **ClientOnly** 包裹

## 为什么 vite 更快

no bundle 方案是 **基于浏览器的 type 为 module 的 script 可以直接下载 es module 模块** 实现的。

起了个开发服务，根据请求 url 对模块进行编译，调用 vite 插件做不同模块的 transform。

但 node_modules 中有些包是 CommonJS 的，Vite 做了 **预构建** 也叫依赖优化：通过 ES Build 分析依赖、打包后输出 esm 包到 node_modules/.vite 下，**生成 metadata.json 记录 hash**

浏览器则通过对这些 **带了 hash 的 query 模块 max-age 强缓存, 通过修改 query 触发更新**

开发环境通过 es build 打包，**生产环境通过 rollup 打包，vite 插件兼容 rollup 插件**，因此保证生产环境和开发环境代码一致。

vite 还基于 chokidar 和 websocket 来实现了 **模块热更新**

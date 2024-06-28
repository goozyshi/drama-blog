---
date: 2024-06-28
category: Frontend
tags:
  - note 
  - vue 
spot: 巷寓
location: 深圳, 海滨中学
outline: deep
draft: true
---
# 《Vue.js 设计与实现》笔记

## 第一篇 框架设计

> "框架设计里到处体现了权衡的艺术"

### 1.权衡的艺术
#### 命令式和声明式

`命令式`关注过程
```js
const div = document.querySelector('#app')
div.innerText = 'Hello world'
div.addEventListener('click', () => {
  console.log('Clicked')
})
```

`声明式`关注结果
```html
<div @click="() =>console.log('Clicked')"> Hello world </div>
```
对于 Vue 而言，内部实现一定是命令式的，而暴露给用户使用的是声明式。

#### 性能与可维护性的权衡
如果我们把直接修改的性能消耗定义为 A，找出差异的性能消耗定义为 B，则有：

- 命令式代码更新性能消耗= A
- 声明式代码更新性能消耗= B + A

可见性能上： 命令式 > 声明式，而 Vue 使用声明式，是因为：**声明式的可维护性远大于命令式**。

更新页面时的性能比较：

| innerHtml  | 虚拟 DOM   | 原生 JS    |
| ---------- | ---------- | ---------- |
| 心智负担中 | 心智负担小 | 心智负担大 |
| 性能差     | 性能中     | 性能高     |
| /          | 可维护性强 | 可维护性差 |

对比发现虚拟DOM的性能并不是最高的，但他的心智负担即可维护性是最高的，所以 Vue 使用虚拟 DOM 进行渲染层的构建。这也是一种权衡。

#### 运行时和编译时

>**运行时：`runtime`**：**利用 render 函数，直接把 虚拟 `DOM` 转化为 真实 `DOM` 元素** 的一种方式
>
>**编译时：compiler**: **直接把 `template` 模板中的内容，转化为 真实 `DOM` 元素**。
>
>**运行时 + 编译时**: 1.先把 `template` 模板转化为 `render` 函数。也就是 **编译时**;2.再利用 `render` 函数，把 虚拟 `DOM` 转化为 真实 `DOM`。也就是 **运行时**

### 2.框架设计的核心要素

- 通过环境变量（`__DEV__`） 和 Tree-Shaking 控制打包体积
- 构建不同环境(dev/prod 或 node/browser) 构建不同产物(环境监测 + IIFE)
- 内部通过 `callWithErrorHandling` 统一处理错误，通过`registerErrorHanlder`注册错误处理程序
- 支持TypeScript，添加类型判断，保证开发体验

### 3. Vue.js 3 的设计思路

UI形式 -> 渲染器 -> 组件 -> 编辑器

在 Vue 中 UI 形式有两种：

- 声明式（template 模板）会被 **编辑器** 编译，得到 **渲染函数 `render`** 

  ```vue
  <di :id="id" @click="onClick"></div>
  ```

- 命令式 render 函数 (JSX)

  ```js
  import { h } from 'vue'
  export default {
    render () {
      return h('h1', {onClick: handler }) // 虚拟 DOM
    }
  }
  ```

渲染器是 **函数 `createRenderer` 的返回值，是一个对象。被叫做 `renderer`**。

 **`renderer` 对象中有一个方法 `render`**，这个 `render` ，就是我们常说的**渲染函数**。



**渲染函数**接收两个参数 `VNode` 虚拟DOM 和 `container` 挂载容器。

**组件**本质上是一组 `DOM` 的集合，所以渲染一个一个的组件，本质上就是在渲染一组这一组的 `DOM`。

## 第二篇 响应系统实现原理

## 第三篇 渲染器编译模板

## 第四篇 组件化

## 第五篇 编译器

## 第六篇 服务端渲染
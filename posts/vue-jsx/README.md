---
date: 2023-08-26
category: Frontend
tags:
  - Vue
spot: 巷寓
location: 深圳，海滨社区
outline: deep
---

# Vue 中 JSX 写法

## 开启

在 Vue 模板中声明 ` lang=jsx` 即可

```js
<template lang="jsx">
export default function () { return <h1>{this.hello}</h1> }
</template>
<script>
export default {
  data: () => ({
    hello: 'world'
  })
}
</script>
```

## 基础

### 样式

直接使用 `class="xx"` 来指定样式类，内联样式可以直接写成 `style="xxx"`

三目运算符进行判断

```html
<div class="btn btn-default" style="font-size: 12px;">Button</div>

<!-- 动态指定 -->
<div class={`btn btn-${this.isDefault ? 'default' : ''}`}></div>
<div class={{'btn-default': this.isDefault, 'btn-primary': this.isPrimary}}></div>
<div style={{color: 'red', fontSize: '14px'}}></div>
```

### 值

在 JSX 中使用单个括号来绑定文本插值，使用 `domPropsInnerHTML` 代替 `v-html`

```js
<span>Message: {this.messsage}</span>
<!-- 类似于v-html -->
<div domPropsInnerHTML={this.dangerHtml}/>
<!-- v-model -->
<el-input v-model={this.vm.name} />
```

### 遍历

使用 `map `

```jsx
 /* 类似于v-if */ 
{
  this.withTitle && <Title />;
}

/* 类似于v-if 加 v-else */ 
{
  this.isSubTitle ? <SubTitle /> : <Title />;
}

 /* 类似于v-for */ 
{
  this.options.map((option) => {
    <div>{option.title}</div>;
  });
}
```

### 事件绑定

原生事件添加 `nativeOn`，其他事件名称前加上 `on` 前缀。

::: danger 注意

如果需要给事件处理函数传参数，需要使用 **箭头函数** 来实现。如果不使用箭头函数那么接收的将会是事件的对象 `event` 属性

::::

```html
<!-- 对应 @click -->
<buton onClick={this.handleClick}>Click me</buton>
<!-- 对应 @click.native -->
<button nativeOnClick={this.handleClick}>Native click</button>
<!-- 传递参数 -->
<button onClick={e => this.handleClick(this.id)}>Click and pass data</button>
```

## 进阶

### 事件修饰符

| 修饰符   | 等价操作                |
| -------- | ----------------------- |
| .stop    | event.stopPropagation() |
| .prevent | event.preventDefault()  |

下面是在事件处理函数中使用修饰符的例子：

```js
methods: {
  keyup(e) {
    // 对应`.self`
    if (e.target !== e.currentTarget) return
    
    // 对应 `.enter`, `.13`
    if (!e.shiftKey || e.keyCode !== 13) return
    
    // 对应 `.stop`
    e.stopPropagation()
    
    // 对应 `.prevent`
    e.preventDefault()
    
    // ...
  }
}
```

### 插槽（v-slot)

在 jsx 中可以使用 `this.$slots` 来访问静态插槽的内容。

```jsx
<div class="page-header__title">
    {this.$slots.title ? this.$slots.title : this.title}
</div>


等价于

<div class="page-header__title">
  <slot name="title">{{ title }}</slot>
</div>
```

在 Vue 官方文档中提到：**父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。** 因此像下面的示例是无法正常工作的

```js
<current-user>
    {{ user.firstName }}
</current-user>
```

在 `<current-user>` 组件中可以访问到 `user` 属性，但是提供的内容却是在父组件渲染的。如果想要达到期望的效果，这个时候就需要使用**作用域插槽**了。下面是改写后的代码，更多知识点可以直接查看官方文档的[作用域插槽](https://xie.infoq.cn/link?target=https%3A%2F%2Fwww.oschina.net%2Faction%2FGoToLink%3Furl%3Dhttps%3A%2F%2Flink.segmentfault.com%2F%3Fenc%3DpQZmqZ2HXI52m7cATC427w%253D%253D.YjHdAqt%252FIDjNy5ESgTCTHu6mnGuVWAEFA%252FbWEjQyCHOkxoNDeN5C6zdJXCNdVK1vCHUXUgDOPdEECgUXK4GiMyi9cpC9FQziJmHnYoFLcN0vqlk2G85WNS2DqGNszPuHdh4kOctD4qOJsNf0RwbXpQ%253D%253D)。

```jsx
<!-- current-user组件定义部分 -->
<span>
    <slot v-bind:user="user">
      {{ user.lastName }}
  </slot>
</span>

<!-- current-user 使用 -->
<current-user>
    <template v-slot:default="slotProps">
      {{ slotProps.user.firstName }}
  </template>
</current-user>
```

上面的示例其实就是官方的示例，这里需要说明的是，其实在 Vue 中所谓的作用域插槽功能类似于 React 中的 **Render Props** 的概念，只不过在 React 中我们更多时候不仅提供了属性，还提供了操作方法。但是在 Vue 中更多的是提供数据供父作用域渲染展示，当然我们也可以把方法提供出去，例如：

```jsx
<template>
    <div>
    <slot v-bind:injectedProps="slotProps">
      {{ user.lastName }}
      </slot>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        user: {
          firstName: 'snow',
          lastName: 'wolf'
        }
      }
    },
    
    computed: {
      slotProps() {
        return {
          user: this.user,
          logFullName: this.logFullName
        }
      }
    },
    
    methods: {
      logFullName() {
        console.log(`${this.firstName} ${this.lastName}`)
      }
    }
  }
</script>
```

在父组件中使用：

```html
<current-user>
    <template v-slot:default="{ injectedProps }">
      <div>{{ injectedProps.user.firstName }}</div>
        <el-button @click="injectedProps.logFullName">Log Full Name</el-button>
  </template>
</current-user>
```

在上面的代码中我们实际上使用解构的方式来取得 `injectedProps`，基于解构的特性还可以重命名属性名，在 `prop` 为 `undefined` 的时候指定初始值。

```jsx
<current-user v-slot="{ user = { firstName: 'Guest' } }">
  {{ user.firstName }}
</current-user>
```

如果组件只有一个默认的插槽还可以使用缩写语法，将 `v-slot:default="slotProps"` 写成 `v-slot="slotProps"`，命名插槽写成 `v-slot:user="slotProps"`，如果想要**动态插槽名**还可以写成 `v-slot:[dynamicSlotName]`，此外**具名插槽**同样也有缩写语法，例如 `v-slot:header` 可以被重写为`#header`

上面介绍了很多插槽相关的知识点足已说明其在开发过程中的重要性。说了很多在模板中如何定义和使用作用域插槽，现在进入正题如何在 jsx 中同样使用呢？

```js
// current-user components
{
  data() {
    return {
      user: {
        firstName: 'snow',
        lastName: 'wolf'
      }
    }
  },
    
  computed: {
    slotProps() {
      return {
        user: this.user,
        logFullName: this.logFullName
      }
    }
  },
    
  methods: {
    logFullName() {
      console.log(`${this.firstName} ${this.lastName}`)
    }
  },
    
  render() {
    return (
        <div>
        {this.$scopedSlots.subTitle({
          injectedProps: this.slotProps
        })}
      </div>
    )
  }
}
```

然后在父组件中以 jsx 使用：

```jsx
<current-user {...{
  scopedSlots: {
    subTitle: ({ injectedProps }) => (
        <div>
          <h3>injectedProps.user</h3>
        <el-button onClick={injectedProps.logFullName}>Log Full Name</el-button>
      </div>
    )
  }
}}></current-user>
```

### 指令

这里需要注意的是在 jsx 中所有 Vue 内置的指令除了 `v-show` 以外都不支持，需要使用一些等价方式来实现，比如 `v-if` 使用三目运算表达式、`v-for` 使用 `array.map()` 等。

对于自定义的指令可以使用 `v-name={value}` 的语法来写，需要注意的是指令的参数、修饰符此种方式并不支持。以官方文档指令部分给出的示例 `v-focus` 使用为例，介绍二种解决办法：

1 **直接使用对象传递所有指令属性**

```js
<input type="text" v-focus={{ value: true }} />
```

2 **使用原始的 vnode 指令数据格式**

```html
{
  directives：{
    focus: {
      inserted: function(el) {
        el.focus()
      }
    }
  },
    
  render() {
    const directives = [
      { name: 'focus', value: true }
    ]
      
    return (
      <div>
          <input type="text" {...{ directives }} />
      </div>
    )
  }
}
```

### 过滤器

过滤器其实在开发过程中用得倒是不多，因为**更多时候可以通过计算属性来对数据做一些转换和筛选**。这里只是简单提及一下并没有什么可以深究的知识点。

在模板中的用法如下：

```jsx
<!-- 在双花括号中 -->
{{ message | capitalize }}

<!-- 在 `v-bind` 中 -->
<div v-bind:id="rawId | formatId"></div>
```

在 jsx 中使用方法为：

```html
<div>{this.$options.filters('formatDate')('2019-07-01')}</div>
```

### ref

在 Vue 中 `ref` 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 `$refs` 对象上。如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件。

> **注意**：
>
> - 因为 ref 本身是作为渲染结果被创建的，在初始渲染的时候你不能访问它们 - 它们还不存在
> - `$refs` 不是响应式的，因此你不应该试图用它在模板中做数据绑定。

当 `v-for` 用于元素或组件的时候，引用信息将是包含 DOM 节点或组件实例的数组。

假如在 jsx 中想要引用遍历元素或组件的时候，例如：

```html
const LiArray = () => this.options.map(option => (
  <li ref="li" key={option}>{option}</li>
))
```

会发现从 `this.$refs.li` 中获取的并不是期望的数组值，这个时候就需要使用 `refInFor` 属性，并置为 `true` 来达到在模板中 `v-for` 中使用 `ref` 的效果：

```html
const LiArray = () => this.options.map(option => (
  <li ref="li" refInFor={true} key={option}>{option}</li>
))
```


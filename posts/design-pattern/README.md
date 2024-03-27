---
date: 2022-09-13
category: Frontend
tags:
  - Network
  - Pattern
  - Javascript
spot: 家里
location: 汕尾, 上英镇
outline: deep
---

# JS 设计模式

## 单例模式

- 核心：确保一个类只有一个实例，供全局访问
- 实现：用一个`变量`标志是否创建过对象，有则直接返回该对象

```javascript
class Singleton {
  constructor(name) {
    this.name = name;
    this.instance = null;
  }
  static getInstance(name) {
    return this.instance || (this.instance = new Singleton(name));
  }
}
const a = Singleton.getInstance(`a`); // Singleton {name: "a", instance: null}
const b = Singleton.getInstance(`b`); // Singleton {name: "a", instance: null}
a === b; // true
```

### 例： 封装 el-message 组件

```javascript
// create by goozyshi 2021-03-05
// 封装消息组件，多次触发只展示最新一条信息
import { Message } from "element-ui";
let msgInstance = null;
const singleMessage = (options = {}) => {
  // 如果弹窗已存在先关闭
  if (msgInstance) {
    msgInstance.close();
  }
  msgInstance = Message(options);
  return msgInstance; // 返回实例
};

// 支持 this.$singleMessge.warning('msg') 调用
["success", "warning", "info", "error"].map((type) => {
  singleMessage[type] = (options) => {
    if (typeof options === "string") {
      options = {
        message: options,
      };
    }
    options.type = type;
    return singleMessage(options);
  };
});

export default singleMessage;
```

```javascript
// 提示并添加点击事件
this.msgInstance = this.$singleMessage({
  type: "info",
  showClose: true,
  duration: 0,
  dangerouslyUseHTMLString: true,
  message:
    '您有需要审核的调整申请，点击<span style="font-weight: bold; color: #409eff; cursor:pointer">详情</span>',
});
this.msgInstance.$el.querySelector("span").onclick = () => {
  const { detailIds = [] } = res.data.data;
  this.$router.push({ path: "/areaOrderRecord", query: { detailIds } });
  this.msgInstance.close();
};
```

## 工厂模式

- 核心： 不暴露创建对象的具体逻辑，而是将将逻辑封装在一个函数中（工厂）

```javascript
// 工厂方法
class User {
  constructor(role, rights = []) {
    if (new.target === "User") {
      throw new Error("抽象类不能实例化");
      // 只能通过继承使用
    }
    this.role = role;
    this.rights = rights;
  }
}

class UserFactory extends User {
  constructor(role, rights) {
    super(role, rights);
  }
  getInstance(role) {
    switch (role) {
      case "admin":
        return new User("admin", ["index", "setting"]);
        break;
      case "tourist":
        return new User("tourist", ["index"]);
        break;
      default:
        throw new Error(`参数错误`);
    }
  }
}

const user = new UserFactory();
const admin = user.getInstance("admin"); // User {role: "admin", rights: Array(2)}
const tourist = user.getInstance("tourist"); // User {role: "tourist", rights: Array(1)}
```

## 发布订阅模式

- 核心： 定义对象间一对多的依赖关系，订阅者订阅后，发布者统一给订阅者发布消息
- 实现：定义缓存列表存放回调函数及订阅对象，发布时遍历该缓存列表，依次触发里面的回调函数

NodeJS 的 events 模块只提供了一个对象： `events.EventEmitter`

`EventEmitter`的核心就是事件触发与事件监听器功能的封装，实现原理即发布订阅模式

- **addListener / on**`(event, listener)`: 为指定事件添加一个监听器到监听器数组
- **once**`(event, listener)`：指定事件注册一个单次监听器，即 监听器`最多只会触发一次，触发后立刻解除`该监听器
- **removeListener / off**`(event, listener)`：移除指定事件的某个监听器，监听器必须是该事件已经注册过的监听器。
- **emit**`(event, …args)`：按监听器的顺序执行执 行每个监听器

```javascript
// 简单实现
class EventEmitter {
  constructor() {
    this.handler = {};
  }
  on(type, listener) {
    this.handler[type]
      ? this.handler[type].push(listener)
      : (this.handler[type] = [listener]);
  }
  emit(type, ...args) {
    this.handler[type] && this.handler[type].map((cb) => cb(...args));
  }
  off(type) {
    this.handler[type] && Reflect.deleteProperty(this.handler, type);
  }
  once(type, listener) {
    this.on(type, (...args) => {
      listener(...args);
      this.off(type);
    });
  }
}
const events = new EventEmitter();
events.on("click", () => console.log(`click`));
events.emit("click");
events.once("once", () => console.log(`once`));
events.emit("once");
```

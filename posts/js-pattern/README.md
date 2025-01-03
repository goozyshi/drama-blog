---
date: 2024-10-24
category: Frontend
tags:
  - design-pattern
spot: 云海路
location: 深圳，软件产业基地
outline: deep
---

# 前端常见的设计模式

## 创建型模式

### 创建型-简单工厂模式

#### 优点

1. 封装了对象创建过程，客户端无需关心对象的创建细节。
2. 提高代码的可维护性和可读性。
3. 通过传递参数来创建不同的对象，灵活性高。

#### 缺点

1. 工厂类集中了所有对象的创建逻辑，职责过重，违反单一职责原则。
2. 增加新的产品时需要修改工厂类，不符合开放封闭原则。

#### 使用场景

1. 需要创建多个相似对象时，可以使用简单工厂模式。
2. 客户端不需要关心对象的创建过程，只需传递参数即可获得对象。

#### 代码示例

```javascript
function User(name, age, role, responsibilities) {
  this.name = name;
  this.age = age;
  this.role = role;
  this.responsibilities = responsibilities;
}

function UserFactory(name, age, role) {
  let responsibilities;
  switch (role) {
    case "developer":
      responsibilities = ["写代码", "修Bug"];
      break;
    case "designer":
      responsibilities = ["设计界面", "制作原型"];
      break;
    case "manager":
      responsibilities = ["管理团队", "制定计划"];
      break;
    // ...existing code...
  }
  return new User(name, age, role, responsibilities);
}

const user1 = UserFactory("张三", 28, "developer");
const user2 = UserFactory("李四", 32, "designer");
console.log(user1);
console.log(user2);
```

### 创建型-抽象工厂模式

#### 优点

1. 分离具体类的生成过程，符合开放封闭原则。
2. 提供创建一系列相关或依赖对象的接口，无需指定具体类。
3. 易于扩展，增加新的产品族时无需修改现有代码。

#### 缺点

1. 增加系统的抽象性和复杂性。
2. 增加了代码量，理解和维护成本较高。

#### 使用场景

1. 需要创建一系列相关或依赖对象的场景，例如跨平台应用的界面创建。
2. 需要提供一个产品族的多个对象时，例如不同品牌的手机、电脑等。

#### 代码示例

```javascript
// 抽象工厂类
class DeviceFactory {
  createOS() {
    throw new Error("抽象工厂方法不允许直接调用，你需要将我重写！");
  }
  createHardware() {
    throw new Error("抽象工厂方法不允许直接调用，你需要将我重写！");
  }
}

// 具体工厂类
class AppleFactory extends DeviceFactory {
  createOS() {
    return new iOS();
  }
  createHardware() {
    return new AppleHardware();
  }
}

// 抽象产品类
class OS {
  controlHardware() {
    throw new Error("抽象产品方法不允许直接调用，你需要将我重写！");
  }
}

// 具体产品类
class iOS extends OS {
  controlHardware() {
    console.log("我会用iOS的方式去操作硬件");
  }
}

class AppleHardware {
  operateByOrder() {
    console.log("我会用苹果的方式去运转");
  }
}

// 使用抽象工厂模式创建对象
const myDevice = new AppleFactory();
const myOS = myDevice.createOS();
const myHardware = myDevice.createHardware();
myOS.controlHardware(); // 输出"我会用iOS的方式去操作硬件"
myHardware.operateByOrder(); // 输出"我会用苹果的方式去运转"
```

### 创建型-单例模式：确保唯一实例

#### 优点

1. 确保一个类只有一个实例，节省内存开销。
2. 提供全局访问点，方便访问和管理实例。
3. 可以延迟实例化，只有在需要时才创建实例。

#### 缺点

1. 单例模式可能会导致类的职责过重，难以维护。
2. 不利于扩展，单例类的修改可能会影响全局。

#### 使用场景

1. 需要确保某个类只有一个实例时，例如数据库连接池、线程池等。
2. 需要提供全局访问点的场景，例如全局配置管理、日志记录器等。

#### 代码示例

```javascript
class Singleton {
  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}
const s1 = Singleton.getInstance();
const s2 = Singleton.getInstance();
console.log(s1 === s2); // true
```

或者用闭包的形式实现：

```js
Singleton.getInstance = (function () {
  let instance = null;
  return function () {
    if (!instance) {
      instance = new Singleton();
    }
    return instance;
  };
})();
```

#### Vuex 如何确保 Store 的单一性

Vuex 插件通过 install 方法，在插件安装时将 Store 注入到 Vue 实例中，也就是每次安装都会注入 Store 到实例中。

```js
let Vue;
export function install(_Vue) {
  if (Vue && Vue === _Vue) {
    // 非生产环境提示
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "[vuex] already installed. Vue.use(Vuex) should be called only once."
      );
    }
    return;
  }
  Vue = _Vue;
  applyMixin(Vue);
}
```

如果没有使用单例模式，多次 Vue.use(Vuex) 反复注入 Store，就会重复覆盖之前的实例，导致数据丢失。

#### 设计一个单例模式弹框

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>单例模式弹框</title>
  </head>
  <style>
    #modal {
      height: 200px;
      width: 200px;
      line-height: 200px;
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border: 1px solid black;
      text-align: center;
    }
  </style>
  <body>
    <button id="open">打开弹框</button>
    <button id="close">关闭弹框</button>
  </body>
  <script>
    // 核心逻辑，这里采用了闭包思路来实现单例模式
    const Modal = (function () {
      let modal = null;
      return function () {
        if (!modal) {
          modal = document.createElement("div");
          modal.innerHTML = "我是一个全局唯一的Modal";
          modal.id = "modal";
          modal.style.display = "none";
          document.body.appendChild(modal);
        }
        return modal;
      };
    })();

    // 点击打开按钮展示模态框
    document.getElementById("open").addEventListener("click", function () {
      // 未点击则不创建modal实例，避免不必要的内存占用;此处不用 new Modal 的形式调用也可以，和 Storage 同理
      const modal = new Modal();
      modal.style.display = "block";
    });

    // 点击关闭按钮隐藏模态框
    document.getElementById("close").addEventListener("click", function () {
      const modal = new Modal();
      if (modal) {
        modal.style.display = "none";
      }
    });
  </script>
</html>
```

### 创建型-原型模式

#### 优点

1. 可以克隆对象，避免重复创建相同对象，节省内存。
2. 通过原型链实现对象的继承，方法和属性可以共享，节省资源。
3. 动态添加或修改对象的属性和方法，灵活性高。

#### 缺点

1. 需要对原型链有深入理解，使用不当可能导致难以调试和维护。
2. 不能克隆不可枚举的属性和方法。

#### 使用场景

1. 当需要创建多个相似对象时，可以使用原型模式来克隆对象。
2. 当需要动态添加或修改对象的属性和方法时，可以使用原型模式。

#### 代码示例

```javascript
// 创建一个Person构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function () {
  console.log(`Hello, my name is ${this.name}`);
};

// 使用Person构造函数创建person实例
const person1 = new Person("Alice", 30);
const person2 = Object.create(Person.prototype);
person2.name = "Bob";
person2.age = 25;

person1.greet(); // 输出"Hello, my name is Alice"
person2.greet(); // 输出"Hello, my name is Bob"
```

#### 深拷贝的实现

需要考虑两个问题： 栈爆 + 循环引用。

[深拷贝的终极实现](https://segmentfault.com/a/1190000016672263)

```js
/**
 * 以下代码可以生成不同深度、广度的数据
 * createData(1, 2); 1层深度，每层有3个数据 {data: {0: 0, 1: 1,}}
 * createData(2, 0);  3层深度，每层有0个数据 {data: {data: {}}}
 */
function createData(deep, breadth) {
  let data = {};
  let temp = data;

  for (let i = 0; i < deep; i++) {
    temp = temp["data"] = {};
    for (let j = 0; j < breadth; j++) {
      temp[j] = j;
    }
  }
  return data;
}
// 递归实现 ==> 栈爆
function deepCopy(target, wm = new WeakMap()) {
  if (typeof target !== "object" || target === null) return target;
  let res = Array.isArray(target) ? [] : {};
  if (wm.get(target)) return wm.get(target);
  wm.set(target, res);
  for (let key in target) {
    if (target.hasOwnProperty(key)) {
      res[key] = deepCopy(target[key], wm);
    }
  }
  return res;
}

const x = deepCopy(createData(10));
const y = deepCopy(createData(1000)); // ok
const z = deepCopy(createData(10000)); // Maximum call stack size exceeded
```

## 结构型模式

### 结构型-装饰器模式

#### 优点

1. 动态扩展对象功能，不修改原有代码。
2. 可以多个装饰器组合使用，灵活性高。

#### 缺点

1. 可能会增加代码复杂度，难以理解。
2. 多层装饰器嵌套可能导致调试困难。

#### 使用场景

1. 需要动态添加功能的对象。

2. 不希望修改原有代码的情况下扩展功能。

#### 相关案例

- HOC 高阶组件
- Objec.defineProperty
- [装饰模式库-https://github.com/jayphelps/core-decorators](https://github.com/jayphelps/core-decorators)
- 装饰器模式用于类以及类方法，由于存在**函数提升，不适用于函数**，如果非要装饰函数，可以使用高阶函数。

#### 代码示例

```javascript
import { readonly } from "core-decorators";

class Meal {
  // ES7 写法
  @readonly
  entree = "steak";
}

var dinner = new Meal();
dinner.entree = "salmon";
// Cannot assign to read only property 'entree' of [object Object]
```

源码实现

```javascript
import { decorate } from "./private/utils";

function handleDescriptor(target, key, descriptor) {
  descriptor.writable = false;
  return descriptor;
}

export default function readonly(...args) {
  return decorate(handleDescriptor, args);
}
```

### 结构型-适配器模式

#### 优点

1. 可以让不兼容的接口协同工作。
2. 提高了类的复用性。

#### 缺点

1. 增加了系统复杂度。
2. 可能会影响性能。

#### 使用场景

1. 需要兼容不同接口的类。
2. 需要复用现有类而不修改其代码。

#### 相关案例

- axios adapter: https://github.com/axios/axios/tree/main/lib/adapters

#### 代码示例

axios 在 Node 环境和浏览器环境下都可以调用相同的 api，得益于其使用适配器磨平两者差异。

在 [axios 的核心逻辑](https://github.com/axios/axios/blob/master/lib/core/Axios.js)中，可以注意到实际上派发请求的是 [dispatchRequest 方法](https://github.com/axios/axios/blob/master/lib/core/dispatchRequest.js)。该方法内部其实主要做了两件事：

1.  数据转换，转换请求体/响应体。适配数据格式
2.  调用适配器。

```javascript
var adapter = config.adapter || defaults.adapter;

return adapter(config).then(
  function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // 响应体转换
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      response.status,
      config.transformResponse
    );

    return response;
  },
  function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          reason.response.status,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  }
);
```

默认适配器

```javascript
function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== "undefined") {
    // For browsers use XHR adapter
    adapter = require("../adapters/xhr");
  } else if (
    typeof process !== "undefined" &&
    Object.prototype.toString.call(process) === "[object process]"
  ) {
    // For node use HTTP adapter
    adapter = require("../adapters/http");
  }
  return adapter;
}
```

### 结构型-代理模式

#### 优点

1. 控制对象访问，增加安全性。
2. 可以在不修改对象的情况下增加功能。

#### 缺点

1. 增加了系统复杂度。
2. 可能会影响性能。

#### 使用场景

1. 需要控制对对象的访问。
2. 需要在访问对象时增加额外功能。

#### 相关案例

- ES6 Proxy

#### 代码示例

```javascript
// 代理对象
const handler = {
  get: function (target, prop) {
    if (prop === "secret") {
      return "Vip 可见";
    }
    return target[prop];
  },
};

const target = {
  name: "John",
  age: "18",
};

const proxy = new Proxy(target, handler);

console.log(proxy.name); // John
console.log(proxy.secret); // Vip 可见
```

图片懒加载

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>虚拟代理示例</title>
  </head>
  <body>
    <img id="image" alt="Image" />
    <script>
      class PreLoadImage {
        constructor(imgNode) {
          this.imgNode = imgNode;
        }
        // 该方法用于设置真实的图片地址
        setSrc(targetUrl) {
          this.imgNode.src = targetUrl;
        }
      }

      class ProxyImage {
        // 占位图的url地址
        static LOADING_URL = "https://fakeimg.pl/200x100";

        constructor(targetImage) {
          // 目标Image，即PreLoadImage实例
          this.targetImage = targetImage;
        }

        // 该方法主要操作虚拟Image，完成加载
        setSrc(targetUrl) {
          // 真实img节点初始化时展示的是一个占位图
          this.targetImage.setSrc(ProxyImage.LOADING_URL);
          const virtualImage = new Image();
          // 图片加载完成DOM上src属性设置为目标图片的url
          virtualImage.onload = () => {
            this.targetImage.setSrc(targetUrl);
          };
          virtualImage.src = targetUrl;
        }
      }
    </script>
    <script>
      // 获取img节点
      const imgNode = document.getElementById("image");
      // 创建PreLoadImage实例
      const preLoadImage = new PreLoadImage(imgNode);
      // 创建ProxyImage实例
      const proxyImage = new ProxyImage(preLoadImage);
      // 设置真实图片的URL
      const realImageUrl = "https://placebear.com/200/100";
      // 使用代理设置图片的src
      proxyImage.setSrc(realImageUrl);
    </script>
  </body>
</html>
```

## 行为型模式

### 行为型-策略模式

#### 优点

1. 提供了算法的封装和复用，避免了多重条件语句的使用。
2. 可以动态地更改对象的行为，使得代码更加灵活。
3. 符合开闭原则，增加新的策略时无需修改原有代码。

#### 缺点

1. 客户端必须知道所有的策略类，并自行决定使用哪一个策略类。
2. 策略模式会增加系统类和对象的个数。

#### 使用场景

1. 当一个系统需要动态地在几种算法中选择一种时。
2. 当一个类定义了多种行为，并且这些行为在这个类的操作中以多个条件语句的形式出现时。

#### 代码示例

```javascript
// 定义策略类
class Strategy {
  execute(a, b) {
    throw new Error("This method should be overridden!");
  }
}

// 定义具体策略类
class ConcreteStrategyAdd extends Strategy {
  execute(a, b) {
    return a + b;
  }
}

class ConcreteStrategySubtract extends Strategy {
  execute(a, b) {
    return a - b;
  }
}

class ConcreteStrategyMultiply extends Strategy {
  execute(a, b) {
    return a * b;
  }
}

// 定义上下文类
class Context {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  executeStrategy(a, b) {
    return this.strategy.execute(a, b);
  }
}

// 使用策略模式
const context = new Context(new ConcreteStrategyAdd());
console.log(context.executeStrategy(5, 3)); // 输出 8

context.setStrategy(new ConcreteStrategySubtract());
console.log(context.executeStrategy(5, 3)); // 输出 2

context.setStrategy(new ConcreteStrategyMultiply());
console.log(context.executeStrategy(5, 3)); // 输出 15
```

### 行为型-状态模式

#### 优点

1. 将与特定状态相关的行为局部化，并且将不同状态的行为分割开来。
2. 使得状态转换显得更加清晰。
3. 符合开闭原则，增加新的状态时无需修改原有代码。

#### 缺点

1. 增加了系统的复杂性，需要定义多个状态类。
2. 状态模式的使用必然会增加系统类和对象的个数。

#### 使用场景

1. 当一个对象的行为取决于它的状态，并且它必须在运行时根据状态改变其行为时。
2. 当一个操作中含有庞大的分支结构，并且这些分支决定于对象的状态时。

#### 代码示例

```javascript
class CoffeeMaker {
  constructor() {
    // 初始化状态，没有切换任何咖啡模式
    this.state = "init";
    // 初始化牛奶的存储量
    this.leftMilk = "500ml";
  }
  stateToProcessor = {
    that: this,
    american() {
      // 尝试在行为函数里拿到咖啡机实例的信息并输出
      console.log("咖啡机现在的牛奶存储量是:", this.that.leftMilk);
      console.log("我只吐黑咖啡");
    },
    latte() {
      this.american();
      console.log("加点奶");
    },
    vanillaLatte() {
      this.latte();
      console.log("再加香草糖浆");
    },
    mocha() {
      this.latte();
      console.log("再加巧克力");
    },
  };

  // 关注咖啡机状态切换函数
  changeState(state) {
    this.state = state;
    if (!this.stateToProcessor[state]) {
      return;
    }
    this.stateToProcessor[state]();
  }
}

const mk = new CoffeeMaker();
mk.changeState("latte");
```

### 行为型-观察者模式

> 观察者模式和发布-订阅模式之间的区别，在于是否存在第三方、发布者能否直接感知订阅者

#### 优点

1. 实现了对象之间的松耦合。
2. 支持广播通信，通知所有订阅者。
3. 符合开闭原则，增加新的观察者时无需修改原有代码。

#### 缺点

1. 如果一个被观察者对象有很多直接和间接的观察者，会导致所有的观察者都被通知，可能会导致性能问题。
2. 如果观察者和被观察者之间存在循环依赖，可能会导致系统崩溃。

#### 使用场景

1. 当一个对象的改变需要通知其他对象时。
2. 当一个对象需要动态地添加或移除观察者时。

#### 代码示例

Node 中的 EventEmitter

```javascript
class EventEmitter {
  constructor () {
    this.emitList = []，
  }
  on (type, listener) {
    this.emitList[type] ? this.emitList[type].push(listener) : (this.emitList = [listener])
  }
  off (type) {
    delete this.emitList[type]
  }
  once (type, listener) {
    this.on(type, () => {
      listener()
      this.off(type)
    })
  }
  emit (type, ...args) {
    this.emitList.forEach(fn => fn(...args))
  }
}
const events = new EventEmitter()
events.on('click', () => console.log(`click`))
events.emit('click')
events.emit('click')
events.once('once', () => console.log(`once`))
events.emit('once')
events.emit('once')
```

Vue 2 中响应式系统实现

```javascript
// observe方法遍历并包装对象属性
function observe(target) {
  // 若target是一个对象，则遍历它
  if (target && typeof target === "object") {
    Object.keys(target).forEach((key) => {
      // defineReactive方法会给目标属性装上“监听器”
      defineReactive(target, key, target[key]);
    });
  }
}

// 定义订阅者类Dep
class Dep {
  constructor() {
    // 初始化订阅队列
    this.subs = [];
  }

  // 增加订阅者
  addSub(sub) {
    this.subs.push(sub);
  }

  // 通知订阅者（是不是所有的代码都似曾相识？）
  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    });
  }
}

function defineReactive(target, key, val) {
  const dep = new Dep();
  // 监听当前属性
  observe(val);
  Object.defineProperty(target, key, {
    enumerable: true, // 可枚举
    configurable: false, // 不可配置
    get: function () {
      return val;
    },
    set: (value) => {
      // 通知所有订阅者
      dep.notify();
    },
  });
}
```

### 行为型-迭代器模式

#### 优点

1. 提供一种方法顺序访问一个聚合对象中的各个元素，而又不暴露该对象的内部表示。
2. 支持不同的遍历方式。
3. 简化了聚合类的接口。

#### 缺点

1. 增加了类的数量。
2. 由于引入了迭代器，遍历的过程可能会变得复杂。

#### 使用场景

1. 需要访问一个聚合对象的内容而无需暴露其内部表示时。
2. 需要支持多种遍历方式时。
3. 需要遍历不同的集合对象时。

#### 代码示例

```javascript
// 定义一个迭代器生成函数
function createIterator(items) {
  let i = 0;
  return {
    next: function () {
      const done = i >= items.length;
      const value = !done ? items[i++] : undefined;
      return {
        done: done,
        value: value,
      };
    },
  };
}

// 使用迭代器遍历数组
const iterator = createIterator([1, 2, 3]);
console.log(iterator.next()); // { done: false, value: 1 }
console.log(iterator.next()); // { done: false, value: 2 }
console.log(iterator.next()); // { done: false, value: 3 }
console.log(iterator.next()); // { done: true, value: undefined }
```

## Referance

- [Java 设计模式：23 种设计模式全面解析](https://c.biancheng.net/design_pattern/)
- [设计模式二三事-美团技术团队](https://tech.meituan.com/2022/03/10/interesting-talk-about-design-patterns.html)

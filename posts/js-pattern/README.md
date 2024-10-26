---
date: 2024-10-24
category: Frontend
tags:
  - design-pattern
spot: 云海路
location: 深圳，软件产业基地
outline: deep
---

# 设计模式

## 创建型模式

### 工厂模式

工厂模式的核心思想是**将对象的创建过程封装起来**。

#### 简单工厂模式

设想一个系统需要根据不同的职业为用户分配特定的职责说明，即给每个职业的用户添加一个描述其工作内容的个性化字段。

```javascript
function User(name, age, career, work) {
  this.name = name;
  this.age = age;
  this.career = career;
  this.work = work;
}

function Factory(name, age, career) {
  let work;
  switch (career) {
    case "programmer":
      work = "编程";
      break;
    case "designer":
      work = "设计";
      break;
    case "manager":
      work = "管理";
      break;
    // ...
  }
  return new User(name, age, career, work);
}
```

#### 抽象工厂模式

上述工厂函数存在的问题是，每当增加新的职业时，都需要修改 Factory 函数的代码，这会导致 Factory 函数变得**越来越庞大**，最终变得难以维护，每次修改都可能引入新的错误。

为了解决这个问题，我们可以通过抽象工厂模式来优化。以智能手机的生产为例，一部智能手机的基本组成包括操作系统（OS）和硬件（Hardware）。如果我们要开设一个手机工厂，那么这个工厂必须同时准备好操作系统和硬件才能实现手机的**大规模生产**。考虑到操作系统和硬件背后可能有不同的供应商，而我们目前并不清楚下一个生产线具体要生产什么样的手机，只知道手机必须由这两部分组成，因此我们可以定义一个抽象类来**规定手机的基本组成**：

```javascript
class MobilePhoneFactory {
  createOS() {
    throw new Error("createOS 抽象方法必须被实现");
  }
  createHardware() {
    throw new Error("createHardware 抽象方法必须被实现");
  }
}

class OPhone extends MobilePhoneFactory {
  createOS() {
    // 安卓系统
    return new AndroidOS();
  }
  createHardware() {
    // 高通硬件
    return new QualcommHardware();
  }
}
```

定义操作系统的抽象类：

```javascript
class OS {
  handleHardware() {
    throw new Error("handleHardware 抽象方法必须被实现");
  }
}

class AndroidOS extends OS {
  handleHardware() {
    console.log("安卓处理硬件");
  }
}

class AppleOS extends OS {
  handleHardware() {
    console.log("🍎处理硬件");
  }
}
```

定义硬件的抽象类：

```javascript
class Hardware {
  operateByOrder() {
    throw new Error("operateByOrder 抽象方法必须被实现");
  }
}

class QualcommHardware extends Hardware {
  operateByOrder() {
    console.log("高通处理器");
  }
}

class MediaTekHardware extends Hardware {
  operateByOrder() {
    console.log("联发科处理器");
  }
}
```

生产过程：

```javascript
// 这是我的手机
const myPhone = new OPhone();
// 让它拥有操作系统
const myOS = myPhone.createOS();
// 让它拥有硬件
const myHardware = myPhone.createHardware();
// 启动操作系统（输出‘高通处理器’）
myOS.handleHardware();
// 唤醒硬件（输出‘安卓处理硬件’）
myHardware.operateByOrder();
```

当你想要更换手机品牌时，不需要修改`MobilePhoneFactory`，只需扩展新的工厂类，例如`VivoFactory`：

```javascript
class VivoFactory extends MobilePhoneFactory {
  createOS() {
    // 操作系统实现代码
  }
  createHardware() {
    // 硬件实现代码
  }
}
```

### 单例模式

如何确保一个类只有一个实例？这需要构造函数**具备判断自己是否已经创建过一个实例的能力**。

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

## 行为型模式

### 析构器模式

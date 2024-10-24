---
date: 2024-10-24
category: Frontend
tags:
  - design-pattern
spot: 云海路
location: 深圳，软件产业基地
outline: deep
---

# Design Pattern

## Create

### Factory

工厂模式其实就是**将创建对象的过程单独封装**。

#### 简单工厂

假设系统具备**给不同工种分配职责说明**的功能，也就是说，要给每个工种的用户加上一个个性化的字段，来描述他们的工作内容。

```js
function User(name, age, career, work) {
  this.name = name;
  this.age = age;
  this.career = career;
  this.work = work;
}

function Factory(name, age, career, work) {
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

#### 抽象工厂

上述 Factory 函数有个问题，就是每次增加工种时，就需要回去修改一次 Factory 的函数体，最终会导致**Factory 会变得异常庞大**，庞大到你每次添加的时候都不敢下手，生怕自己万一写出一个 Bug，就会导致整个 Factory 的崩坏。

以下面例子通过抽象工厂去完善：
大家知道一部智能手机的基本组成是操作系统 OS 和硬件 HardWare 组成。所以说如果我要开一个山寨手机工厂，那我这个工厂里必须是既准备好了操作系统，也准备好了硬件，才能实现手机的**量产**。考虑到操作系统和硬件这两样东西背后也存在不同的厂商，而我现在**并不知道我下一个生产线到底具体想生产一台什么样的手机**，我只知道手机必须有这两部分组成，所以我先来一个抽象类来**约定住这台手机的基本组成**：

```js
class MobilPhoneFactory {
  createOS() {
    throw new Error("createOS 抽象方法必须被实现");
  }
  createHardware() {
    throw new Error("createHardware 抽象方法必须被实现");
  }
}

class OPhone extends MobilPhoneFactory() {
  createOS() {
    // 安卓系统
    return new AndroidOS();
  }
  createHardware() {
    // 高通硬件
    return new QualcommHardWare();
  }
}
```

定义操作系统抽象类

```js
class OS () {
  handleHardware() {
    throw new Error("handleHardware 抽象方法必须被实现");
  }
}

class AndroidOS extends OS {
  handleHardware() {
    console.log(`安卓处理硬件`)
  }
}
class AppleOS extends OS {
  handleHardware() {
    console.log(`🍎处理硬件`)
  }
}
```

定义硬件抽象类

```js
class Hardware () {
  operateByOrder() {
    throw new Error("operateByOrder 抽象方法必须被实现");
  }
}

class QualcommHardWare extends Hardware {
  operateByOrder() {
    console.log(`高通处理器`)
  }
}
class MediaTekHardWare extends Hardware {
  operateByOrder() {
    console.log(`联发科处理器`)
  }
}
```

进入生产：

```js
// 这是我的手机
const myPhone = new OPhone();
// 让它拥有操作系统
const myOS = myPhone.createOS();
// 让它拥有硬件
const myHardWare = myPhone.createHardWare();
// 启动操作系统(输出‘我会用安卓的方式去操作硬件’)
myOS.controlHardWare();
// 唤醒硬件(输出‘我会用高通的方式去运转’)
myHardWare.operateByOrder();
```

当你选择换手机时, 不需要更改 MobilePhoneFactory，而进行拓展 VivoFactory：

```js
class VivoFactory extends MobilePhoneFactory {
  createOS() {
    // 操作系统实现代码
  }
  createHardWare() {
    // 硬件实现代码
  }
}
```

### Singleton

## Destructor

## Behavior

---
date: 2022-11-11
category: Frontend
tags:
  - Javascript
  - Notes
spot: 碧海新苑
location: 宝安，碧海湾
outline: deep
---

# JavaScript 知识

## 数据类型

**基本数据类型**

- undefined
- null
- Boolean
- String
- Symbol
- Number
- BigInt

Symbol 用来表示独一无二的的值，例如用作私有属性，如 `Object.prototype[Symbol.iterrator]`

BigInt 是大整数，用于 Number 类型只能表示 **-2 <sup> 53 </sup>-1 和 2 <sup> 53 </sup>-1** 间的数

```js
const yourBig = BigInt("99999999999999999");
console.log(yourBig); // 99999999999999999n

const big = 5n;
console.log(big / 2n); // 2n，而不是2.5n
```

**引用数据类型**

- Object

### 判断数据类型

- **typeof** -- `typeof null 的结果是Object`。在 32 位中，`null的值是全是0`，和 `000` 开头 object 一致
- **instanceof** -- 根据原型链判断， `[] instance Array` 与 `[] instance Object` 结果一致 true,
- **Object.prototype.toString** 在 `原型链的末端,Array 等继承并重写了toString`, 因此不能直接用来判断数据类型

```js
class Person {
  static sayName() {
    console.log(this);
  }
  toString() {
    console.log(`自定义ToSting`);
  }
}
Person.sayName();
const p = new Person();
p.toString();

console.log([].toString()); // ''
console.log({}.toString()); // '[object Object]'
```

### 精度问题：0.1 + 0.2 !== 0.3

两数运算需要 `进制转换、对阶运算`，在这个过程中一旦超出 `安全数(2^53 - 1)` 就会进行截断，造成精度丢失。

解决方式精度误差小于 `Number.EPSILON` 即可认为相等

```js
0.1 + 0.2 - 0.3 < Number.EPSILON; // true 即可认为相等
```

### NaN 和 Number.isNaN

Number.isNaN 会 `先判断是否是数字类型`，再判断是否为 NaN

### 类型转换

在 js 中，一般只会发生以下几种转换：`转为boolean（布尔值）`、`转为string（字符串）`、`转为number（数字类型）`。

#### 显式类型转换

显式类型转换指的就是我们 `通过代码将数据转换成我们预想之中的类型`，也就是说，比如我们想把数字转换成字符串，我们通过 `toString` 方法去实现我们的目的，这种方式称为 `显式`

```js
let a = 1;
a = a.toString();

console.log(typeof a); // string
```

#### 隐式类型转换

- `数字类型和字符串类型` 进行 `相加` 时，会先将数字 `转化为字符串` 然后相加
- `数字类型和字符串类型` 进行 `-、*、/` 运算时，会先将字符串 `转化为数字` 然后进行运算
- 在 `条件判断语句中` 使用 `非boolean类型` 时，会 `先转化为boolean` 类型然后判断
- 在使用 `==` 进行比较时，如果两边是 `string和boolean` 会转换为 `数字类型` 再进行对比，但是 `undefined` 和 `null` 不会进行转换
- 在使用 `==` 进行比较时，如果一边是 `object`，一边是 `string、boolean、symbol`，那么就会将 `object转换成原始类型` 再进行比较

#### 对象转换成字符串

js 中，`引用数据类型` 在转换成 `字符串` 时，会比较特殊，一共有下面四个步骤：

- 如果对象有 `Symbol.toPrimitive()` 方法，优先调用该方法；
- 如果没有就会看是否有 `valueOf()` 方法，然后次调用该方法；
- 如果还没有，就会调用 `toString()` 方法；
- 如果还没有，就会报错；

```js
const obj1 = {};

const obj2 = {
  [Symbol.toPrimitive]: () => {
    return "123";
  },
};

const obj3 = {
  [Symbol.toPrimitive]: null,
  valueOf: () => {
    return "123";
  },
};

const obj4 = {
  [Symbol.toPrimitive]: null,
  valueOf: null,
  toString: () => {
    return "123";
  },
};

const obj5 = {
  [Symbol.toPrimitive]: null,
  valueOf: null,
  toString: null,
};

console.log(obj1 == "123"); // false
console.log(obj2 == "123"); // true
console.log(obj3 == "123"); // true
console.log(obj4 == "123"); // true
console.log(obj5 == "123"); // Uncaught TypeError: Cannot convert object to primitive value
```

#### 一些特殊的类型转换

```js
console.log([] == ![]); // true
/**
式子右侧![]先转换成boolean，变成了!true也就是false；
式子变成了[] == false；
然后进行等式两边转换为number类型进行比较；
左侧[]变成了0，右侧false变成了0，于是最终比对的就是0 == 0
*/

console.log(Number(null)); // 0
console.log(Number(undefined)); // NaN

console.log(null == undefined); // true
```

### 函数声明方式

1. `function 命令` : function foo(){} 会函数提升
2. `函数表达式` var foo = function(){} 匿名函数，变量 foo 提升，值为 undefined
3. `Function 构造函数` var foo = new Function('x', 'y', 'return x + y')

### 变量声明方式

- var
- function
- let
- const
- class
- import

#### var、const 和 let 的区别

- let、const 存在 `块级作用域`，var 是 `全局作用域`
- var 存在 `变量提升`、let、const 存在 **暂时性死区**，无法在声明前进行访问
- var 可以 `重复声明`、let 和 const 不可以

```js
const o1 = 2;
o1 = 3; // TypeError
const o2 = {};
o2.key = 2; // 合法
```

## 原型和继承

原型链：指通过 `__proto__` 指向构造函数的原型对象，可以 `继承并共享属性` 的对象链。其终点为 null

- **属性查找机制**： 当查找不存在于实例的属性时，会沿着 `原型链` 往上找，直到最顶级的 `Object.prototype`，此时返回 undefined
- **属性修改机制**：修改原型对象的属性，会对所有 `继承该原型对象的实例造成影响`

**对象原型**

- 访问对象原型的标准方法为 `Object.getPrototypeOf()`；

- 可以通过 `Object.setPrototypeOf()` 去设置对象的原型；

- 可以通过 `Object.prototype.isPrototypeOf()` 去检查一个对象 `是否存在于另一个对象的原型链中`；

- 可以通过 `someObj.hasOwnProperty(key)` 去判断一个对象的 `key` 是存在于该对象本身还是存在于该对象的原型链上；

- 我们也可以通过 `obj.[[Prototype]]（在大多数浏览器中实现为obj.__proto__，并不允许通过[[Prototype]]去访问）` 去访问对象的原型；

- 对象的 `原型（[[Prototype]]）` 指向 `它的构造函数的prototype属性`；

```js
Object.prototype.__proto__; //null
Function.prototype.__proto__; //Object.prototype
Object.__proto__; //Function.prototype
Object instanceof Function; //true
Function instanceof Object; //true
Function.prototype === Function.__proto__; //true
```

![](https://cdn.nlark.com/yuque/0/2021/png/608421/1614701764185-e3750105-c618-455f-81a3-81eea1400405.png#align=left&display=inline&height=1519&margin=%5Bobject%20Object%5D&originHeight=1519&originWidth=1221&size=0&status=done&style=none&width=1221#align=left&display=inline&height=1519&margin=%5Bobject%20Object%5D&originHeight=1519&originWidth=1221&status=done&style=none&width=1221#height=1519&id=n42YT&originHeight=1519&originWidth=1221&originalType=binary&ratio=1&status=done&style=none&width=1221)

### 寄生组合继承

用 `Object.create(Parent.protype)` 创建一个新对象，将这个对象作为 `Child.prototype`，就解决了所有问题，这也是为什么叫做 `寄生组合式继承`，它是 `寄生继承` 和 `组合继承` 的结合，`寄生组合式继承` 是 ES5 中 `近乎完美的继承方法`

```js
function Parent(firstName, lastName) {
  this.name = firstName + lastName;
  this.arr = [1, 2, 3];
}

Parent.prototype.sayHi = "hi";

function Child(firstName, lastName) {
  Parent.call(this, firstName, lastName);
}

// 将子类的原型对象指向父类的实例
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
let child1 = new Child("Lee", "Hi");
let child2 = new Child("Lee", "Hi");
console.log(child1.name); // LeeHi
console.log(child1.sayHi); // hi
child1.arr.pop();
console.log(child1.arr); // [1, 2]
console.log(child2.arr); // [1, 2, 3]
```

### class 继承

本质是寄生组合式继承的 `语法糖`。

`Class` 有几个关键字 `class`、`constructor`、`super`、`extends`。

- `class` 代表声明一个类；
- `constructor` 代表 `构造函数`；
- `super` 相对于通过 `call、apply` 调用 `父构造函数并改变this指向`；
- `extends` 代表继承；
- 父类的 `静态方法` 也会被继承

```js
class Father {
  constructor() {
    this.name = "Father";
  }
  sayName() {
    console.log(this.name);
  }
  // 父类的静态方法，也会被子类继承
  static sayName() {
    console.log(222);
  }
}
// Class 可以通过extends关键字实现继承
class Child extends Father {
  constructor() {
    // 子类必须在constructor方法中调用super方法，否则新建实例时会报错
    super();
    this.name = "Child";
  }
}
const nx = new Child();
nx.sayName(); // 'Child'
Child.sayName(); // 222
```

## DOM 事件

**DOM2 事件流**

> 1. **在捕获阶段，先由外向内执行捕获事件**；
> 2. 当事件触发**在目标阶段**时，**先捕获，后冒泡**；
> 3. **在冒泡阶段，由内向外冒泡到根节点上**

**事件对象**

- DOM2

  - target：获取事件目标

  - type：获取事件类型

  - `stopPropogation()`：取消事件冒泡

  - `preventDefault()`：阻止默认事件
  - `addEventListener` / `removeEventListener`： 监听事件/移除事件

- IE

  - srcElement：获取事件目标

  - type：获取事件类型

  - `cancelBubble`：取消事件冒泡

  - `returnValue`：阻止默认事件
  - `attachEvent` / `detachEvent`： 监听事件/移除事件

**事件委托**

- 指 **不在目标对象上监听事件，而在上级元素监听**，从而 `减少事件注册`，原理则是 `事件冒泡`。常见场景监听 select 的 check

## 数组遍历

- `for循环` 可以通过 `数组长度进行遍历`，然后通过 `索引进行访问`（`break或者return` 进行退出循环）
- `forEach` 可以 `直接获取数组每一项的值`，并且可以获取 `索引`，还可以 `改变this指向`；（可以通过抛出异常推出循环）
- `map` 不光可以遍历数组的每一项，还可以对进行 `增删改查` 并 `返回一个新数组`；（不能退出循环）
- `for...in` 只能遍历出 `数组的索引`，想要获取数组的值，需要通过 `索引访问`；（使用 `break` 退出循环）
- `for...of` 只能遍历出 `数组每一项的值`，不能获取到索引；（用 `break` 退出循环）

## 如何遍历对象属性，区别

- `for...in` 循环遍历自身以及原型链上属性

- Object.getOwnPropertyNames() 获取自身属性
- `Reflect.ownKeys()` 实现遍历；
- Object.keys(obj) | Object.entries()

## 如何防止对象属性被修改

- 重写对象属性的 `writable`

- 防止扩展: `Object.preventExtensions()`

- 密封: `Object.seal()`

- 冻结: `Object.freeze()`

## 执行上下文

以 ES5 的执行上下文为例：

JS 执行代码时，会进入执行环境创建执行上下文，并推入 `执行栈`（Execution Context Stack，ECS），先进后出，执行完毕后出栈。

### 执行上下文的类型

- 全局执行上下文： 最先进入执行栈

- 函数执行上下文

- eval 函数执行上下文

### 生命周期

创建阶段 - 执行阶段 - 回收阶段

创建阶段：

- This Binding, this 指向调用者
- 创建词法环境（LexicalEnvironment） 组件
- 创建变量环境 （VariableEnvironment）组件

```js
ExecutionContext = {
  ThisBinding = <this value>,     // 确定this
  LexicalEnvironment = { ... },   // 词法环境
  VariableEnvironment = { ... },  // 变量环境
}
```

- This Binding

确定 `this` 的值我们前面讲到，`this` 的值是在执行的时候才能确认，定义的时候不能确认

### 词法环境 & 变量环境

> 用来登记 let const class import 声明

**词法环境** 是一种持有 **标识符—变量映射** 的结构，由环境记录器 + outer 外部环境引用组成。

- **环境记录器** 是存储 `变量声明` 和 `函数声明` 的实际位置。
- **outer 外部环境引用**：它可以访问其 `父级词法环境`（作用域）

- 有两个类型

  - **对象环境记录器**：定义出现在 **全局上下文** 中的 `变量和函数` 的关系，没有外部环境引用（outer 指向 null）的词法环
  - **声明式环境记录器**：在 **函数上下文** 中 `存储变量、函数和参数`，包含了 `arguments` 对象，外部环境的引用可以是全局环境，也可以是包含内部函数的外部函数环境

- 用来登记 let、const、class 、import 声明，初始值为未初始化 uninitialized

**变量环境**

- 变量环境也是一个词法环境，因此它具有上面定义的词法环境的所有属性
- 用来登记 var function 声明，var 初始值为 undefined

```js
let a = 20;
const b = 30;
var c;

function multiply(e, f) {
  var g = 20;
  return e * f * g;
}

c = multiply(20, 30);
```

​ 执行上下文

```js
// 全局
GlobalExectionContext = {

  ThisBinding: <Global Object>,

  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 在这里绑定标识符
      a: < uninitialized >,
      b: < uninitialized >,
      multiply: < func >
    }
    outer: <null>
  },

  VariableEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 在这里绑定标识符
      c: undefined,
    }
    outer: <null>
  }
}
// 函数
FunctionExectionContext = {
  ThisBinding: <Global Object>,

  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 在这里绑定标识符
      Arguments: {0: 20, 1: 30, length: 2},
    },
    outer: <GlobalLexicalEnvironment>
  },

VariableEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 在这里绑定标识符
      g: undefined
    },
    outer: <GlobalLexicalEnvironment>
  }
}
```

### 作用域、作用域链

作用域是指 **变量和函数的可访问的上下文**

作用域链是由 **指变量或函数查找时先从当前的执行上下文往其父级的上下文寻找，直到最外层的 window**。

- 全局作用域: 全局作用域下声明的变量可以在程序的任意位置访问
- 函数作用域: 变量只能在函数内部访问，不能在函数以外去访问
- 块级作用域(ES6)：let、const , 在于块级作用域中, 在大括号之外不能访问这些变量

#### 延长作用域链的方法

- `闭包`：其原理是 `函数（a）内返回一个函数（b）`，然后在 `全局作用域中调用b`，按照正常逻辑，函数 b 的作用域链应该为 `b的AO -> 全局变量(GO)`，但是由于函数 b 是在函数 a 内创建的，它在创建时，就记录了 `父级作用域（函数a的AO）`，因此此时函数 b 的作用域链应该为 `b的AO -> a的AO -> 全局变量GO`。
- `with语句`：已经属于 `废弃功能`，格式为 `with(obj) { ... }`，它会将 `{}` 内的代码的上层作用域指向 `obj`，相当于延长了内部代码的作用域链；
- `try...catch的catch语句`：之所以 `catch(e)` 能接收到错误信息，是因为在 `try语句报错时`，会将 `报错信息放到catch语句的作用域链最前端`，因此在 `catch语句之中`，才能访问到错误信息；

### VO 和 AO

变量对象（Variable object）是与执行上下文相关的对象，存储了在上下文中定义的变量和函数声明。

而在函数上下文中，我们用活动对象（activation object，AO）来表示变量对象

VO 变量对象和 活动对象 AO 中的属性是否可以访问取决于变量是否进入执行阶段，未进入执行阶段的变量对象 VO 中的属性都不可以访问

### this 的指向

**函数的执行过程中调用位置** 决定 this 的绑定对象

- this 的调用可以分为 5 类：

  - `普通函数` 调用：指向全局对象 `window` **严格模式指向 undefined**
  - `对象方法`：指向该对象
  - `new ` 构造器调用：指向 new 返回的对象（显示/隐式）
  - `apply/call/bind ` 绑定：指向绑定的对象
  - `箭头函数` 的调用： 指向外层 this

### call、apply、bind 区别

- 三者都可以改变函数的 this 对象指向。
- 三者第一个参数都是 this 要指向的对象，如果如果没有这个参数或参数为 undefined 或 null，则默认指向全局 window。
- 三者都可以传参，但是 **apply 是数组**，而 **call 是参数列表**，且 apply 和 call 是一次性传入参数，而 **bind 可以分为多次传入**。
- bind 是返回 **绑定 this 之后的函数**，便于稍后调用；apply 、call 则是 **立即执行** 。
- bind()会返回一个新的函数，如果这个返回的新的函数作为 **构造函数** 创建一个新的对象，那么此时 this **不再指向** 传入给 bind 的第一个参数，而是指向用 new 创建的实例

### new 一个对象发生了什么

- 创造一个全新的对象
- 这个对象会被执行 [[Prototype]] 连接，将这个新对象的 [[Prototype]] 链接到这个构造函数.prototype 所指向的对象
- 这个新对象会绑定到函数调用的 this
- 如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象

```js
/**
 * new: 创建一个空对象继承函数原型，属性和方法被加入到该对象中，最后隐式返回this引用的对象
 */
function myNew(constructor, ...args) {
  let obj = {
    __proto__: constructor.prototype,
  };
  constructor.apply(obj, args);
  return obj;
}
```

### 闭包

> 闭包是指 **有权访问另一个函数作用域中的变量的函数**--《JavaScript 高级程序设计》

正常来说，函数执行时会创建函数执行上下文，代码执行后出栈释放，如果执行上下文被其他上下文占用，则不会出栈释放，从而形成一个私有上下文，来保护和保存私有变量机制就是闭包。

- 如何产生一个闭包？

​ 本质就是 **当前环境中存在指向父级作用域的引用**，表现形式有 `返回一个引用外部变量的函数`

- 闭包的作用以及副作用

  - 保护：`保护私有变量不受外部的干扰`
  - 保存：`函数内的某些值保存下来，实现方法和属性的私有化`
  - 容易导致 `内存泄漏`

- 闭包的使用场景： `创建私有变量` 以及 `延长变量生命周期`，具体表现有
  - `IIFE 自执行`
  - 创建 `模块`
  - `柯里化` 函数(bind、Fuction.prototype.call.bind(Object.prototype.toString)、部分求和)

```js
for (var i = 0; i < 3; i++) {
  /* 注释的i、j是同一个 */
  (function (j) {
    // j
    setTimeout(
      (data[j] = function () {
        console.log(j);
      }),
      0
    );
  })(i); // i
}
```

## Map 和 Set，WeakMap 和 WeakSet

- 键值对: Object 是{`字符串 - 值`}，Map 则是 {`值-值`}提供更完善的 Hash 结构
- Map 拥有更加丰富的 `API`: `get、set、has、clear` + `遍历函数 keys，values，entries`
- WeakMap 只接受 `除null以外对象` 作为键名，是弱引用，键名指向的对象不计入垃圾回收
- WeakMap `只有get、set、has` 方法 ，没法进行遍历，没有 Map 的遍历函数

## 箭头函数和普通函数

- 语法 `简洁`
- `没有 arguments` ，取而代之是 rest 参数获取参数列表
- 箭头函数 `没有 this` ， `this指向` 外层普通函数，`call/apply/bind` 无法改变。 例如 `(()=>{}).bind(this)`
- 箭头函数 `没有原型不能作为构造函数` 进行 new
- `不能作为 Generator - yeild函数`

## 函数柯里化

函数柯里化指的是 **把多个参数的函数转化为单一参数函数**，**并接受余下参数返回结果** 的新函数的技术

原理是 `用闭包把传入参数保存起来，当传入参数的数量足够执行函数时，就开始执行函数`

- **参数复用**
- **提前返回**： 当函数分批次的接收参数时，它会先把 `一部分参数` 进行判断，然后返回对应的函数，下次调用时就不需要判断这部分参数了
- **延迟执行**：通过柯里化返回的函数，都不会 `立即执行`，而是在我们需要调用时才会执行，这种就叫做 `延迟执行`，如 **bind**

```js
const sum = (a, b) => a + b;
const sum2 = (a) => (b) => (c) => a + b + c;
const sum3 = (m) => {
  let temp = (n) => sum3(m + n);
  temp.toString = () => m;
  return temp;
};
const curry = (fn, ...args) =>
  fn.length <= args.length
    ? fn.apply(this, args)
    : curry.bind(null, fn, ...args);
const sum4 = curry(sum);
console.log(sum4(12)(2));

// 无固定形参
const add = (...args) => {
  const res = args.reduce((a, b) => a + b);
  const temp = (...b) => add(res, ...b);
  temp.toString = () => res;
  return temp;
};
console.log(+add(1, 2)(3, 4, 6));
```

## 垃圾回收

**垃圾回收**：当变量不在参与运行时，就需要系统收回被占用的内存空间，这就是垃圾回收。而在 **不需要的情况下，没有经历垃圾回收，则会造成内存泄漏**。

### 内存泄漏的场景

- `全局变量`
- 未销毁 `定时器`
- `未清除的DOM节点，或对象引用`
- `闭包`

### 垃圾回收策略

JavaScript 有两种策略实现垃圾回收机制：

- 引用计数法

  - 跟踪 `记录每个值被引用的次数`, 垃圾收集器释放引用次数为 `0` 的值所占的内存。存在循环引用的问题

- 标记清除法：执行流创建执行上下文后，执行上下文中的变量会被标记为 **进入环境**，永远不能释放 **进入执行环境** 变量所占用的内存。

  1. 垃圾收集器运行时 `标记所有在内存中的变量`
  2. 去除 `执行上下文中的变量` 和 `被引用的变量` 的标记
  3. 垃圾收集器 `清除并回收仍有标记的内存空间`

- 分代式垃圾回收机制（V8 将内存分成 `新生代空间` 和 `老生代空间`)

  - 新生代空间: 用于存活较短的对象

    - 又分成两个空间: from 空间 与 to 空间
    - Scavenge GC 算法: 当 from 空间被占满时，启动 GC 算法
      - 存活的对象从 from space 转移到 to space
      - 清空 from space
      - from space 与 to space 互换
      - 完成一次新生代 GC

  - 老生代空间: 用于存活时间较长的对象
    - 从 `新生代空间` 转移到 `老生代空间` 的条件（这个过程称为 `对象晋升`）
      - 经历过一次以上 Scavenge GC 的对象
      - 当 to space 体积超过 25%
    - `标记清除` 算法：标记存活的对象，未被标记的则被释放
      - `增量标记`：小模块标记，在代码执行间隙执，GC 会影响性能
      - `并发标记`：不阻塞 js 执行

## 异步编程

- 回调函数：`回调地狱`
- 定时器: `setTimeout、setInterval、requestAnimationFrame`
- Promise：Promise `本身是一个同步的立即执行函数`
- async-await: `返回一个Promise对象`，是 Generator 的语法糖
- Generator - 执行栈出栈 : `next（）执行`

## 迭代器

> ES6 规定，默认的 Iterator 接口部署在数据结构的 `Symbol.iterator` 属性，或者说，一个数据结构只要具有 `Symbol.iterator` 属性，就可以认为是“可遍历的”（iterable）。

像数组可以直接通过 for-of 进行遍历，而 Object 对象由于没有 Symbol.iterator 属性，因此不可以使用。

- Object.values()

但假如 要实现 `var [a, b] = {a: 1, b: 2} ` 可以往 Object 添加 Symbol.iterator 属性即可即可

```js
const obj = {
  a: 1,
  b: 2,
  [Symbol.iterator]: function* () {
    yield* Object.values(this);
  },
};

const [a, b] = obj;
console.log(a, b);
// 设置 Object
Object.prototype[Symbol.iterator] = function* () {
  yield* Object.values(this);
};
```

## Generator

`Generator` 是异步解决的一种方案，最大特点则是将异步操作同步化表达出来.

原理是：调用 Generator 函数后会返回一个包含 next 方法的对象, 每次调用 next 方法会返回一个对象, 包含 value 和 done 属性, value 是 yield 后的值即当前状态的值, done 为布尔值, 表示是否执行完毕.

```js
function* helloWorldGenerator() {
  yield "hello";
  yield "world";
  return "ending";
}
var hw = helloWorldGenerator();
hw.next();
// { value: 'hello', done: false }

hw.next();
// { value: 'world', done: false }

hw.next();
// { value: 'ending', done: true }

hw.next();
// { value: undefined, done: true }
```

- 遇到 `yield` 表达式，就暂停执行后面的操作，并将紧跟在 `yield` 后面的那个表达式的值，作为返回的对象的 `value` 属性值。
- 下一次调用 `next` 方法时，再继续往下执行，直到遇到下一个 `yield` 表达式
- 如果没有再遇到新的 `yield` 表达式，就一直运行到函数结束，直到 `return` 语句为止，并将 `return` 语句后面的表达式的值，作为返回的对象的 `value` 属性值。
- 如果该函数没有 `return` 语句，则返回的对象的 `value` 属性值为 `undefined`

## Promise

采用 **观察者模式**

1. `then` 收集依赖
2. 异步触发 `resolve`
3. `resolve` 执行依赖

三个状态：

- Pending（进行中）
- Resolved（已完成）
- Rejected（已拒绝）

两个过程：变成 **其他状态后不可逆**

- pending -> fulfilled : Resolved（已完成）
- pending -> rejected：Rejected（已拒绝）

缺点：

- 无法取消 Promise，一旦新建立即执行
- 没有设置回调函数，Promise 内部错误不会抛出
- pending 状态下无法知道进展（刚开始还是即将完成）

### async - await 如何通过同步的方式实现异步

- 自带执行器，不用执行 next()
- 返回一个 Promise，，而 `Generator` 返回的是 **生成器对象**
- await 返回 Promise 的 resolved/rejected 值

## 事件循环

**JavaScript 是单线程语言**，**为了避免阻塞代码执行**，同步任务立即执行，异步任务则进入 Event Queue 进行协调执行。

- `同步任务`：声明语句、for、赋值
- `异步任务`： 如 ajax 请求，setTimeout

异步任务又分为宏任务和微任务，可以将 **耗时短的微任务进行“插队” 提高代码执行效率**。

**宏任务（macroTask）**

- `<script async>` 标签中的运行代码（异步任务）
- setTimeout、setInterval 的回调函数
- 事件触发的回调函数，例如 `DOM Events`、`IO操作 (fs.readFile)`、`requestAnimationFrame`、Ajax、UI 交互等

**微任务（microTask）**

- Promise 的回调函数：then、catch、finally
- MutationObserver
- queueMicrotask
- process.nextTick(Node 独有)

### 浏览器

![](https://cdn.nlark.com/yuque/0/2020/png/608421/1584205603664-6b7a3a21-8b4e-4703-b2e2-f031392a4eaa.png#align=left&display=inline&height=749&margin=%5Bobject%20Object%5D&originHeight=749&originWidth=710&status=done&style=none&width=710#height=749&id=x664A&originHeight=749&originWidth=710&originalType=binary&ratio=1&status=done&style=none&width=710)

执行 JavaScript 代码的具体流程：

1. 执行全局代码(也是一个宏任务)， 代码包括同步语句以及异步语句(eg. setTimeout...)
2. 执行完全局代码后，调用栈 Stack 清空
3. 从微队列(microtask queue)中取出队首回调任务(callback)放入调用栈 Stack 中执行，微队列长度减一
4. 继续取出微队列中队首任务放入调用栈 Stack 执行，直到将微队列(microtask queue)中任务执行完毕。注意：（**如果在执行微任务的过程中，又产生了微任务，那么此时会加入微队列的队尾，在这个周期内被调用执行**）
5. 微队列(micriotask queue)中所有任务执行完毕，此时微任务队列、调用栈都为空
6. 开始取出宏队列中队首任务，放入调用栈 Stack 中执行，若宏任务中产生微队列，则在执行完这个宏任务中的微队列任务完毕后才执行下一个宏任务。
7. 执行完毕，调用栈 Stack 为空。

【`宏队列macrotask一次只从队列中取一个任务执行，执行完后就去执行微任务队列中的任务`】

【`微任务队列中所有的任务都会被依次取出来执行，直到微队列为空`】\

【示例代码】

```js
console.log(1);

setTimeout(() => {
  // c2
  console.log(2);
  Promise.resolve().then(() => {
    // c3
    console.log(3);
  });
});

new Promise((resolve, reject) => {
  console.log(4);
  resolve(5);
}).then((data) => {
  // c5
  console.log(data);
});

setTimeout(() => {
  // c6
  console.log(6);
});

console.log(7);
// 1 4 7 5 2 3 6
```

【流程分析】

```js
/**
 * 【宏队列】: [c2 c6]
 * 【微队列】: [c5]
 * 【此时输出】: 1 4 7
 */

// 执行微任务c5 和宏队列c2
/**
 * 【宏队列】: [c6]
 * 【微队列】: [c3]
 * 【此时输出】: 1 4 7 5 2
 */

// 执行微任务c3 和宏队列c6
/**
 * 【宏队列】: []
 * 【微队列】: []
 * 【此时输出】: 1 4 7 5 2 3 6
 */
```

### Node.js

> 微任务 - 阶段宏任务全执行 - 微任务 -下一阶段宏任务

- timer 定时器阶段： 执行满足条件的 `setTimeout、setInterval` 回调
- I/O 事件回调阶段：`执行I/O事件`
- idle、prepare： 闲置阶段
- poll 轮询阶段
- check 检查阶段：执行 `setImmediate` 的回调
- close 关闭事件回调阶段： 如 `socket.on('close')`

宏任务

- timer 定时器阶段： 执行满足条件的 `setTimeout、setInterval` 回调
- I/O 事件回调阶段：`执行I/O事件`
- check 检查阶段：执行 `setImmediate` 的回调
- close `关闭事件回调` 阶段

微任务：

- nextTick Queue： process.nextTick
- other microQuee：Promise.then

![](https://cdn.nlark.com/yuque/0/2020/png/608421/1584205603679-ca107c98-91d6-43e4-a982-b4c01878a318.png#align=left&display=inline&height=526&margin=%5Bobject%20Object%5D&originHeight=526&originWidth=951&status=done&style=none&width=951#height=526&id=VciBJ&originHeight=526&originWidth=951&originalType=binary&ratio=1&status=done&style=none&width=951)

执行完 `同步任务` 后，异步任务将按照我们的循环的 6 个阶段依次执行，每次拿出当前阶段中的全部任务执行，清空 NextTick Queue，清空 Microtask Queue。再执行下一阶段，全部 6 个阶段执行完毕后，进入下轮循环。即：

- 清空当前循环内的 Timers Queue，清空 NextTick Queue，清空 Microtask Queue。
- 清空当前循环内的 I/O Queue，清空 NextTick Queue，清空 Microtask Queue。
- 清空当前循环内的 Check Queu，清空 NextTick Queue，清空 Microtask Queue。
- 清空当前循环内的 Close Queu，清空 NextTick Queue，清空 Microtask Queue。
- 进入下轮循环。

time 阶段存在多个宏任务，若执行宏任务产生的 `微任务要在该阶段的插入下一个宏任务之前执行完再执行宏任务`

如果在 timers 阶段执行时创建了 `setImmediate` 则会在此轮循环的 check 阶段执行，如果在 timer 阶段创建了 `setTimeout`，要在 `下次循环的timer阶段` 才执行，check 阶段创建 timers 任务同理。

【示例代码】

```js
console.log("start");

setTimeout(() => {
  // c1
  console.log(1);
  setTimeout(() => {
    // c2
    console.log(2);
  }, 0);
  setImmediate(() => {
    // c3
    console.log(3);
  });
  process.nextTick(() => {
    // c4
    console.log(4);
  });
}, 0);

setImmediate(() => {
  // c5
  console.log(5);
  process.nextTick(() => {
    // c6
    console.log(6);
  });
});

setTimeout(() => {
  // c7
  console.log(7);
  process.nextTick(() => {
    // c8
    console.log(8);
  });
}, 0);

process.nextTick(() => {
  // c9
  console.log(9);
});

console.log("end");
// [start, end, 9, 1, 7, 4, 8, 5, 3, 6, 2]
```

**分析一下整个流程：**

```js
/**
 * 【宏任务】
 * Timer阶段: [c1, c7]
 * Check阶段:[c5]
 * 【微任务】
 * Process.nextTick: [c9]
 * 【此时输出】: start end
 */

// 执行微任务c9 + timer阶段c1
/**
 * 【宏任务】
 * Timer阶段: [c7], [c2]
 * Check阶段:[c5, c3]
 * 【微任务】
 * Process.nextTick: [c4]
 * 【此时输出】: start end 9 1
 */

// 执行微任务c5 + timer阶段c7
/**
 * 【宏任务】
 * Timer阶段: [c7], [c2]
 * Check阶段:[c5, c3]
 * 【微任务】
 * Process.nextTick: [c8]
 * 【此时输出】: start end 9 1 4 7
 */

// 执行微任务c8 + Check阶段c5
/**
 * 【宏任务】
 * Timer阶段: [], [c2]
 * Check阶段:[c3]
 * 【微任务】
 * Process.nextTick: [c6]
 * 【此时输出】: start end 9 1 4 7 8 5
 */

// 执行微任务c6 + Check阶段c3
/**
 * 【宏任务】
 * Timer阶段: [], [c2]
 * Check阶段:[]
 * 【微任务】
 * Process.nextTick: []
 * 【此时输出】: start end 9 1 4 7 8 5 6 3
 */
// 进入下一循环，开始执行time阶段-c2
/**
 * 【宏任务】
 * Timer阶段: [], []
 * Check阶段:[]
 * 【微任务】
 * Process.nextTick: []
 * 【此时输出】: start end 9 1 4 7 8 5 6 3 2
 */
```

### 解读 Promise 、 async-await 的执行顺序

分析： [掘金-从一道面试题解读 Promise/async/await 执行顺序](https://juejin.cn/post/6941023062833758222#heading-10)

async 相当于 `Promise.resolve`

**await 会阻塞后面的任务，指的是下一行代码，await 同行代码是会立即执行的**

```js
async function async1() {
  await async2(); // a2.then(() => console.log('async1 end'))
  console.log("async1 end");
}
```

```js
console.log("script start");

async function async1() {
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2 end");
  return Promise.resolve().then(() => {
    console.log("async2 end1");
  });
}
async1();

setTimeout(function () {
  console.log("setTimeout");
});

new Promise((resolve) => {
  console.log("Promise");
  resolve();
})
  .then(function () {
    console.log("promise1");
  })
  .then(function () {
    console.log("promise2");
  })
  .then(function () {
    console.log("promise3");
  });
Promise.resolve().then(function () {
  console.log("promise4");
});

console.log("script end");
/*
script start
async2 end
Promise
script end
async2 end1
promise1
promise4
promise2
async1 end
promise3
setTimeout
*/
```

## 手写函数

### 实现 instanceof

即 `判断a的原型链中有没有b`

```js
const myInstanceOf = (a, b) => {
  while (true) {
    if (a === null) return false;
    if (a.__proto__ === b.prototype) return true;
    a = a.__proto__;
  }
};

console.log(myInstanceOf([], Object));
```

### setTimeout 实现 setInterval

递归执行 setTimeout

```js
const myInterval = (fn, delay) => {
  let timerId;
  const interval = () => {
    fn();
    timerId = setTimeout(interval, delay);
  };
  interval();
  return {
    clearInterval: () => clearTimeout(timerId),
  };
};

const clock = myInterval(() => console.log(`2`), 1000);
clock.clearInterval();
```

### 连续事件节流、防抖

- 防抖：指在事件被触发 n 秒后再执行回调，如果在这 n 秒内事件又被触发，则重新计时。
- 节流：每隔一段时间后执行一次，也就是降低频率，将高频操作优化成低频操作

**防抖函数应用场景**：

- `按钮提交`：防止多次提交
- 服务端验证场景：`联想词`

**节流函数应用场景**：

- `拖拽 drag / 滚动 scroll / 缩放 resize`
- `动画`: 避免短时间内多次触发动画引起性能问题

```js
function debounce(fn, delay) {
  let T;
  // 事件再次触发则清除定时器，重新计时
  return (...args) => {
    T && clearTimeout(T);
    T = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
window.addEventListener(
  "scroll",
  debounce(() => console.log(`debounce`), 500)
);
function throttle(fn, delay) {
  let pre = 0;
  return (...args) => {
    let now = Date.now();
    while (now - pre > delay) {
      fn.apply(this, args);
      pre = now;
    }
  };
}
window.addEventListener(
  "scroll",
  throttle(() => console.log(`throttle`), 500)
);
```

### 深浅拷贝

深浅拷贝的区别在于：

浅拷贝：对于复杂数据类型，浅拷贝只是引用地址赋值给新对象，**改变新对象的值，原对象的值也会改变**

```js
// 1. Object.assign()
let a = Object.assign(b, { s: 1 });
// 2. 扩展运算符
let a = { ...b };
// 3. 数组方法实现数组浅拷贝, 主要用于数组
let a = b.slice();
```

深拷贝：对于复杂数据类型，深拷贝后引用地址都是新的，改变新对象的值，**原对象的值不会改变**

> const newObj = JSON.parse(JSON.stringify(obj)) // 最简单版本，不能拷贝函数等

```js
/**
 * 深拷贝：Array ｜ Object 类型递归返回，其他类型直接返回即可
 * 循环引用会栈爆，利用hash表 + WeakMap 弱引用 性能更好 并且支持 Symbol
 */
function deepCopy(target, wm = new WeakMap()) {
  if (typeof target !== "object" || target === null) {
    return target;
  }
  let res = Array.isArray(target) ? [] : {};
  if (wm.has(target)) {
    return wm.get(target);
  }
  wm.set(target, res);
  for (let key of Object.keys(target)) {
    res[key] = deepCopy(target[key], wm);
  }
  return res;
}

const o1 = {
  k1: undefined,
  k2: null,
  k3: 4,
  k4: [{ a: 1 }, [{ a: 1 }]],
  k5: console.log,
};
o1.k6 = o1;
const o2 = deepCopy(o1);
console.log(o2);
```

### Object.defineProperty 实现 a === 1 && a == = 2 && a === 3

```js
let obj = {};
Object.defineProperty(obj, "a", {
  configurable: true,
  enumerable: true,
  get() {
    this.value = this.value || 1;
    return this.value++;
  },
});
console.log(obj.a === 1 && obj.a == 2);
```

### 实现千分位 123456 => 123,456

```js
const kilo = (num) => {
  num = num + "";
  const [intNum, decimal = ""] = num.split(".");
  const n = intNum.length;
  let res = "";
  for (let i = n - 1; i >= 0; i--) {
    res += intNum[i];
    if ((n - i) % 3 === 0 && i !== 0) {
      res += ",";
    }
  }
  res = res.split("").reverse().join("");
  return res + (decimal ? `.${decimal}` : "");
};
console.log(kilo(2256.34));
```

### reduce 计算不同数量单价区间的总价

例如区间[0, 5)单价为 1，区间[5, 15)单价为 2，区间[15, Infinity) 单价为 3

```js
const caculate = (n) => {
  const product = [
    { min: 0, max: 5, price: 1 },
    { min: 5, max: 15, price: 2 },
    { min: 15, max: Infinity, price: 3 },
  ];
  const total = product.reduce((sum, { min, max, price }) => {
    if (n > 0) {
      const count = Math.min(n, max - min); // 本次购买数量
      sum += count * price;
      n -= count; // 计算剩余数量
    }
    return sum;
  }, 0);
  return total;
};

console.log(caculate(12));
```

### 实现 call 或 apply 或 bind

作用：**改变 this 指向** + **借用其他对象的方法**

- call: 调用一个函数，接收一个参数列表，第一个参数指定函数体内 this 的指向，后续的参数列表
- apply：调用一个函数，接收两个参数，第一个参数指定函数体内 this 的指向，第二个参数为数组或类数组
- bind：一个函数被 _call/apply_ 的时候，会直接调用，但是 _bind_ **会创建一个新函数**，当这个新函数被调用时，bind 的第一个参数将作为它运行时的 this

```js
// 将函数设为对象的属性，执行并删除函数属性
Function.prototype._apply = function (context = window, args = []) {
  // 使用Symbol 来确定唯一key
  let key = Symbol();
  context[key] = this;
  let res = context[key](...args);
  delete context[key];
  return res;
};
// apply与call实现相同，但apply 接收一个参数数组
Function.prototype._call = function (context = window, ...args) {
  let key = Symbol();
  context[key] = this;
  let res = context[key](...args);
  delete context[key];
  return res;
};
// bind 返回一个新函数，将传入的context作为新函数的this指向
Function.prototype._bind = function (context = window, ...args) {
  return () => {
    this._apply(context, args);
  };
};
const foo = { name: "foo", sex: "male" };
function print() {
  console.log(this.name);
}
print._call(foo); // foo

const cat = function (name) {
  console.log(this.name, name);
}._bind(foo, "L");

cat();
```

### Promise A+ 规范实现

```js
// status 3种状态 pending => fulfilled / rejected
const STATUS = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
};
class MyPromise {
  // 构造函数接收一个 executor 执行函数，在 new 实例时立即运行
  // status状态、value 值、resolveQueue 回调队列 和 rejectQueue 回调队列
  // executor 函数有两个异步函数 resolve 和 reject，通过 箭头函数来绑定this
  // 异步函数通过 setTimeout 宏任务模拟，当处于PENGDING状态时改为相应的状态，并执行回调队列内的回调
  constructor(executor) {
    this.status = STATUS.PENDING;
    this.value = undefined;
    this.resolveQueue = [];
    this.rejectQueue = [];
    const resolve = (value) => {
      setTimeout(() => {
        if (this.status === STATUS.PENDING) {
          this.status = STATUS.FULFILLED;
          this.value = value;
        }
        while (this.resolveQueue.length) {
          const cb = this.resolveQueue.shift();
          cb(value);
        }
      });
    };
    const reject = (value) => {
      setTimeout(() => {
        if (this.status === STATUS.PENDING) {
          this.status = STATUS.REJECTED;
          this.value = value;
        }
        while (this.rejectQueue.length) {
          const cb = this.rejectQueue.shift();
          cb(value);
        }
      });
    };
    executor(resolve, reject);
  }
  // Promise.prototype.then 接收两个函数参数 onFulfilled 和 onRejected ，在参数为非函数时，需要转换
  // 返回一个 Promise，若执行结果为Promise 则将resolve reject方法传下去then链式调用，否则直接resolve
  // 根据当前状态执行当前值/推入回调队列
  then(onFulfilled, onRejected) {
    if (typeof onFulfilled !== "function") {
      onFulfilled = (value) => value;
    }
    if (typeof onRejected !== "function") {
      onRejected = (value) => value;
    }
    return new MyPromise((resolve, reject) => {
      const resolveFN = (value) => {
        try {
          const x = onFulfilled(value);
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x);
        } catch (e) {
          reject(e);
        }
      };
      const rejectFN = (value) => {
        try {
          const x = onRejected(value);
          x instanceof MyPromise ? x.then(resolve, reject) : reject(x);
        } catch (e) {
          reject(e);
        }
      };
      switch (this.status) {
        case STATUS.PENDING:
          this.resolveQueue.push(resolveFN);
          this.rejectQueue.push(rejectFN);
          break;
        case STATUS.FULFILLED:
          resolveFN(this.value);
          break;
        case STATUS.REJECTED:
          rejectFN(this.value);
          break;
      }
    });
  }
  // Promise.prototype.catch 即 onFulfilled 为 undefined 的 then
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
  // Promise.resolve / Promise.reject 返回一个 Promise 实例
  static resolve(x) {
    return x instanceof MyPromise
      ? x
      : new MyPromise((resolve, reject) => resolve(x));
  }
  static reject(x) {
    return x instanceof MyPromise
      ? x
      : new MyPromise((resolve, reject) => reject(x));
  }
  // Promise.all 能接受一个 promise 数组，在所有promise 都返回时resolve 结果数组
  static all(promiseArr) {
    let count = 0;
    let res = [];
    return new MyPromise((resolve, reject) => {
      promiseArr.map((p, i) => {
        MyPromise.resolve(p).then(
          (value) => {
            count++;
            res[i] = value;
            if (count === promiseArr.length) {
              resolve(res);
            }
          },
          (e) => {
            reject(e);
          }
        );
      });
    });
  }
  // Promise.race 能接受一个promise 数组，在第一个promise resolve时返回结果
  static race(promiseArr) {
    return new MyPromise((resolve, reject) => {
      promiseArr.map((p) => {
        MyPromise.resolve(p).then(
          (value) => {
            resolve(value);
          },
          (e) => {
            reject(e);
          }
        );
      });
    });
  }
  // Promise.prototype.finnaly 常用于接口请求中关闭loading场景
  finally(cb) {
    return this.then(
      (value) => MyPromise.resolve(cb()).then(() => value),
      (error) =>
        MyPromise.reject(cb()).then(() => {
          throw error;
        })
    );
  }
}

const p1 = new MyPromise((resolve, reject) =>
  setTimeout(() => resolve(`p1`), 1000)
);
const p2 = new MyPromise((resolve, reject) =>
  setTimeout(() => resolve(`p2`), 3000)
);
const p3 = new MyPromise((resolve, reject) =>
  setTimeout(() => resolve(`p3`), 2000)
);
MyPromise.race([p1, p2, p3]).then((x) => console.log(x)); // [ 'p1', 'p2', 'p3' ]
const p4 = new MyPromise((resolve, reject) => {
  resolve(`0.5`);
});
p4.then((r) => console.log(r))
  .catch((e) => console.log(e))
  .finally(() => console.log(`finnaly`));
```

#### retry

```js
const retry = (promiseMaker, max) => {
  return new Promise((resolve, reject) => {
    const attempt = (count) => {
      promiseMaker()
        .then()
        .catch((err) => {
          if (count < max) {
            attempt(count + 1);
          } else {
            reject(err);
          }
        });
    };
    attempt(1);
  });
};
```

### 并发限制异步调度器 Scheduler

```js
class Scheduler {
  constructor(max) {
    this.max = max;
    this.waitList = [];
    this.runList = [];
  }
  add(promiseMaker) {
    if (this.runList.length < this.max) {
      this.runList.push(promiseMaker);
    } else {
      this.waitList.push(promiseMaker);
    }
  }
  run(promiseMaker) {
    const runLen = this.runList.push(promiseMaker);
    promiseMaker().then(() => {
      this.runList.splice(runLen, 1);
      if (this.waitList.length) {
        this.runList.push(this.waitList.shift());
      }
    });
  }
}

const sc = new Scheduler(2);
const promiseMaker = (delay) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay * 1000);
  });
};

sc.add(promiseMaker(3).then(() => console.log(3)));
sc.add(promiseMaker(1.5).then(() => console.log(1.5)));
sc.add(promiseMaker(0.5).then(() => console.log(0.5)));
```

### 实现 LazyMan

```js
class LazyMan {
  constructor(name) {
    console.log(`this is ${name}`);
    setTimeout(() => {
      this.next();
    });
    this.nextCallback = [];
  }
  next() {
    const cb = this.nextCallback.shift();
    cb && cb();
  }
  eat() {
    const task = () => {
      console.log("eat");
      this.next();
    };
    this.nextCallback.push(task);
    return this;
  }
  sleep() {
    const task = () => {
      setTimeout(() => {
        console.log("sleep");
        this.next();
      }, 1000);
    };
    this.nextCallback.push(task);
    return this;
  }
}

const lz = (name) => new LazyMan(name);
lz(`sd`).sleep().eat();
```

### 非负整数相加

```js
const bigSum = (a = "", b = "") => {
  // 非负大整数相加， 找出最大数，补0 - padStart(len, '0')
  // 从后往前加，竖式计算，进位相加
  // 结果存在数组内
  const len = Math.max(a.length, b.length);
  a = a.padStart(len, 0);
  b = b.padStart(len, 0);
  let res = [];
  for (let i = len - 1; i >= 0; i--) {
    let sum = Number(a[i]) + Number(b[i]) + (res[0] || 0);
    let low = sum % 10; // 余数
    let high = (sum / 10) | 0; // 进位取整
    res.unshift(low, high);
  }
  return res.join("").replace(/^0+/, "");
};
console.log(bigSum("222", "123121313131131312"));
```

### 数组乱序

> loadash.\_shufffle
>
> 获取随机下标: radomIdx = radom \* (len - 1 - i) + i
>
> 交换：[i , radomIdx] => [radomIdx, i]

```js
const shuffle = (arr) => {
  // Fisher–Yates 洗牌法
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    // 获取随机下标:
    const radomIdx = Math.round(Math.random() * (n - 1 - i)) + i; // 加个分号，不然下方代码会被认为是赋值代码
    // 交换当前下标和随机下标
    [arr[radomIdx], arr[i]] = [arr[i], arr[radomIdx]];
  }
  return arr;
};
console.log(shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]));
```

### 数组拍平

> **Array.prototype.flat**.call(arr, Infinity)

使用 reduce 递归实现

```js
// 2. reduce
const flat = (arr, depth = Infinity) => {
  if (depth <= 0) return arr;
  return arr.reduce((a, b) => {
    return a.concat(Array.isArray(b) ? flat(b, depth - 1) : b);
  }, []);
};

console.log(flat([1, [2, [3, [4]]]], 1));
```

### 数组转为 tree

```js
let arr = [
  { id: 0, pid: -1, name: "html" },
  { id: 1, pid: 0, name: "body" },
  { id: 2, pid: 0, name: "style" },
  { id: 3, pid: 1, name: "title" },
  { id: 4, pid: 1, name: "div" },
];

const nest = (pid, arr) =>
  arr
    .filter((i) => i.pid === pid)
    .map((item) => ({ ...item, children: nest(item.id, arr) }));
const tree = nest(-1, arr);

// 找到tree中 style的id路径
const findPath = (tree, target) => {
  let res = [];
  const backtrack = (track, data) => {
    if (data.length === 0) return;
    data.map((item) => {
      if (item.id === target) {
        track.push(target);
        res = track.join("-");
        return;
      }
      backtrack([...track, item.id], item.children || []);
    });
  };
  backtrack([], tree);
  return res;
};
console.log(findPath(tree, 3)); // 0-1-3
```

### 将虚拟 Dom 转化为真实 Dom

- 创建 DOM：` document.createElement`

- 设置属性: `document.setAttribute `

- 添加子 DOM: `document.appendChild`

- 数字转字符串类型，直接就是文本节点(`createTextNode`)，递归实现

```js
const vnode = {
  tag: "DIV",
  attrs: { id: "app" },
  children: [
    { tag: "SPAN", children: [{ tag: "A", children: [] }] },
    {
      tag: "SPAN",
      children: [
        { tag: "A", children: [] },
        { tag: "A", children: [] },
      ],
    },
  ],
};

const _render = (vnode) => {
  if (typeof vnode === "number") {
    String(vnode);
  }
  if (typeof vnode === "string") {
    document.createTextNode(vnode);
  }
  let dom = document.createElement(vnode.tag);
  if (vnode.attrs) {
    for (let key of Object.keys(vnode.attrs)) {
      dom.setAttribute(key, vnode.attrs[key]);
    }
  }
  vnode.children.map((child) => dom.appendChild(_render(child)));
  return dom;
};
_render(vnode);
```

### 循环打印红绿灯

```js
function red() {
  console.log("red");
}
function green() {
  console.log("green");
}
function yellow() {
  console.log("yellow");
}
const fnMap = {
  red: red,
  green: green,
  yellow: yellow,
};
const task = (fn, time) => {
  const fnMap = {
    red: red,
    green: green,
    yellow: yellow,
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fnMap[fn]();
      resolve();
    }, time);
  });
};
// Promise.prototype.then 也可以
const step = async () => {
  await task("red", 1000);
  await task("green", 1000);
  await task("yellow", 1000);
  step();
};
step();
```

### 单例模式

- 核心：确保一个类只有一个实例，供全局访问
- 实现：用一个`变量`标志是否创建过对象，有则直接返回该对象

```js
// 闭包保存实例变量
class Singleton {
  constructor() {
    Singleton.instance = Singleton.instance || this;
    return Singleton.instance;
  }
}
const instance1 = new Singleton();
const instance2 = new Singleton();

console.log(instance1 === instance2); // true
```

### 工厂模式

核心： 不暴露创建对象的具体逻辑，而是将将逻辑封装在一个函数中（工厂）

```js
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

### 发布订阅模式

发布订阅模式是 `对象间一对多的依赖关系`，当一个对象状态发生变化时，所有依赖他的对象都会收到通知。

`订阅者` 将 `事件注册` 到 `调度中心`，`发布者` 发布事件到调度中心，由调度中心统一调用订阅事件。

```js
class EventEmitter {
  constructor() {
    this.emitList = [];
  }
  on(type, listener) {
    this.emitList[type]
      ? this.emitList[type].push(listener)
      : (this.emitList = [listener]);
  }
  off(type) {
    delete this.emitList[type];
  }
  once(type, listener) {
    this.on(type, () => {
      listener();
      this.off(type);
    });
  }
  emit(type, ...args) {
    this.emitList.forEach((fn) => fn(...args));
  }
}
const events = new EventEmitter();
events.on("click", () => console.log(`click`));
events.emit("click");
events.emit("click");
events.once("once", () => console.log(`once`));
events.emit("once");
events.emit("once");
```

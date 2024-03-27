---
date: 2020-11-15
category: Frontend
tags:
  - Javascript
  - Notes
  - ES6
spot: 留学生创业大厦
location: 深圳，科苑
outline: deep
---

# 深入浅出 ES6

## let & const

- 声明变量 6 种： var，function，let， const，import， class
- 全局对象： window， global（node）， globalThis（es6）

## 解构

- 通过*模式匹配*进行解构，等号两边模式相同，则进行完全匹配，否则为不完全匹配， 取不到的值为`undefined`

```javascript
// 完全匹配
const [a, b] = [1, 2]; // a = 1, b = 2
// 不完全匹配
const [a, [b], c] = [1, [2, 3]]; // a = 1, b = 2, c = undefined
```

- 只可解构具有可遍历解构的数据结构（Array， Set， Map， Generator 函数）
- 解构赋值允许指定默认值，仅在取得得数组成员值*严格等于(===)*`undefined`时生效

```javascript
let [x = 2] = []; // x = 2
let [y = 2, z = 3] = [null, undefined]; // y = null, z= 3
// 默认值可以引用解构赋值的其他变量，但【该变量必须先声明】
let [x = 2, y = x] = [1, undefined]; // x = 1, y = 1
let [z = c] = []; // ReferenceError: c is not defined
```

- 解构用途：交换变量；从函数返回多个值；函数参数定义；函数参数默认值；提取 JSON 数据；遍历 Map 结构；指定引入模块的部分方法

```javascript
// 遍历Map结构
for (let [, value] of [{key: 1, value: 2}])
// 指定引入模块的部分方法
const { x, y } = require('test')
```

## es6 扩展

- 模板字符串

```javascript
// 模版字符串
const name = "jack";
const x = `Hello, ${name}`; // Hello, jack
// 标签模版字符串（函数➕模板字符串）
// 过滤 HTML 字符串，防止用户输入恶意内容。
alert`jack`;
```

### 实现一个模板字符串

```javascript
let template = "我的工作是${job}, 我的钱是$${salary}";
let person = { job: "前端", salary: 30000 };
// 核心：将${}部分正则匹配后替换为相应变量
const render = (template, obj) => {
  return template.replace(/\$\{(.*?)\}/g, (match, key) => {
    console.log(match, key);
    return obj[key];
  });
};
console.log(render(template, person));
```

- 正则

字符串对象有 4 个方法可以使用正则表达式： `match`、`replace`、`split`、`search`

- 数值

```javascript
// 手写parseInt，未完善，没有处理负号
const _parseInt = (str, radix = 10) => {
  if (!["string", "number"].includes(typeof str) && !str.length) {
    return NaN;
  }
  if (!["number"].includes(typeof radix) || radix < 2 || radix > 36) {
    return NaN;
  }
  const intStr = String(str).trim().split(".")[0]; // 截取小数点前的整数

  let res = 0;
  for (let i = 0; i < intStr.length; i++) {
    let arr = intStr.split("").reverse().join("");
    res += Math.floor(arr[i]) * Math.pow(radix, i);
  }
  return res;
};
```

BigInt

> js 数值的精度只能到 53 个二进制位（相当于 16 个十进制位），大于这个范围的整数，JavaScript 是无法精确表示；
> 大于或等于 2 的 1024 次方的数值，JavaScript 会返回`Infinity`

JS 引入新的数据类型 BigInt（大整数），用来精确表示大`整数`

```javascript
const a = 12; // 普通整数
const A = 12n; // BigInt
a === A; // fasle
typeof a; // number
typeof A; // bigint

// BigInt 不能与普通数值进行混合运算,但允许比较
1n + 1; // 报错
1n > 0; // true
```

- 函数

```javascript
// 不报错
function f(x, x, y) {}
// 报错,函数使用参数默认值时，函数不能有同名参数
function f(x, x, y = 1) {}
```

- 请问下面两种写法有什么差别？
  两种写法都对函数的参数设定了默认值，
  区别是写法一函数参数的默认值是空对象，但是设置了对象解构赋值的默认值；
  写法二函数参数的默认值是一个有具体属性的对象，但是没有设置对象解构赋值的默认值。

```javascript
// 写法一
function m1({ x = 0, y = 0 } = {}) {
  return [x, y];
}

// 写法二
function m2({ x, y } = { x: 0, y: 0 }) {
  return [x, y];
}
// 函数没有参数的情况
m1(); // [0, 0]
m2(); // [0, 0]

// x 和 y 都有值的情况
m1({ x: 3, y: 8 }); // [3, 8]
m2({ x: 3, y: 8 }); // [3, 8]

// x 有值，y 无值的情况
m1({ x: 3 }); // [3, 0]
m2({ x: 3 }); // [3, undefined]

// x 和 y 都无值的情况
m1({}); // [0, 0];
m2({}); // [undefined, undefined]

m1({ z: 3 }); // [0, 0]
m2({ z: 3 }); // [undefined, undefined]
```

- 函数的 length 属性是指预期传入的参数个数。

```javascript
(function f(a) {}).length(
  // 1
  function f(x, a = 5, y) {}
).length; // 1,只有 x 计入，y 在 a 后面也不计入了
```

- 一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）

```javascript
const x = 3;
function f(x, y = x) {
  console.log(y);
}
f(2); // 2
```

- _箭头函数_
  - 没有`arguments`参数
  - 不能作为构造函数，所以不能使用`new`命令
  - 不能作为 Generator 函数，不能使用`yield`命令
  - `this`绑定定义时的对象，而非使用时对象

### 函数尾调用

函数返回另一函数时，会清除重用当前调用栈而非新建一个。

函数内部有两个参数可以`跟踪函数的调用栈`：

- func.arguments : 返回调用函数的参数
- func.caller： 返回调用当前函数的函数
- 数组

`Array.prototype.flat(n)`, n 为层数， 可以将嵌套的数组“拉平”

```javascript
// 默认拉平1层，会跳过空位
[1, 2, , [4], 5]
  .flat()
  [
    // [1, 2, 4, 5]

    (1, 2, [3, [4, 5]])
  ].flat(2)
  [
    // [1, 2, 3, 4, 5]

    // 转成一维数组
    (1, [2, [3]])
  ].flat(Infinity);
// [1, 2, 3]
```

`flatMap()`方法对原数组的每个成员执行一个函数（相当于执行`Array.prototype.map()`），然后对返回值组成的数组执行`flat()`方法。该方法返回一个新数组，不改变原数组,`只能展开一层数组`。

```javascript
// 相当于 [[[2]], [[4]], [[6]], [[8]]].flat()
[1, 2, 3, 4].flatMap((x) => [[x * 2]]);
// [[2], [4], [6], [8]]
```

- 对象

es6 有 5 种方式遍历对象属性：

`for-in`：返回对象自身以及继承的可枚举属性（不含 symbol 属性）

`Object.keys`： 返回一个数组，返回对象自身的可枚举属性（不含 symbol 属性）

`Object.getOwnPropertyNames(obj)`：返回一个数组，返回对象自身的所有属性（不含 symbol 属性）

`Object.getOwnPropertySymbols(obj)`：返回一个数组，返回对象自身所有 symbol 属性

`Reflect.ownKeys`：返回一个数组，返回对象自身所有属性（包括 symbol）

---

`super`关键字指向当前对象的原型对象，且`super`关键字只能用于对象方法中。

```javascript
// 报错，用在属性上
const obj = {
  foo: super.foo,
};

// 报错， 函数返回给属性
const obj = {
  foo: () => super.foo,
};

// 报错
const obj = {
  foo: function () {
    return super.foo;
  },
};
```

```javascript
// 对象obj.find()方法之中，通过super.foo引用了原型对象proto的foo属性
const proto = {
  foo: "hello",
};

const obj = {
  foo: "world",
  find() {
    return super.foo; // 方法调用
  },
};

Object.setPrototypeOf(obj, proto);
obj.find(); // "hello"
```

---

Object.is 用来比较两个值是否严格相等,与`===`不同的是：一是`+0`不等于`-0`，二是`NaN`等于自身。

```javascript
Object.is({}, {}); // false
// 实现Object.is
function isEqual(x, y) {
  if (x === y) {
    // +0 不等于 -0
    return x !== 0 || 1 / x === 1 / y;
  }
  return x !== x && y !== y;
}
```

设置原型对象：`Object.setPrototypeOf(object, prototype)`

## Symbol

Es6 引入的第八种原始数据类型`Symbol`，表示独一无二的值。其余七种原始数据类型是：`undefined`、`null`、`Number`、`String`、`Boolean`、`Object`、`BigInt`。

```javascript
const uid = Symbol("only");
let uid1 = Symbol("only");
console.log(uid1 === uid); // false

const boy = Symbol.for("Jack");
const girl = Symbol.for("Jack");
console.log(boy === girl); // true

console.log(Symbol.keyFor(boy)); // Jack

console.log(String(uid)); // 'Symbol(only)'
```

- Symbol.iterator 返回一个迭代器
- Symbol.hasInstance 执行 instanceof 时的内部方法 a instanceof b 相当于 b[Symbol.hasInstance](a)
- Symbol.toPrimitive 返回对象原始值

## Set

Set 结构不会添加重复的值

```javascript
const set = new Set([1, 2, 2]); // [1, 2]
set.add(2).add(3); // Set(3) {1, 2, 3}
set.has(2); // true
set.delete(1); // true -- 删除成功
set.size; // 2, Set(2) {2, 3}
```

Set 可以很容易地实现并集、交集和差集

```javascript
const a = new Set([1, 2, 4]);
const b = new Set([1, 2, 3]);

// 并集
const union = new Set([...a, ...b]); // Set(4) {1, 2, 4, 3}

// 交集
const inter = new Set([...a].filter((i) => b.has(i))); // Set(2) {1, 2}

// 差集
const diff = new Set([...a].filter((i) => !b.has(i))); // Set(1) {4}
```

### WeakSet

WeakSet 的成员只能是`对象`（不包括 null），而不能是其他类型的值，WeakSet 中的对象都是`弱引用，不可遍历`。

WeakSet 里面的引用，都不计入垃圾回收机制，`防止内存泄露`

```javascript
const ws = new WeakSet();
ws.add(1); // Invalid value used in weak set
ws.add(null); // Invalid value used in weak set
const arr = [[2], [3]];
const arrWs = new WeakSet(arr); // WeakSet {[2], [3]}

// WeakSet 没有size属性，没有办法遍历它的成员
ws.size; // undefined
ws.forEach; //undefined
```

## Map

Object 结构提供了 “字符串—值” 的对应，Map 结构提供了 “值—值” 的对应，是一种更完善的 Hash 结构实现。

```javascript
// set | get | has | delete | clear| size
const x = new Map([
  ["key1", 1],
  ["key2", 2],
]);
console.log(x); // Map(2) { 'key1' => 1, 'key2' => 2 }
const m = new Map();
const o = { name: "Y" };
// 如果对同一个键多次赋值，后面的值将覆盖前面的值
m.set(o, 1);
m.set(o, 2);
m.set(null, 1);
m.get(o); // 2
m.has(o); // true
m.set("1", "str1");
m.set(1, "num1");
m.get("1"); // 'str1'
m.size; // 4
m.clear();
m.size; // 0
```

### WeakMap

`WeakMap`只接受对象作为键名（`null`除外），不接受其他类型的值作为键名

```javascript
// 注意，WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用。
const wm = new WeakMap();
let key = {};
let obj = { foo: 1 };

wm.set(key, obj);
obj = null;
wm.get(key);
// Object {foo: 1}
```

`WeakMap`的键名所指向的对象，不计入垃圾回收机制，`防止内存泄露`

WeakMap 与 Map 在 API 上的区别一是没有遍历操作（即没有`keys()`、`values()`和`entries()`方法），也没有`size`属性。

二是无法清空，即不支持`clear`方法。

---

观察 WeakMap 里面的引用是否消失:

如果引用所指向的值占用特别多的内存，就可以通过 Node 的`process.memoryUsage`方法看出来:

```javascript
// node允许手动执行垃圾回收机制
node --expose-gc

// 执行一次手动垃圾回收，确保获取内存准确
> global.gc();

// 查看内存初始占用大约为3M
> process.memoryUsage()
{
  rss: 26243072,
  heapTotal: 4780032,
  heapUsed: 3286240,
  external: 1573692,
  arrayBuffers: 9408
}
> let wm = new WeakMap();
> let key = new Array(5 * 1024 * 1024);
> wm.set(key, 1)
// 此时，key引用的数组被引用了两次，key变量以及WeakMap的弱引用
// 但对引擎而言，引用计数为1

> global.gc()

// 内存占用为45M
> process.memoryUsage()
{
  rss: 68538368,
  heapTotal: 46727168,
  heapUsed: 45177528,
  external: 1573729,
  arrayBuffers: 9405
}
// 清除key对数组的引用，但没有清楚wm键名对数组的引用
> key = null

> global.gc()
// 内存占用恢复至3M
> process.memoryUsage()
{
  rss: 26570752,
  heapTotal: 4780032,
  heapUsed: 3084240,
  external: 1573732,
  arrayBuffers: 9408
}
```

由此可见，只要外部的引用消失，WeakMap 内部的引用就会被垃圾回收机制清除。

`Chrome 浏览器的 Dev Tools 的 Memory 面板`，有一个垃圾桶的按钮，可以强制垃圾回收（garbage collect）。

WeakMap 应用的典型场合就是 `DOM 节点作为键名`以及`部署私有属性`。

## Proxy

Proxy 可以`在目标对象外层搭建一层拦截`，外界对目标对象的某些操作，必须经过这层拦截。

```javascript
// target: 目标对象
// handler: 配置对象
const proxy = new Proxy(target, handler);

// 设置一个拦截器，拦截对象phone属性并处理成三段手机号码形式
const pHandler = {
  set(target, propKey, value, reciver) {
    if (propKey === "phone") {
      target[propKey] = value.match(/[0-9]/g).join("");
    } else {
      Reflect.set(target, propKey, value, reciver);
    }
  },
  get(target, propKey, reciver) {
    if (propKey === "phone") {
      return target[propKey].replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }
    return Reflect.get(target, propKey, reciver);
  },
};
const formatPhone = new Proxy({}, pHandler);
formatPhone.phone = "13432119667x";
formatPhone.phone; // '134-3211-9667'
```

### 拦截操作（13 个）

- target: 目标对象
- propKey： 属性名称
- value：属性值
- receiver： proxy 实例本身（严格地说，是操作行为所针对的对象）

#### get(target, propKey, receiver)

拦截对象属性的读取，如`obj.foo`

#### set(target, propKey, value, receiver)

拦截对象属性的设置，返回布尔值，如`obj.foo = 1`

#### has(target, propKey)

拦截`prop in obj`操作，但不能拦截`for-in`，返回布尔值

#### deleteProperty(target, propKey)

拦截 `delete obj[propKey]`操作，返回布尔值

#### ownKeys(target)

拦截`getOwnPropertyNames`、`getOwnPropertSymbols`、`Object.keys`、`for-in`操作，返回对象自身所有属性（包括 Symbol 属性，不含继承），若拦截`Object.keys`则只返回自身*可遍历*属性

#### getOwnPropertyDescriptor(target, propKey)

拦截`Object.getOwnPropertyDescriptor(obj, propKey)`操作，返回属性的描述对象。

#### defineProperty(target, propKey, propDesc)

拦截`Object.defineProperty`、`Object.defineProperties`操作，返回布尔值

#### preventExtensions(target)

拦截`Object.preventExtensions`操作，返回一个布尔值

#### getPrototypeOf(target)

拦截`Object.getPrototypeOf`，返回一个对象

#### isExtensible(target)

拦截`Object.isExtensible`，返回一个布尔值。

#### setPrototypeOf(target)

拦截`Object.setPrototypeOf(proxy, proto)`，返回一个布尔值。

#### apply(target, object, args)

拦截 Proxy 实例作为函数调用操作，如`proxy(...args)`、`proxy.call(obj, ...args)`和`proxy.apply(...)`

#### construct(target, args)

拦截 Proxy 实例作为构造函数调用，比如`new Proxy(...args)`

## Reflect

- 从`Reflect`对象上可以拿到语言内部的方法
- 修改某些`Object`方法的返回结果，让其变得更合理
- 让`Object`操作都变成函数行为
- `Reflect`对象的方法与`Proxy`对象的方法一一对应，也就是说，不管`Proxy`怎么修改默认行为，你总可以在`Reflect`上获取**默认行为**

### 静态方法（13 个）

#### get(target, name, receiver)

`Reflect.get`方法查找并返回`target`对象的`name`属性，如果没有该属性，则返回`undefined`。

如果`name`属性部署了读取函数（getter），则读取函数的`this`绑定`receiver`。

```javascript
// baz属性设置了读取函数
const obj = {
  foo: 1,
  bar: 2,
  get baz() {
    return this.foo + this.bar;
  },
};

const receiverObj = {
  foo: 3,
  bar: 4,
};

Reflect.get(obj, "baz", receiverObj); // 7
```

#### set(target, name, receiver)

`Reflect.set`方法设置`target`对象的`name`属性等于`value`。

如果`name`属性设置了赋值函数，则赋值函数的`this`绑定`receiver`。

```javascript
// bar属性设置了赋值函数
const obj = {
  foo: 1,
  set bar(value) {
    return (this.foo = value);
  },
};

const receiverObj = {
  foo: 0,
};

Reflect.set(obj, "bar", -1, receiverObj);
obj.foo; // 1
receiverObj.foo; // -1
```

#### has(obj, name)

`Reflect.has`方法对应`name in obj`里面的`in`运算符。

```javascript
let obj = {
  foo: 1,
};
// ES5
"foo" in obj; // true

// Reflect
Reflect.has(obj, "foo"); // true
```

#### deleteProperty(obj, name)

`Reflect.deleteProperty`方法等同于`delete obj[name]`，用于删除对象的属性。

```javascript
onst obj = { foo: 1, bar: 2}

// ES5
delete obj.foo

// ES6·Reflect
Reflect.deleteProperty(obj, 'bar')
```

#### ownKeys (target)

`Reflect.ownKeys`方法用于返回对象的所有属性，基本等同于`Object.getOwnPropertyNames`与`Object.getOwnPropertySymbols`之和。

```javascript
const obj = {
  foo: 1,
  bar: 2,
  [Symbol.for("baz")]: 3,
  [Symbol.for("bing")]: 4,
};

// ES5
Object.getOwnPropertyNames(obj);
// ['foo', 'bar']

Object.getOwnPropertySymbols(obj);
//[Symbol(baz), Symbol(bing)]

// 新写法
Reflect.ownKeys(myObject);
// ['foo', 'bar', Symbol(baz), Symbol(bing)]
```

#### getOwnPropertyDescriptor(target, propertyKey)

Reflect.getOwnPropertyDescriptor`基本等同于`Object.getOwnPropertyDescriptor

用于得到指定属性的描述对象，将来会替代掉后者。

```javascript
var obj = {};
Object.defineProperty(obj, "hidden", {
  value: true,
  enumerable: false,
});

// ES5
Object.getOwnPropertyDescriptor(obj, "hidden");
// {value: true, writable: false, enumerable: false, configurable: false}

// ES6·Reflect
Reflect.getOwnPropertyDescriptor(obj, "hidden");
// {value: true, writable: false, enumerable: false, configurable: false}
```

#### defineProperty(target, propertyKey, attributes)

`Reflect.defineProperty`方法基本等同于`Object.defineProperty`(将被废除)，用来为对象定义属性。

```javascript
const student = {};

// ES5
Object.defineProperty(student, "name", { value: "Mike" }); // {name:   "Mike"}

// ES6·Reflect
Reflect.defineProperty(student, "age", { value: 23 }); // true
```

#### preventExtensions(target)

`Reflect.preventExtensions`对应`Object.preventExtensions`方法。

用于让一个对象变为不可扩展，返回一个布尔值，表示是否操作成功。

```javascript
const obj = {};
// ES5
Object.preventExtensions(obj); // 返回obj本身即：{}

// ES6·Reflect
Reflect.preventExtensions(obj); // true

obj.name = "change";
console.log(obj); // {}
```

#### getPrototypeOf(obj)

`Reflect.getPrototypeOf`方法用于读取对象的`__proto__`属性，对应`Object.getPrototypeOf(obj)`。

```javascript
function Fancy(name) {
  this.name = name;
}
const obj = Reflect.construct(Fancy, ["Tom"]);

// ES5
Object.getPrototypeOf(obj) === Fancy.prototype;
// true

// ES6·Reflect
Reflect.getPrototypeOf(obj) === Fancy.prototype;
// true
```

#### isExtensible (target)

`Reflect.isExtensible`方法对应`Object.isExtensible
返回一个布尔值，表示当前对象是否可扩展。

```javascript
const obj = {};

// ES5
Object.isExtensible(obj); // true

// ES6·Reflect
Reflect.isExtensible(obj); // true
```

#### setPrototypeOf(obj, newProto)

`Reflect.setPrototypeOf`方法用于设置目标对象的原型（prototype），对应`Object.setPrototypeOf(obj, newProto)`方法。它返回一个布尔值，表示是否设置成功。

```javascript
const myObj = {};

// ES5
Object.setPrototypeOf(myObj, Array.prototype);

// ES6·Reflect
Reflect.setPrototypeOf(myObj, Array.prototype);

myObj.length; // 0
```

#### apply(func, thisArg, args)

`Reflect.apply`方法等同于`Function.prototype.apply.call(func, thisArg, args)`，用于绑定`this`对象后执行给定函数。

#### construct(target, args)

`Reflect.construct`方法等同于`new target(...args)`，这提供了一种不使用`new`，来调用构造函数的方法。

```javascript
function Greeting(name) {
  this.name = name;
}

// new写法
const Foo = new Greeting("Tom");

// construct写法
const Bar = Reflect.construct(Greeting, ["Jerry"]);
```

## Promise 实例

Promise 的出现是为了解决`回调地狱`
一个 `Promise`有以下几种状态:

- _pending_: 初始状态，既不是成功，也不是失败状态。
- _fulfilled_: 意味着操作成功完成。
- _rejected_: 意味着操作失败。

`Promise`对象的状态改变，只有两种可能：

- 从`pending`变为`fulfilled`
- 从`pending`变为`rejected`

> 一旦状态改变，就不会再变，任何时候都可以得到这个结果

`Promise`构造函数接受一个函数作为参数，该函数的两个参数分别是`resolve`和`reject`。

`resolve`函数的作用是，将`Promise`对象的状态从 pending 变为 resolved，在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；

`reject`函数的作用是，将`Promise`对象的状态从 pending 变为 rejected，在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

```javascript
const p = new Promise((resolve, reject) => {
  console.log(`Promise新建后立即执行`);
  setTimeout(() => {
    const res = [{}, {}];
    resolve(res);
    console.log(`成功返回`);
  }, 1000);
});

p.then((res) => console.log(res));
// Promise新建后立即执行
// 成功返回
// [{}, {}]
```

Promise 实现 ajax

```javascript
const aPromimse = (url) => {
  return new Promise((resolve, reject) => {
    const handler = function () {
      if (this.readyState === 4) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onreadystatechange = handler;
    xhr.send();
  });
};
const url = "https://jsonplaceholder.typicode.com/todos/1";
aPromimse(url).then((res) => console.log(`res: ${res}`));
```

### Promise.prototype.then()

`then`方法的第一个参数是`resolved`状态的回调函数，第二个参数（可选）是`rejected`状态的回调函数

### Promise.prototype.catch()

用于指定发生错误时的回调函数。

```javascript
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(`some error`);
    console.log(`返回失败`);
  }, 1000);
});

p.catch((err) => console.error(err)); // some error
```

如果 Promise 状态已经变成`resolved`，再抛出错误是无效的。

```javascript
const promise = new Promise(function (resolve, reject) {
  resolve("ok");
  throw new Error("test");
});
promise
  .then(function (value) {
    console.log(value);
  })
  .catch(function (error) {
    console.log(error);
  });
// ok
```

### Promise.prototype.finally()

`finally()`方法用于指定不管 Promise 对象最后状态如何，都会执行的操作.

```javascript
promise.finally(() => {
  // 语句
});

// 等同于
promise.then(
  (result) => {
    return result;
  },
  (error) => {
    throw error;
  }
);

// resolve 的值是 undefined
Promise.resolve(2).then(
  () => {},
  () => {}
);

// resolve 的值是 2
Promise.resolve(2).finally(() => {});

// reject 的值是 undefined
Promise.reject(3).then(
  () => {},
  () => {}
);

// reject 的值是 3
Promise.reject(3).finally(() => {});
```

上面代码中，不管`promise`最后的状态，在执行完`then`或`catch`指定的回调函数以后，都会执行`finally`方法指定的回调函数。

### Promise.all()

```javascript
// Promise.all()方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例
const p = Promise.all([p1, p2, p3]);
```

`p`的状态由`p1`、`p2`、`p3`决定，分成两种情况。

（1）只有`p1`、`p2`、`p3`的状态都变成`fulfilled`，`p`的状态才会变成`fulfilled`，此时`p1`、`p2`、`p3`的返回值组成一个数组，传递给`p`的回调函数。

（2）只要`p1`、`p2`、`p3`之中有一个被`rejected`，`p`的状态就变成`rejected`，此时第一个被`reject`的实例的返回值，会传递给`p`的回调函数。

```javascript
const p1 = Promise.resolve(1);
const p2 = Promise.reject(2);
const p3 = Promise.resolve(3);

const p = Promise.all([p1, p2]);
p.then((r) => console.log(`r: ${r}`)).catch((e) => console.error(`e: ${e}`));
// e: 2

const _p = Promise.all([p1, p3]);
_p.then((r) => console.log(`r: ${r}`)).catch((e) => console.error(`e: ${e}`));
// [1, 3]

const p4 = new Promise((resolve, reject) => {
  throw new Error("4");
})
  .then((r) => r)
  .catch((e) => e); // 返回一个新的Promise，执行完catch后变为resovled

// p1会resolved，p2首先会rejected，catch返回的新Promise执行完catch后为resolved
// 故Promise.all的结果为resolved
const pc = Promise.all([p1, p4]);
pc.then((r) => console.log(`r: ${r}`)).catch((e) => console.error(`e: ${e}`));
//r: 1,Error: 4
```

### Promise.race()

```javascript
const p = Promise.race([p1, p2, p3]);
```

只要`p1`、`p2`、`p3`之中有一个实例率先改变状态，`p`的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给`p`的回调函数。

### Promise.allSettled()

```javascript
const p = Promise.race([p1, p2]);
```

只有等到所有这些参数实例都返回结果，不管是`fulfilled`还是`rejected`，包装实例`p`才会结束。

`Promise.all`无法确定所有请求都结束。

```javascript
const p1 = Promise.resolve(1);
const p2 = Promise.reject(2);

// 返回的数组对象，status值为fulfilled（value）或者 rejected（reason）
const p = Promise.allSettled([p1, p2]);
p.then((r) => console.log(r));
// [{status: "fulfilled", value: 1}, {status: "rejected", reason: 2}]
```

### Promise.resolve()

将现有对象转为 Promise 对象

### Promise.reject()

Promise.reject(reason)方法也会返回一个新的 Promise 实例，该实例的状态为 rejected

## Iterator 迭代器

- 为各种数据结构提供统一、简便的访问接口
- 提供`for-of`使用

`next`方法返回的对象的结构是`{value, done}，`其中`value`表示当前的数据的值，`done`是一个布尔值，表示遍历是否结束。

```javascript
const it = new makeIterator(["a", "b"]);

function makeIterator(arr) {
  let i = 0;
  return {
    next() {
      return {
        value: i > arr.length ? undefined : arr[i++],
        done: i > arr.length,
      };
    },
  };
}

it.next(); // {value: "a", done: false}
it.next(); // {value: "b", done: false}
it.next(); // {value: undefined, done: true}
```

原生具备 Iterator 接口（即部署了`Symbol.iterator`属性）的数据结构：

- Array
- String
- Map
- Set
- `arguments`参数
- `NodeList`对象

```javascript
const arr = ["a", "b"];
const it = arr[Symbol.iterator]();
it.next(); // {value: "a", done: false}
it.next(); // {value: "b", done: false}
it.next(); // {value: undefined, done: true}
```

### 调用`Iterator`接口的场合

- `for-of`
- `Array.from`
- `Map()` | `Set()`  |  `WeakMap()` |  `WeakSet()`
- `Proimise.race()` | `Promise.all()`
- `解构赋值`
- `扩展运算符`
- `yield*`

```javascript
function* A() {
  yield 1;
  yield 2;
  return 3;
}
function* B(count) {
  for (let i = 0; i < count; i++) {
    yield "re";
  }
}

function* C() {
  let result = yield* A(); // 执行到 return 语句才返回
  console.log(result);
  yield* B(result);
}
const iterator = C();
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
// 3
console.log(iterator.next()); // { value: 're', done: false }
```

### Generator 函数 实现 Iterator 接口

```javascript
// 对象原生未部署 Iterator 接口
let Iterable = {
 [Symbol.iterator]: function* () {
   yield 1;
   yield* [2, 3]
 }
}
[...Iterable] //  [1, 2, 3]
```

### for-of 遍历

ES6 的 `Array`， `Map`， `Set`接口默认部署了以下三个方法，调用后返回遍历器对象。

- `entries()`: 返回`[key， value]`组成的数组
- `keys()`：返回一个遍历器对象，包含所有`key`
- `values()`： 返回一个遍历器对象，包含所有`value`

```javascript
// 使用 for-of 遍历对象
let obj = {age: 12, name: 'Jack'}
for (ler key of Object.keys(obj)) {
    console.log(key, obj[key])
}
// age 12
// name jack
```

对比其他遍历方法

`for` 写法麻烦

`forEach`： 中途无法跳出循环。break 命令或者 return 命令都无效

`for-in`: 以任意顺序遍历自身及原型链上所有键名，返回字符串格式的键名(`'0'`)

## 异步遍历器

`Iterator` 遍历器的`next`方法必须是`同步`的，只要调用必须立刻返回值。

但如果`next()`返回一个 Promise 对象（异步操作），这样就不符合`Iterator`协议

### next()异步操作

目前解决的方法是将`next ()`返回值的`value`包装为 Promise 对象，等待真正的值返回，

而`done`属性则同步返回。

```javascript
const it = makeAsyncIterator();
function makeAsyncIterator() {
  let i = 0;
  return {
    next() {
      return {
        value: new Promise((resolve, reject) => {
          setTimeout(() => resolve(i++), 100);
        }),
        done: false,
      };
    },
  };
}

it.next().value.then((r) => console.log(r)); // 100ms左右后返回 0
```

### for await…of

```javascript
(async function () {
  for await (const x of ["a", "b"]) {
    console.log(x);
  }
})();
// a
// b
// Promise {<fulfilled>: undefined}
```

### 异步 Generator 函数

```javascript
async function* gen() {
  yield 1;
}
const ait = gen();
ait.next().then((r) => console.log(r)); // {value: 1, done: false}
ait.next().then((r) => console.log(r)); // {value: undefined, done: true}
```

## Class 类

`constructor`方法即构造方法，也就是说 ES5 的构造函数 `Point`，对应 ES6 的`Point`类的构造方法

一个类必须有`constructor`方法，如果没有显式定义，一个空的`constructor`方法会被默认添加

`constructor`方法默认返回实例对象（即`this`）

```javascript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  print() {
    console.log(`x:${this.x}, y: ${this.y}`);
  }
}
const p = new Point(1, 2);
p.print(); // x:1, y: 2

// 类数据类型是函数，类本身就指向构造函数
typeof Point; // 'function'
(p.constructor === Point) === Point.prototype.constructor; // true

// constructor函数返回一个全新的对象，结果导致实例对象不是 Foo类的实例
class Foo {
  constructor() {
    return Object.create(null);
  }
}

new Foo() instanceof Foo; // fasle
```

事实上，类的所有方法都定义在类的`prototype`属性上面。

```javascript
class Ball {
  print() {
    console.log(`球`);
  }
}
Ball.print(); // Ball.print is not a function
Ball.prototype.print(); // 球

// 由于类的方法定义在其prototype对象上，
// 类的新方法可以利用Object.assign 向【类的prototype】添加
Object.assign(Ball.prototype, {
  toString() {},
});
```

类的内部所有定义的方法，都是不可枚举的，**这一点与 ES5 行为不一致**

```javascript
class A {
  toString() {}
}
A.prototype.print = () => {};
Object.keys(A.prototype); // ["print"]
```

**不会把类的声明提升到代码头部**

在 “类” 的内部可以使用`get`和`set`关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为

```javascript
class MyClass {
  get name() {
    return "getter";
  }
  set name(val) {
    console.log(`setter: ${val}`);
  }
}
let cn = new MyClass();
cn.name = "中文"; // setter: 中文
cn.name; // getter
```

如果某个方法之前加上星号（`*`），就表示该方法是一个 Generator 函数

```javascript
class Test {
  constructor(...args) {
    this.args = args;
  }
  *[Symbol.iterator]() {
    for (let a of this.args) {
      yield a;
    }
  }
}
for (let s of new Test("ss", "hh", "ii")) console.log(s);
```

### 静态方法

如果在一个方法前，加上`static`关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为 “静态方法”。

静态方法可以与非静态方法重名。

```javascript
class Foo {
  static getName() {
    return "Foo";
  }
  getName() {
    return "foo";
  }
}
const foo = new Foo();
foo.getName(); // foo
Foo.prototype.getName(); // foo
Foo.getName(); // Foo
```

如果静态方法包含`this`关键字，这个`this`指的是类，而不是实例

```javascript
class Foo {
  static bar() {
    this.baz();
  }
  static baz() {
    console.log(`static`);
  }
  bar() {
    console.log(`bar`);
  }
}
Foo.bar(); // static
```

父类的静态方法，可以被子类继承。

```javascript
class Foo {
  static classMethod() {
    return "hello";
  }
}

class Bar extends Foo {}

Bar.classMethod(); // hello
```

### 私有方法和私有属性

私有方法和私有属性，是只能在类的内部访问的方法和属性，外部不能访问。

- 一种做法是在命名上加以区别, 如`_geName`
- 将私有方法移出类，因为类内部的所有方法都是对外可见的。
- 利用`Symbol`值的唯一性，将私有方法的名字命名为一个`Symbol`值。

### new.target 属性

`new`是从构造函数生成实例对象的命令

该属性一般用在构造函数之中，返回`new`命令作用于的那个构造函数。如果构造函数不是通过`new`命令或`Reflect.construct()`调用的，`new.target`会返回`undefined`，因此这个属性可以用来确定构造函数是怎么调用的。

```javascript
class PersonClass {
  constructor(name) {
    this.name = name;
  }
  sayName() {
    console.log(this.name);
  }
}

// 等价于

let PersonClass2 = (function () {
  "use strict";
  const PersonType = function (name) {
    if (typeof new.target === "undefined") {
      throw new Error(`必须使用new`);
    }
    this.name = name;
  };
  Object.defineProperty(PersonType.prototype, "sayName", {
    configurable: true,
    writable: true,
    enumerable: true,
    value: function () {
      if (typeof new.target !== "undefined") {
        throw new Error(`不能使用new`);
      }
      console.log(this.name);
    },
  });
  return PersonType;
})();

const x = new PersonClass2("22");
x.sayName();
```

## Class 的继承

Class 可以通过`extends`关键字实现继承

子类必须在`constructor`方法中调用`super`方法，否则新建实例时会报错

父类的静态方法，也会被子类继承

`Object.getPrototypeOf`方法可以用来从子类上获取父类。

```javascript
class Foo {}
class F extentds Foo {
  constructor () {
    super()
  }
}

Object.getPrototypeOf(F) === Foo // true
```

### super 关键字

`super`作为函数调用时，代表父类的构造函数，但是返回的是子类`B`的实例。

子类的构造函数必须执行一次`super`函数，才能使用`this`关键字

`super()`只能用在子类的构造函数之中，用在其他地方就会报错。

```javascript
class A {}

class B extends A {
  constructor() {
    super(); // 相当于 A.prototype.constructor.call(this)
  }
}
```

`super`作为对象时，在普通方法中，指向`父类的原型对象`；在静态方法中，指向`父类`。

```javascript
class Parent {
  static myMethod(msg) {
    console.log("static", msg);
  }

  myMethod(msg) {
    console.log("instance", msg);
  }
}

class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg); // 指向父类 Parent.
  }

  myMethod(msg) {
    super.myMethod(msg); // 父类的原型对象 Parent.prototype
  }
}

Child.myMethod(1); // static 1

const child = new Child();
child.myMethod(2); // instance 2
```

## Module 模块

ES6 模块是编译时加载，使得静态分析成为可能

```javascript
// some.js 导出
export const first = 1;

const second = 2;
export { second };

// 导入
import { first, second } from "./some";
```

### `as` 别名

```javascript
// some.js
export function mutiply(x, y) {
  return x * y;
}

import { mutiply as muti } from "./some";
muti(2, 2); // 4
```

import 是静态执行，不能使用表达式和变量

### 模块整体加载

用星号`*`指定一个对象，所有输出值都加载在这个对象上

```javascript
// some.js
export Jack = 23
export Jenny = 22

// 整体加载
import * as Age from './some'
console.log(Age.Jack, Age.Jenny) // 23, 22
```

### export default 命令

```javascript
// some.js
export default function muti (x, y) {
    return x * y
}
export const num1 = 22
export const num2 = 2

import muti, { num1, num2 } fromn './some'
```

### Node.js 的模块加载方法

JavaScript 现在有两种模块。一种是 ES6 模块，简称 ESM；另一种是 CommonJS 模块，简称 CJS。

CommonJS 模块使用`require()`和`module.exports`，ES6 模块使用`import`和`export`。

### 循环加载

循环加载”（circular dependency）指的是，`a`脚本的执行依赖`b`脚本，而`b`脚本的执行又依赖`a`脚本。

### Node.js 处理循环加载

CommonJS 模块的重要特性是加载时执行，即脚本代码在`require`的时候，就会全部执行。一旦出现某个模块被 "循环加载"，就只输出已经执行的部分，还未执行的部分不会输出。

```javascript
// a.js
exports.done = false;
var b = require("./b.js");
console.log("在 a.js 之中，b.done = %j", b.done);
exports.done = true;
console.log("a.js 执行完毕");

// b.js
exports.done = false;
var a = require("./a.js");
console.log("在 b.js 之中，a.done = %j", a.done);
exports.done = true;
console.log("b.js 执行完毕");
```

`a.js`执行完第一行后就等待`b.js`执行完毕，`b.js`执行第二行时又会加载`a.js`

`a.js`已经执行的部分:

```javascript
exports.done = false;
```

因此，对于`b.js`来说，它从`a.js`只输入一个变量`done`，值为`false`。

```javascript
// main.js
var a = require("./a.js");
var b = require("./b.js");
console.log("在 main.js 之中, a.done=%j, b.done=%j", a.done, b.done);

// 在 b.js 之中，a.done = false
// b.js 执行完毕
// 在 a.js 之中，b.done = true
// a.js 执行完毕
// 在 main.js 之中, a.done=true, b.done=true
```

#### ES6 处理循环加载

ES6 处理 “循环加载” 与 CommonJS 有本质的不同。ES6 模块是动态引用，如果使用`import`从一个模块加载变量（即`import foo from 'foo'`），那些变量不会被缓存，而是成为一个指向被加载模块的引用，需要开发者自己保证，真正取值的时候能够取到值。

```javascript
// a.mjs
import { bar } from "./b";
console.log("a.mjs");
console.log(bar);
export let foo = "foo";

// b.mjs
import { foo } from "./a";
console.log("b.mjs");
console.log(foo);
export let bar = "bar";

// 输出： ReferenceError: foo is not defined
```

首先，执行`a.mjs`以后，引擎发现它加载了`b.mjs`，因此会优先执行`b.mjs`，然后再执行`a.mjs`。接着，执行`b.mjs`的时候，已知它从`a.mjs`输入了`foo`接口，这时不会去执行`a.mjs`，而是认为这个接口已经存在了，继续往下执行。执行到第三行`console.log(foo)`的时候，才发现这个接口根本没定义，因此报错。

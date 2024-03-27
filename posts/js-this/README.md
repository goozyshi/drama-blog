---
date: 2021-01-11
category: Frontend
tags:
  - Javascript
  - Notes
spot: 留学生创业大厦
location: 深圳，科苑
outline: deep
---

# this 和 闭包

## this 的指向

> this 的指向`只与其运行时基于函数的的执行环境`有关，而非函数被声明时的环境

this 的调用大概可以分为以下 4 类：

### 1. 作为普通函数调用

此时`this指向全局对象`，即 window 对象

```javascript
var flag = "outside";
var foo = function () {
  var flag = "inside";
  console.log(this.flag);
};
foo(); // outside
```

⚠️ 以`变量print来引用foo.print`，调用 print 时为普通函数调用，指向全局对象 window

```javascript
var flag = "outside";
var foo = {
  flag: "inside",
  print: function () {
    console.log(this.flag);
  },
};
var print = foo.print;
print(); // outside
foo.print(); // inside
```

### 2. 作为对象方法调用

作为对象方法调用，`this指向该对象`

```javascript
var flag = "outside";
var foo = {
  flag: "inside",
  print: function () {
    console.log(this.flag);
  },
};
foo.print(); // inside
```

### 3. 构造器调用（`new`）

当用 new 运算符调用函数时，该函数总会返回一个对象，this 就指向这个**`返回的对象`**

```javascript
var flag = "outside";
var Foo = function () {
  this.flag = "inside";
};
var foo = new Foo();
foo.flag; // inside
```

⚠️ 构造函数`显式返回一个对象`时，this 指向该返回的对象

```javascript
var flag = "outside";
var Foo = function () {
  this.flag = "inside";
  return {
    name: "noFlag",
  };
};
var foo = new Foo();
foo.flag; // undefined
foo.name; // 'noFlag'
```

### 4. `call` 或`apply` 调用

`Fuction.prototype.call`或`Fuction.prototype.apply`可以动态的改变传入函数的 this， 此时`this指向绑定的对象`。

```javascript
var obj1 = {
  name: "obj1",
  getName: function () {
    return this.name;
  },
};
var obj2 = {
  name: "obj2",
};
console.log(obj1.getName.apply(obj2)); // obj2
```

简而言之，`闭包就是就是函数A返回函数B，函数B调用了A函数作用域内的局部变量`

## 变量的作用域

指的是变量的有效范围，声明变量的关键字有 var、let 以及 const，`未使用关键字声明默认为全局变量`。

### var、let、const

var 存在提升（`变量尚未声明就可以使用`），在全局作用域下声明的变量会挂载到 window 对象上。

```javascript
console.log(a); // undefined
var a = 1;
console.log(window.a); // 1
```

let、const 声明的变量`存在暂时性死区`（不能在声明前使用变量），而且`禁止重声明`。

ES6 中常用`let定义一个块级变量`，`const定义一个块级常量`

```javascript
console.log(A, B); // ReferenceError
let A = 1;
const B = 2;
A = 3; // 3
B = 4; // 报错，const定义一个常量，不允许修改
```

⚠️const 定义的变量值类型为对象时，其属性的修改不会引起报错。也就是说`const实际上定义的是一个不允许引用被修改的变量`

⚠️ 若想要声明的对象不允许修改，可以使用`Object.freeze()`方法冻结对象。

```javascript
const obj = { name: "before" };
obj.name = "after";
console.log(obj.name); // after
Object.freeze(obj);
obj.name = "change";
console.log(obj.name); // after
```

## 闭包的用途

- 封装变量
- 延长局部变量作用域

### 闭包与内存管理

由于闭包让原本应该在函数执行完毕就销毁的局部变量继续存在，在以`引用计数策略`进行垃圾回收的浏览器（点名 IE），

容易造成`循环引用`而导致内存泄漏。

### 自加一函数的实现

这里闭包返回了一个函数，不可以直接执行，改成`立即执行函数`。

```javascript
var add = (function () {
  let i = 0;
  return function () {
    return ++i;
  };
})();
add(); // 1
add(); // 2
```

### 异步执行问题

一个常见的问题是，想让 for 循环间隔 1s 打印 0 到 4，结果输出了`五个5`。

这是因为：由于 js 异步执行 setTimeout()函数时，for 循环已结束（此时 i = 5）

```javascript
for (var i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
// 结果：输出5个5
```

若要达到期望效果：

**使用闭包**

```javascript
for (var i = 0; i < 5; i++) {
  (function () {
    let j = i;
    setTimeout(function () {
      console.log(j);
    }, j * 1000);
  })();
}
// 结果： 0, 1, 2, 3, 4
```

**let 块级作用域**

```javascript
for (let i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
// 结果： 0, 1, 2, 3, 4
```

## 附录 1·ReferenceError 和 TypeError

### `LHS` 与  `RHS`查询

编译引擎执行一段代码时会通过查询来判断代码中的变量是否已经声明。

查询类型共两种： `LHS` 与  `RHS`

LHS 和 RHS 可粗略地理解为“赋值操作的左侧和右侧”

- LHS: 赋值操作的目标
- RHS: 谁是赋值操作的源头，非左侧赋值都是 RHS

【示例】

```javascript
function foo(a) {
  var b = a;
  return a + b;
}
var c = foo(2);
// LHS: 3处，c = .. || a = 2(隐式赋值) || b = ..
// RHS: 4处，= foo(2) || = a || a = 2 ||  a + b
```

### 赋值异常

对 b 进行 RHS 查询时无法找到该变量，即是“未声明”，此时引擎会抛出 ReferenceError 异常。

如果 RHS 查询到一个变量，但你尝试对这个变量的值进行不合理的操作，引擎则会抛出 TypeError 异常

```javascript
function foo(a) {
  console.log(a + b); //Uncaught ReferenceError: b is not defined
  b = a;
}
foo(2);
var c;
console.log(c.lentgh); // Uncaught TypeError: Cannot read property 'length' of undefined
```

总结，`ReferenceError 异常`同`作用域判别失败`相关，而`TypeError`表示`作用域判别成功`，但对其值的操作是非法或不合理的。

```javascript
foo(); // Uncaught TypeError: foo is not a function
bar(); // ReferenceError
zoo(); // done
var foo = function bar() {
  // foo函数没有变量提升， bar是匿名函数
  console.log("goozyshi");
};
function zoo() {
  // 变量提升
  console.log("done");
}
```

---
date: 2023-03-30
category: Frontend
tags:
  - Node.js
  - Notes
spot: 巷寓
location: 深圳，海滨社区
outline: deep
---

# Node 基础笔记

## 模块

Node.js 在早期就采用了 `CommonJS` 规范实现了模块化，而 Web (浏览器) 中的 JS，在发展过程中诞生了 `ECMAScript 标准`，在 ES6(ES2015) 中才推出了 `ECMAScript Modules` 规范。

### CommonJS

CJS 模块使用 `require` 和 `module.exports` 实现导入和导出。

文件后缀：`.cjs` | `.js`

#### 导出

- **module.exports**【推荐】
- **exports**

`exports` 实际上是 `module.exports` 的一个引用，一旦将 exports 重新赋值，就会失效

```js
// 导出一个名为 "hello" 的函数到 "exports" 对象中
// 函数中会将 "Hello World!" 的信息输出到控制台中
exports.hello = function () {
  console.log("Hello World!");
};

// 等价于
module.exports.hello = function () {
  console.log("Hello World!");
};
// 导致 exports 不再指向 module.exports
exports = {};
```

#### 引入

- require

```js
// 导入模块 "./exports" 并将其赋值给变量 context
const context = require("./exports");

// 导入模块 "./exports" 中的 hello, userInfo 和 byebye，并赋值给相应的变量
const { hello, userInfo, byebye: by } = require("./exports");
```

### ES Modules

- export default
- export
- import

#### 导出

- export default
- export

```js
// 文件 export_default.js
// 导出默认对象
export default {
  // 定义 hello 方法，输出欢迎信息
  hello(name) {
    console.log(`Hello, ${name}!`);
  },
  // 定义 byebye 方法，输出道别信息
  byebye(name) {
    console.log(`byebye, ${name}!`);
  },
  // 定义 userInfo 对象，存储用户信息
  userInfo: {
    name: "forever", // 用户名
    age: 18, // 用户年龄
  },
};

// 从 './lib.js' 中导出 hello 和默认导出并重命名为 libData
export { hello, default as libData } from "./lib.js";
```

#### 导入

- import

文件后缀：`.mjs` | `.js`

```js
// 导入 export_all.js 中所有被导出的模块成员，并作为 allValues 对象的属性
import * as allValues from "./export_all.js";

// usage.js
import { hello, byebye, libData, utilData } from "./index.js";
```

### 区别

CJS 与 ESM 之间的一些区别，包括 `加载时机`、`导出内容`、`文件命名` 上的区别：

- 加载时机：`CJS` 支持动态加载模块 (`require` 语句可以出现在任意位置)，`ESM` 会在所有模块都加载完毕后才执行代码 (通常会将 import 导入语句放在模块的顶部)；
- 导出内容：`ESM` 导入的是值的引用，而 `CJS` 导入的是值的拷贝；
- 文件命名：一般都以 `.js` 结尾，通过 `package.json` 中 `"type":"module"` 区分模块加载类型，也可以通过文件命名来区分 `.cjs` 表明是 CJS 规范的模块，`.mjs` 表明是 ESM 规范的模块。

### reqire 查找文件顺序

- 缓存的模块优先级最高
- 如果是内置模块，则直接返回，优先级仅次缓存的模块
- 如果是绝对路径 / 开头，则从根目录找
- 如果是相对路径 ./开头，则从当前 require 文件相对位置找
- 如果文件没有携带后缀，先从 js、json、node 按顺序查找
- 如果是目录，则根据 package.json 的 main 属性值决定目录下入口文件，默认情况为 index.js
- 如果文件为第三方模块，则会引入 node_modules 文件，如果不在当前仓库文件中，则自动从上级递归查找，直到根目录

#### 如何处理循环依赖

当循环调用 `require()` 时，一个模块可能在未完成执行时被返回。

例如以下情况:

```js
// a.js
console.log('a 开始');
exports.done = false;
const b = require('./b.js');
console.log('在 a 中，b.done = %j', b.done);
exports.done = true;
console.log('a 结束');

// b.js
console.log('b 开始');
exports.done = false;
const a = require('./a.js');
console.log('在 b 中，a.done = %j', a.done);
exports.done = true;
console.log('b 结束');

// mian.js
console.log('main 开始');
const a = require('./a.js');
const b = require('./b.js');
console.log('在 main 中，a.done=%j，b.done=%j', a.done, b.done);
```

当 `main.js` 加载 `a.js` 时， `a.js` 又加载 `b.js`。 此时， `b.js` 会尝试去加载 `a.js`。 为了防止无限的循环，会返回一个 `a.js` 的 `exports` 对象的 未完成的副本 给 `b.js` 模块。 然后 `b.js` 完成加载，并将 `exports` 对象提供给 `a.js` 模块。

当 `main.js` 加载这两个模块时，它们都已经完成加载。 因此，该程序的输出会是：

```js
$ node main.js
     main 开始
     a 开始
     b 开始
     在 b 中，a.done = false
     b 结束
     在 a 中，b.done = true
     a 结束
     在 main 中，a.done=true，b.done=true
```




## 常用内置模块

| **模块名称**       | **说明**                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| global             | 全局对象，挂载了一些常用方法和属性                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| path               | 提供与文件路径相关的实用工具方法                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| fs                 | 文件系统模块，用于操作文件和目录                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| util               | 提供一些实用工具函数                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| http               | 用于创建 HTTP 服务器，也可用于向已有服务发起请求并获取响应                                                                                                                                                                                                                                                                                                                                                                                                               |
| child_process      | 用于创建操作子进程                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 其它常用的工具模块 | [url](https://link.juejin.cn/?target=https%3A%2F%2Fnodejs.cn%2Fdist%2Flatest-v18.x%2Fdocs%2Fapi%2Furl.html)，[Timers](https://link.juejin.cn/?target=https%3A%2F%2Fnodejs.cn%2Fdist%2Flatest-v18.x%2Fdocs%2Fapi%2Ftimers.html)，[Readline](https://link.juejin.cn/?target=https%3A%2F%2Fnodejs.cn%2Fdist%2Flatest-v18.x%2Fdocs%2Fapi%2Freadline.html)，[crypto](https://link.juejin.cn/?target=https%3A%2F%2Fnodejs.cn%2Fdist%2Flatest-v18.x%2Fdocs%2Fapi%2Fcrypto.html) |

## 全局对象和变量

### 特殊变量

- `__filename` ： 当前正在执行的脚本文件的绝对路径
- `__dirname` ：当前执行脚本所在目录的绝对路径

这 2 个变量，**只在 CJS 模块下存在**，如果是 ESM 将会出现以下的报错信息。

```sh
ReferenceError: __dirname is not defined in ES module scope
```

在 ESM 中可以使用`createRequire(import.meta.url)`:

```sh
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { createRequire } from 'module'

console.log('__filename', __filename)
console.log('__dirname', __dirname)

const require = createRequire(import.meta.url)
console.log('name', require('./package.json').name)
```

### 常用 global 属性

#### process 属性

process 对象提供了与当前 Node.js 进程相关的信息和控制方法，

- `process.argv` 获取启动 Node 进程时传递的命令行参数。
- `process.cwd()` 获取当前工作目录的绝对路径
- `process.env` 获取当前执行环境的环境变量
- `process.version` 获取当前 Node 版本
- `process.exit([statusCode])` : 终止 Node.js 进程，指定`code` 参数作为退出状态码
- `process.pid`：返回进程的 PID (进程 ID)；
- `process.platform`：返回运行 Node.js 的操作系统平台；
- `process.arch`：获取 CPU 架构信息
- `process.stdin`：用于从标准输入流 (stdin) 读取数据
- `process.stdout`：标准输出流，常用 `process.stdout.write` 进行数据写入。

#### Buffer

`Buffer` 用于处理二进制数据。类似于数组，并提供了一些方便的方法来操作二进制数据

**创建 Buffer 对象**

```js
const buf = Buffer.alloc(10); // 创建一个大小为 10 的 Buffer 对象，默认会用 0 填充
const buf2 = Buffer.from("Hello, world!"); // 创建一个包含字符串 'Hello, world!' 的 Buffer 对象
const buf3 = Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f]); // 内容为hello构成的16进制数组 Buffer 对象
```

**转换内容格式**

```js
const buf = Buffer.from("Hello, world!");
// 转为字符串输出
console.log(buf.toString()); // 输出 'Hello, world!'

// 转为16进制字符串输出
console.log(buf.toString("hex")); // 输出 '48656c6c6f2c20776f726c6421'（对应的是 'Hello, world!' 的 ASCII 码）

// 转为数组输出
console.log(Array.from(buf)); // 输出 [
//    72, 101, 108, 108, 111,
//    44,  32, 119, 111, 114,
//   108, 100,  33
// ]

// 转为base64格式输出
console.log(buf.toString("base64")); // 输出 'SGVsbG8sIHdvcmxkIQ=='
```

**写入内容**

`write`

```js
// 创建一个长度为 10 的 Buffer 实例并将它填充为 0
const buf = Buffer.alloc(10);

// 将字符串 'Hello' 写入 Buffer 实例的前 5 个字节
buf.write("Hello");

// 将字符串 'world' 写入 Buffer 实例的第 6 个字节开始的位置，由于 'world' 的长度为 5，所以不会覆盖掉之前写入的 'Hello'
buf.write("world", 5);

// 将 Buffer 实例转换为字符串并输出 'Hello world'
console.log(buf.toString());
```

**合并多个 Buffer 对象**

` Buffer.concat`

```js
const buf1 = Buffer.from("Hello");
const buf2 = Buffer.from("World");
const buf3 = Buffer.concat([buf1, buf2]);
console.log(buf3.toString()); // 输出 'HelloWorld'
```

**截取 Buffer 对象**

`Buffer.slice`

```js
const buf = Buffer.from("Hello, world!");
const buf2 = buf.slice(0, 5);
console.log(buf2.toString()); // 输出 'Hello'
```

## path 路径处理

- 拼接路径：`join`，`resolve`；

- 解析路径：`parse`，`dirname`，`basename`，`extname`；

- 规范化路径：`normalize`；

- 获取分隔符：`sep`。

  ### 区别

- path.join -- 拼接相对路径

- path.resolve -- 拼接绝对路径

- path.dirname -- 返回路径目录名

- path.basename -- 返回路径中的文件名，并可选地去除给定的文件扩展名

- path.extname -- 获取文件拓展名

- path.normalize -- 规范化路径，将路径中的不规范部分调整为标准格式(处理`//`或者`./`和`../`情况)

- path.parse -- 解析文件路径，将其拆分为一个对象

```js
console.log(path.normalize("a//b//c/d/e/..")); // 规范化： a/b/c/d/e
```

## FS 文件系统模块

fs 文件系统模块，用于操作文件和目录.

- 同步 (Sync)：例如 `fs.readFileSync`，会阻塞主线程；
- 异步 (Async/Callback)：`fs.promises.readFile`，`fs.readFile`，不会阻塞主线程。

### 文件操作

#### 文件读取

`fs.readFileSync` 基础用法如下：

- 参数 1：设置要读取的文件路径 (相对或者绝对)；
- 参数 2：设置读取的编码格式。

```js
const buf = fs.readFileSync("./test.txt");

// 打印Buffer大小
console.log(buf.length);
// 修改前2个字符
buf.write("gg");

// 输出修改后的内容
console.log(buf.toString());
```

#### 文件写入

基础用法如下 `fs.writeFileSync`：

- 参数 1：输出文件路径；

- 参数 2：输出内容；

- 参数 3 (可选)：编码格式。

写入二进制文件 (读取一个图片，然后输出到一个新的位置)。

```js
// 读取一个图片
const imgBuf = fs.readFileSync("./logo.png");
console.log("isBuffer", Buffer.isBuffer(imgBuf), "bufferSize", imgBuf.length);

// 写入到新文件
fs.writeFileSync("newLogo.png", imgBuf, "binary");
```

#### 获取文件信息

通过 `fs.statSync` 获取文件或者目录的基本信息。通过 `isFile() 和 isDirectory()` 判断是否文件/目录

```js
const fileInfo = fs.statSync("./test.txt");
// 判断是文件还是目录
console.log(fileInfo.isFile(), fileInfo.isDirectory());

const dirInfo = fs.statSync("./test-dir");
// 判断是文件还是目录
console.log(dirInfo.isFile(), dirInfo.isDirectory());

try {
  // 查询一个不存在的文件/目录信息（会抛出异常，需要自行捕获）
  fs.statSync("not_exist.txt");
} catch (e) {
  console.log("文件不存在");
}
```

#### 移动/重命名文件

`fs.renameSync` 方法用于文件移动，当然也可以是重命名文件

```js
fs.renameSync("test.txt", "test2.txt"); // 重命名

fs.renameSync("test2.txt", "test-dir/test2.txt"); // 移动
```

#### 删除文件

`fs.unlinkSync` 和 `fs.rmSync` 都可用于单文件删除.

```js
fs.unlinkSync("test-dir/test2.txt");
// fs.rmSync('test-dir/test2.txt')
```

`fs.rmSync`支持**删除目录**, **递归删除子文件**/目录等

```js
// 删除 test-dir 目录（包含其子文件）
fs.rmSync("test-dir", { recursive: true });
```

### 目录操作

#### 读取目录所有文件

通过 `fs.readdirSync` 获取目录下的文件信息。

默认情况下只会返回名称，指定第二个参数 `withFileTypes:true` 使返回结果包含类型。

```js
const files2 = fs.readdirSync("test-dir", { withFileTypes: true });
console.log(
  files2.map((f) => ({ name: f.name, isDirectory: f.isDirectory() }))
);
```

#### 创建目录

使用 `fs.mkdirSync` 创建目录，可通过设置 `recursive:true` 来递归创建多级目录

```js
fs.mkdirSync("test-dir/a/b/c/d", { recursive: true });
```

#### 删除目录

可以使用 `fs.rmdirSync` 删除目标目录，`recursive: true` 表明删除包含其子目录。

#### 监听目录变更

利用 `fs.watch` 即可实现

```js
import fs from "fs";
// 监听当前目录下所有的文件和子目录中的文件
fs.watch("./", { recursive: true }, (eventType, filename) => {
  console.log(`File '${filename}' has changed: ${eventType}`);
});
```

### 获取指定目录下所有文件路径

```js
import fs from 'fs'
import path from 'path'

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath, { withFileTypes: true })

  arrayOfFiles = arrayOfFiles || []

  files.forEach((file) => {
    if (file.isDirectory()) {
      arrayOfFiles = getAllFiles(path.resolve(dirPath, file.name), arrayOfFiles)
    } else {
      arrayOfFiles.push(path.resolve(dirPath, file.name))
    }
  })

  return arrayOfFiles
}

// 获取当前目录下所有文件
console.log(getAllFiles('./')
```

## util 工具模块

### 对象转字符串

`util.inspect(object, [options])`，`depth` 用于控制展开的层级

或者使用库 [javascript-stringify](https://www.npmjs.com/package/javascript-stringify)

```js
console.log(util.inspect(testObj, { depth: Math.Infinity }));
```

### 格式化字符串

`util.format`支持占位符 (%s、%d、%j 等) 来表示不同类型的变量，支持传入多个参数

```js
import util from "util";

console.log(util.format("%s:%s", "foo", "bar")); // 'foo:bar'
console.log(util.format("%d + %d = %d", 1, 2, 3)); // '1 + 2 = 3'

console.log(
  util.format("My name is %j", { firstName: "John", lastName: "Doe" })
);
// 'My name is {"firstName":"John","lastName":"Doe"}'
```

### promise 转回调

`util.callbackify` 可以将一个返回 `promise` 的函数转为回调形式的函数。

### 回调转 promise

`util.promisify(original)` 用于将常规带有回调函数的方法转为返回 Promise 对象的方法。

```js
// 引入 Node.js 内置模块 util 和 fs
import util from "util";
import fs from "fs";
// 将 fs.readFile 方法转换为返回 Promise 的函数
const fsRead = util.promisify(fs.readFile);
// 使用 Promise 的方式读取文件内容并输出
fsRead("./package.json").then((data) => {
  console.log(data.toString());
});
```

## HTTP 模块

- request：`url` (请求路径)、`method` (请求方法)、`headers` (请求头部)、`body` (请求体)、`query` (url 携带查询参数)；
- response：`statusCode` (响应状态码)、`setHeader` (设置响应头)、`write/end` (设置响应内容)。

### 发起请求

#### 发起 get 请求

`http.get` 或者 `https.get`

```js
// 由于请求的目标资源是 https 协议，所以这里使用 https 模块
https.get(
  "https://api.juejin.cn/content_api/v1/content/article_rank?category_id=1&type=hot&count=3&from=1&aid=2608&uuid=7145810834685003271&spider=0",
  (res) => {
    // 响应内容拼接
    let content = "";
    res.on("data", (chunk) => {
      content += chunk;
    });

    // 读完对外暴露内容和状态码
    res.on("end", () => {
      console.log(content);
    });

    res.on("error", (err) => {
      console.log(err);
    });
  }
);
```

#### 发起任意请求

http.request

```js
import https from "https";

const url = new URL(
  "https://api.juejin.cn/content_api/v1/content/article_rank?category_id=1&type=hot&count=3&from=1&aid=2608&uuid=7145810834685003271&spider=0"
);
console.log(url);
const req = https.request(
  {
    // 设置请求方法
    method: "GET",
    // http 80 https 443
    port: 443,
    hostname: url.hostname,
    path: url.pathname + url.search,
  },
  (res) => {
    let content = "";
    res.on("data", (chunk) => {
      content += chunk;
    });
    res.on("end", () => {
      console.log("statusCode", res.statusCode);
      console.log(content);
    });
  }
);
// 发送请求
req.end();
```

### 创建 HTTP Service

利用 `http.createServer` 即可创建一个简单的 Web 服务。

```js
import http from "http";

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end("<h1>Hello, World!</h1>");
});
server.listen(4275, () => {
  console.log("Server running at http://127.0.0.1:4275/");
});
```

### 请求

req.url -- 请求路径

req.method -- 请求方法

req.headers -- headers 参数

req.query -- 获取 query 参数，以直接使用 `URL` 模块的 `searchParams` 直接提取。

```js
const { url, method } = req;
const query = Object.fromEntries(new URL(url, "http://localhost").searchParams);
```

res.body

`POST` 请求通常会通过 `body` 传递数据。

```js
fetch("http://127.0.0.1:4275?hello=world", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "xm",
    age: 18,
  }),
});
```

通过监听 `data` 和 `end` 事件获取

```js
let body = [];
req
  .on("data", (chunk) => {
    body.push(chunk);
  })
  .on("end", () => {
    body = Buffer.concat(body).toString();
    body = JSON.parse(body);
    console.log("body", body);
  });
```

### 响应

通过 `res.statusCode` 设置响应的状态码。

通过 `res.setHeader` 设置要向客户端返回额头信息。

```js
res.statusCode = 404;

res.setHeader("Content-Type", "text/html");
```

可以通过 `res.write` 和 `res.end` 设置，终止并返回内容。

## child_process 子进程

- `spawn` 启动一个子进程来执行指定的命令，并且可以通过流式数据通信与子进程进行交互；
- `exec` 启动一个 shell，并在 shell 中执行指定命令，执行完毕后插入 `stdout/stderr` 中，适用于一些命令行工具；
- `execFile` 与 `exec` 类似，但是可以直接执行某个文件，而无需通过 shell 执行；
- `fork` 专门用于在 Node.js 中衍生新的进程来执行 JavaScript 文件，并且建立一个与子进程的 IPC 通信管道。

### spawn 方法

支持 `同步(spawnSync)` 和 `异步(spawn)` 2 种调用方式。

比如我们经常用 `pwd` 获取当前目录的路径，`ls` 获取当前目录下的文件，下面是通过 `spawnSync` 调用示例。

```js
import ChildProcess from "child_process";

const { spawn, spawnSync } = ChildProcess;

const pwd = spawnSync("pwd");
console.log(pwd.stdout.toString());
const ls = spawnSync("ls", ["-lh"]);
console.log(ls.stdout.toString());
```

### exec 方法

```js
import { exec, execSync } from "child_process";

const pwd = execSync("pwd");
console.log(pwd.toString());
const ls = execSync("ls -lh");
console.log(ls.toString());

const file = "./../fs/index.mjs";
const execProcess = exec(`git log -1 --pretty="%ci" ${file}`);
execProcess.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
  console.log(new Date(data));
});
```

### execFile 方法

执行某个可执行文件，支持同步和异步两种方式，

### fork 方法

```js
import { fork } from "child_process";

const child = fork("child.mjs"); // 使用 fork() 方法创建子进程

child.on("message", (msg) => {
  // 监听来自子进程的消息
  console.log(`Message from child: ${msg}`);
});

child.send("Hello from parent!"); // 向子进程发送消息
```

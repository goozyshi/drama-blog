---
date: 2020-06-19
category: Frontend
tags:
  - Network
  - fetch
spot: 福海苑
location: 深圳，北头社区
outline: deep
---

# axios 请求封装及异步回调处理

## axios 请求封装

基础 axios 请求，以 post 请求为例：

请求的 url 一般是 baseURL + api

因此可以将 api 单独成一个 js 文件再导入，axios 请求则另行封装。

本次共两个文件**url.js** （保留 api），**http.js**（封装 axios）

```javascript
axios
  .post("https://jsonplaceholder.typicode.com" + "/posts", { todo: 12 })
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
```

### url.js

将所需 api 以对象形式导出。

```javascript
export default {
  getPosts: "/posts",
  postTodos: "/todos",
};
```

### http.js

- 基础

以 [jsonplaceholder（https://jsonplaceholder.typicode.com）](https://jsonplaceholder.typicode.com/)接口示例

```javascript
// 第三方中间件引入、部分所需组件
import url from "./url";
import axios from "axios";
import { Message } from "element-ui"; // element消息组件，用于请求|返回时接口提示

// 初始化
// axios实例、基准地址、超时限制、请求头（一般post）
const instance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com" || process.env.baseURL,
  timeout: 15 * 1000,
});
instance.defaults.headers.post["Content-Type"] =
  "application/json;charset=UTF-8";

// 封装 GET | POST 方法
const _http = {
  get: (url, query) => instance.get(url, { params: query }),
  post: (url, params) => instance.post(url, params),
};

// 接口导出
export const getPosts = (params) => _http.get(url.getPosts, params);
export const postTodos = (params) => _http.post(url.postTodos, params);
```

- 请求拦截、返回拦截【诸如 token 校验】

在一些情况下，前端需要在请求头携带 token 再与后端通信，从而实现鉴权。

这里会用到 axios 的拦截器`【interceptors】`。

以下模仿请求需携带 token 以及再返回时校验 token 是否过期的场景。

`request`: 主要处理 config 对象

`response`: 主要处理 response 和 error 两个对象

不需要特殊处理时直接返回该对象即可。

```javascript
// 请求拦截
instance.interceptors.request.use((config) => {
  // 用 sessionStorage 存取 token 值
  // vuex 中 state 的值会在页面刷新后重置，不好用
  const token = sessionStorage.getItem("token") || "";
  if (!token) {
    // 没有token，请求获取后携带于请求头header['token]中
    return new Promise((resolve, reject) => {
      const AUTH_URL = "https://www.baidu.com";
      const sign = "db59af7ce14048acba1c9ea6e9ac1601"; // 签名, 一般是 md5 转化后的哈希值
      axios.post(AUTH_URL, { sign }).then((res) => {
        if (res.errorCode) {
          sessionStorage.setItem("token", res.data); // 存入token
          config.headers.token = res.data;
          resolve(config);
        } else {
          Message.warning("网络错误，请重试");
          reject(new Error("获取token失败：" + res.errorMsg));
        }
      });
    });
  } else {
    config.headers.token = token;
    return config;
  }
  return config;
});

// 返回拦截： token过期校验等
instance.interceptors.response.use(
  (response) => {
    const { errorCode, errorMsg } = response.data;
    // 假设 -1 的errorCode为token过期标识（与后端协商）
    if (errorCode === "-1") {
      Message.warning("token已过期，请刷新重试");
      sessionStorage.removeItem("token");
      throw new Error(`token过期：${errorMsg}`);
    }
    return response;
  },
  (error) => {
    Message.error("网络错误，请稍后再试");
    return Promise.reject(error);
  }
);
```

### tips【多域名封装】

一般为了方便，我们会将统一的域名封装在 axios 的初始实例 instance 当中

```javascript
// process.env.baseURL 会随环境不同改变，需要自己在项目配置变量
// 一般有 dev | test | uat | prod 四个环境
const instance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com" || process.env.baseURL,
});
```

而在实际项目中，曾遇到需要用到不同基准域名的时候，

例如搜索时，谷歌搜索([http://google.com/search?q=xxx](http://google.com/search?q=xxx)) | 百度搜索（[http://www.baidu.com/search?q=xxx](http://www.baidu.com/search?q=xxx)）

显然 api 是相同的，但域名不同([http://google.com](http://google.com) 和 [http://www.baidu.com](http://www.baidu.com))

之前都会想着新开一个 http 封装处理 | 单独的引入 axios 进行请求

**后面发现，如果引入的 url 是包含协议部分（eg. http | https）**

**url 是可以直接覆盖 axios 实例中设置的 baseURL 的**

```javascript
const instance = axios.create({
  baseURL: "http://www.baidu.com",
});
const noProtocol = "www.google.com";
const googleURL = "http://google.com";

export const baiduSearch = (params) => _http.get("/search", params);
export const googleSearch = (params) =>
  _http.get(googleURL + "/search", params);
export const badSearch = (params) => _http.get(noProtocol + "/search", params);
```

以上三者请求后的实际 url

- baiduSearch: [http://www.baidu.com/search](http://www.baidu.com/search)
- googleSearch: [http://www.google.com/search](http://www.google.com/search)
- badSearch: [http://www.baidu.com/www.google.com/search](http://www.baidu.com/www.google.com/search)

## async/await 异步处理回调

借鉴第三方[await-to-js](https://github.com/scopsy/await-to-js)处理思路

写一个装饰器函数，这里写在**main.js**上了，之后可以`this.$defer`直接全局调用

也可以写在公共函数文件里，需要的时候导入引用即可

```javascript
// $defer 函数接受一个 Promise 对象作为参数，并总是 resolve
// 以 [data | undefined, undefined | error] 的形式返回结果
// 如果成功，函数返回 [data, undefined]
// 如果失败，函数返回 [undefined, Error]
Vue.prototype.$defer = (promise) => {
  return promise
    .then((data) => [data, undefined])
    .catch((error) => Promise.resolve([undefined, error]));
};
```

调用

```javascript
// 调用之前封装的接口
import { getPosts, postTodos } from '@/config/http'

async request () {
    const [postRes, postErr] = await this.$defer(getPosts())
    console.log(postRes, postErr)
    if (postErr) throw new Error('获取post失败')
    postTodos({ todo: 1 }).then(res => {
        console.log(res)
    })
}
```

如此就可以避免 `Unhandled promise rejection` 报错，还能细粒度的处理错误

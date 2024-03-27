---
date: 2023-06-23
category: Frontend
tags:
  - webpack
  - notes
spot: 家里
location: 汕尾, 上英镇
outline: deep
---

# 《深入浅出 webpack》 笔记

## 1. 常见构建工具对比

### Webpack

Webpack 是一个打包模块化 JavaScript 的工具，在 Webpack 里一切文件皆模块，通过 Loader 转换文件，通过 Plugin 注入钩子，最后输出由多个模块组合成的文件。Webpack 专注于构建模块化项目.

Webpack 具有很大的灵活性，能配置如何处理文件，大致使用如下

```javascript
module.exports = {
  // 所有模块的入口，Webpack 从入口开始递归解析出所有依赖的模块
  entry: "./app.js",
  output: {
    // 把入口所依赖的所有模块打包成一个文件 bundle.js 输出
    filename: "bundle.js",
  },
};
```

Webpack 的优点是：

- 专注于处理模块化的项目，能做到开箱即用一步到位；
- 通过 Plugin 扩展，完整好用又不失灵活；
- 使用场景不仅限于 Web 开发；
- 社区庞大活跃，经常引入紧跟时代发展的新特性，能为大多数场景找到已有的开源扩展；
- 良好的开发体验。
- Webpack 的缺点是只能用于采用模块化开发的项目

### RollUp

RollUp 是一个和 Webpack 很类似但专注于 ES6 的模块打包工具。
Rollup 的亮点在于能针对 ES6 源码进行 Tree Shaking 以去除那些已被定义但没被使用的代码，以及 Scope Hoisting 以减小输出文件大小提升运行性能。

- Rollup 是在 Webpack 流行后出现的替代品；
- Rollup 生态链还不完善，体验不如 Webpack；
- Rollup 功能不如 Webpack 完善，但其配置和使用更加简单；
- Rollup 不支持 Code Spliting，但好处是打包出来的代码中没有 Webpack 那段模块的加载、执行和缓存的代码。

## Webpack 配置

### Entry

`entry`是配置模块的入口，可抽象成输入，Webpack 执行构建的第一步将从入口开始搜寻及递归解析出所有入口依赖的模块。

`entry` 配置是**必填的**，若不填则将导致 Webpack 报错退出。

> Webpack 在寻找相对路径的文件时会以 `context` 为根目录，`context` 默认为执行启动 Webpack 时所在的当前工作目录。

```javascript
module.exports = {
  context: path.resolve(__dirname, "app"),
};
```

Entry 的类型：

| 类型      | 例子                                                             | 含义                                              |
| --------- | ---------------------------------------------------------------- | ------------------------------------------------- |
| string    | `'./app/entry'`                                                  | 入口模块的文件路径，可以是相对路径。main.js       |
| array     | `['./app/entry1', './app/entry2']`                               | 入口模块的文件路径，可以是相对路径。main.js       |
| object    | `{ a: './app/entry-a', b: ['./app/entry-b1', './app/entry-b2']}` | 配置多个入口，每个入口生成一个 Chunk，名为 `键名` |
| .chunk.js |                                                                  |                                                   |

动态配置 Entry

把 Entry 设置成一个函数去动态返回上面所说的配置

```javascript
// 异步函数
entry: () => {
  return new Promise((resolve) => {
    resolve({
      a: "./pages/a",
      b: "./pages/b",
    });
  });
};
```

### Output

#### filename

`output.filename` 配置输出文件的名称，为 string 类型。

如果只有一个输出文件，则可以把它写成静态不变的：

```javascript
filename: "bundle.js";
```

在有多个 Chunk 要输出时，就需要借助模版和变量了

```javascript
filename: "[name].js";
```

文件指纹：

| 变量名      | 含义                        |
| ----------- | --------------------------- |
| id          | Chunk 的唯一标识，从 0 开始 |
| name        | Chunk 的名称                |
| hash        | Chunk 的唯一标识的 Hash 值  |
| contenthash | Chunk 内容的 Hash 值        |
| Chunk hash  | Chunk 构建 Hash 值          |

#### path

`output.path` 配置输出文件存放在本地的目录，必须是 string 类型的绝对路径。通常通过 Node.js 的 `path` 模块去获取绝对路径：

```javascript
path: path.resolve(__dirname, "dist_[hash]");
```

#### publicPath

`output.publicPath` 配置发布到线上资源的 URL 前缀，为 string 类型。 默认值是空字符串 `''`，即使用相对路径。

```javascript
filename: "[name]_[chunkhash:8].js";
publicPath: "https://cdn.example.com/assets/";
```

这时发布到线上的 HTML 在引入 JavaScript 文件时就需要:

```html
<script src="https://cdn.example.com/assets/a_12345678.js"></script>
```

### Module

#### 配置 Loader

`rules` 配置模块的读取和解析规则

#### noParse

`noParse` 配置项可以让 Webpack 忽略对部分没采用模块化的文件的递归解析和处理，这样做的好处是能提高构建性能。 原因是一些库例如 jQuery 、ChartJS 它们庞大又没有采用模块化标准，让 Webpack 去解析这些文件耗时又没有意义。

例如想要忽略掉 jQuery 、ChartJS，

```javascript
// 使用正则表达式
noParse: /jquery|chartjs/;

// 使用函数，从 Webpack 3.0.0 开始支持
noParse: (content) => {
  // content 代表一个模块的文件路径
  // 返回 true or false
  return /jquery|chartjs/.test(content);
};
```

### Resolve

Resolve 配置 Webpack 如何寻找模块所对应的文件。

#### alias

`resolve.alias` 配置项通过别名来把原导入路径映射成一个新的导入路径。例如使用以下配置：

```javascript
// Webpack alias 配置
resolve: {
  alias: {
    components: "./src/components/";
  }
}
```

这样做可能会命中太多的导入语句，alias 还支持 `$` 符号来缩小范围到只命中以关键字结尾的导入语句：

```javascript
resolve:{
  alias:{
    'react$': '/path/to/react.min.js'
  }
}
```

`react$` 只会命中以 `react` 结尾的导入语句，即只会把 `import 'react'` 关键字替换成 `import '/path/to/react.min.js'`。

#### mainFields

Webpack 会根据 `mainFields` 的配置去决定优先采用那份代码，`mainFields` 默认如下：

有一些第三方模块会针对不同环境提供几分代码。例如分别提供采用 ES5 和 ES6 的 2 份代码，这 2 份代码的位置写在 `package.json` 文件里，如下：

```json
{
  "jsnext:main": "es/index.js", // 采用 ES6 语法的代码入口文件
  "main": "lib/index.js" // 采用 ES5 语法的代码入口文件
}
```

假如你想优先采用 ES6 的那份代码，可以这样配置

```javascript
mainFields: ["jsnext:main", "browser", "main"];
```

#### extensions

`resolve.extensions` 用于配置在尝试过程中用到的后缀列表。

假如你想让 Webpack 优先使用目录下的 TypeScript 文件，可以这样配置：

```javascript
extensions: [".ts", ".js", ".json"];
```

#### modules

`resolve.modules` 配置 Webpack 去哪些目录下寻找第三方模块，默认是只会去 `node_modules` 目录下寻找。

就像这样 `import '../../../components/button'` 这时你可以利用 `modules` 配置项优化，假如那些被大量导入的模块都在 `./src/components` 目录下，把 `modules` 配置成

```javascript
modules: ["./src/components", "node_modules"];
```

后，你可以简单通过 `import 'button'` 导入。

### Plugin

Plugin 用于扩展 Webpack 功能，各种各样的 Plugin 几乎让 Webpack 可以做任何构建相关的事情。

使用 Plugin 的难点在于掌握 Plugin 本身提供的配置项，而不是如何在 Webpack 中接入 Plugin

```javascript
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

module.exports = {
  plugins: [
    // 所有页面都会用到的公共代码提取到 common 代码块中
    new CommonsChunkPlugin({
      name: "common",
      chunks: ["a", "b"],
    }),
  ],
};
```

### devServer

- `devServer.hot` 配置是否启用模块热替换功能。
- `devServer.inline` 用于配置是否自动注入这个代理客户端到将运行在页面里的 Chunk 里去，默认是会自动注入。
  - 开启 `inline`，DevServer 会在构建完变化后的代码时通过代理客户端控制网页刷新。
  - 关闭 `inline`，DevServer 将无法直接控制要开发的网页。这时它会通过 `iframe`的方式去运行要开发的网页，当构建完变化后的代码时通过刷新 iframe 来实现实时预览。 但这时你需要去 `http://localhost:8080/webpack-dev-server/` 实时预览你的网页了。
- `devServer.port` 配置项用于配置 DevServer 服务监听的端口，默认使用 8080 端口。 如果 8080 端口已经被其它程序占有就使用 8081，如果 8081 还是被占用就使用 8082，以此类推。

### 完整配置

```javascript
const path = require("path");

module.exports = {
  // entry 表示 入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
  // 类型可以是 string | object | array
  entry: "./app/entry", // 只有1个入口，入口只有1个文件
  entry: ["./app/entry1", "./app/entry2"], // 只有1个入口，入口有2个文件
  entry: {
    // 有2个入口
    a: "./app/entry-a",
    b: ["./app/entry-b1", "./app/entry-b2"],
  },

  // 如何输出结果：在 Webpack 经过一系列处理后，如何输出最终想要的代码。
  output: {
    // 输出文件存放的目录，必须是 string 类型的绝对路径。
    path: path.resolve(__dirname, "dist"),

    // 输出文件的名称
    filename: "bundle.js", // 完整的名称
    filename: "[name].js", // 当配置了多个 entry 时，通过名称模版为不同的 entry 生成不同的文件名称
    filename: "[chunkhash].js", // 根据文件内容 hash 值生成文件名称，用于浏览器长时间缓存文件

    // 发布到线上的所有资源的 URL 前缀，string 类型
    publicPath: "/assets/", // 放到指定目录下
    publicPath: "", // 放到根目录下
    publicPath: "https://cdn.example.com/", // 放到 CDN 上去

    // 导出库的名称，string 类型
    // 不填它时，默认输出格式是匿名的立即执行函数
    library: "MyLibrary",

    // 导出库的类型，枚举类型，默认是 var
    // 可以是 umd | umd2 | commonjs2 | commonjs | amd | this | var | assign | window | global | jsonp ，
    libraryTarget: "umd",

    // 是否包含有用的文件路径信息到生成的代码里去，boolean 类型
    pathinfo: true,

    // 附加 Chunk 的文件名称
    chunkFilename: "[id].js",
    chunkFilename: "[chunkhash].js",

    // JSONP 异步加载资源时的回调函数名称，需要和服务端搭配使用
    jsonpFunction: "myWebpackJsonp",

    // 生成的 Source Map 文件名称
    sourceMapFilename: "[file].map",

    // 浏览器开发者工具里显示的源码模块名称
    devtoolModuleFilenameTemplate: "webpack:///[resource-path]",

    // 异步加载跨域的资源时使用的方式
    crossOriginLoading: "use-credentials",
    crossOriginLoading: "anonymous",
    crossOriginLoading: false,
  },

  // 配置模块相关
  module: {
    rules: [
      // 配置 Loader
      {
        test: /\.jsx?$/, // 正则匹配命中要使用 Loader 的文件
        include: [
          // 只会命中这里面的文件
          path.resolve(__dirname, "app"),
        ],
        exclude: [
          // 忽略这里面的文件
          path.resolve(__dirname, "app/demo-files"),
        ],
        use: [
          // 使用那些 Loader，有先后次序，从后往前执行
          "style-loader", // 直接使用 Loader 的名称
          {
            loader: "css-loader",
            options: {
              // 给 html-loader 传一些参数
            },
          },
        ],
      },
    ],
    noParse: [
      // 不用解析和处理的模块
      /special-library\.js$/, // 用正则匹配
    ],
  },

  // 配置插件
  plugins: [],

  // 配置寻找模块的规则
  resolve: {
    modules: [
      // 寻找模块的根目录，array 类型，默认以 node_modules 为根目录
      "node_modules",
      path.resolve(__dirname, "app"),
    ],
    extensions: [".js", ".json", ".jsx", ".css"], // 模块的后缀名
    alias: {
      // 模块别名配置，用于映射模块
      // 把 'module' 映射 'new-module'，同样的 'module/path/file' 也会被映射成 'new-module/path/file'
      module: "new-module",
      // 使用结尾符号 $ 后，把 'only-module' 映射成 'new-module'，
      // 但是不像上面的，'module/path/file' 不会被映射成 'new-module/path/file'
      "only-module$": "new-module",
    },
    alias: [
      // alias 还支持使用数组来更详细的配置
      {
        name: "module", // 老的模块
        alias: "new-module", // 新的模块
        // 是否是只映射模块，如果是 true 只有 'module' 会被映射，如果是 false 'module/inner/path' 也会被映射
        onlyModule: true,
      },
    ],
    symlinks: true, // 是否跟随文件软链接去搜寻模块的路径
    descriptionFiles: ["package.json"], // 模块的描述文件
    mainFields: ["main"], // 模块的描述文件里的描述入口的文件的字段名称
    enforceExtension: false, // 是否强制导入语句必须要写明文件后缀
  },

  // 输出文件性能检查配置
  performance: {
    hints: "warning", // 有性能问题时输出警告
    hints: "error", // 有性能问题时输出错误
    hints: false, // 关闭性能检查
    maxAssetSize: 200000, // 最大文件大小 (单位 bytes)
    maxEntrypointSize: 400000, // 最大入口文件大小 (单位 bytes)
    assetFilter: function (assetFilename) {
      // 过滤要检查的文件
      return assetFilename.endsWith(".css") || assetFilename.endsWith(".js");
    },
  },

  devtool: "source-map", // 配置 source-map 类型

  context: __dirname, // Webpack 使用的根目录，string 类型必须是绝对路径

  // 配置输出代码的运行环境
  target: "web", // 浏览器，默认
  target: "webworker", // WebWorker
  target: "node", // Node.js，使用 `require` 语句加载 Chunk 代码
  target: "async-node", // Node.js，异步加载 Chunk 代码
  target: "node-webkit", // nw.js
  target: "electron-main", // electron, 主线程
  target: "electron-renderer", // electron, 渲染线程

  externals: {
    // 使用来自 JavaScript 运行环境提供的全局变量
    jquery: "jQuery",
  },

  stats: {
    // 控制台输出日志控制
    assets: true,
    colors: true,
    errors: true,
    errorDetails: true,
    hash: true,
  },

  devServer: {
    // DevServer 相关的配置
    proxy: {
      // 代理到后端服务接口
      "/api": "http://localhost:3000",
    },
    contentBase: path.join(__dirname, "public"), // 配置 DevServer HTTP 服务器的文件根目录
    compress: true, // 是否开启 gzip 压缩
    historyApiFallback: true, // 是否开发 HTML5 History API 网页
    hot: true, // 是否开启模块热替换功能
    https: false, // 是否开启 HTTPS 模式
  },

  profile: true, // 是否捕捉 Webpack 构建的性能信息，用于分析什么原因导致构建性能不佳

  cache: false, // 是否启用缓存提升构建速度

  watch: true, // 是否开始
  watchOptions: {
    // 监听模式选项
    // 不监听的文件或文件夹，支持正则匹配。默认为空
    ignored: /node_modules/,
    // 监听到变化发生后会等300ms再去执行动作，防止文件更新太快导致重新编译频率太高
    // 默认为300ms
    aggregateTimeout: 300,
    // 判断文件是否发生变化是不停的去询问系统指定文件有没有变化，默认每隔1000毫秒询问一次
    poll: 1000,
  },
};
```

### 多种配置类型

#### 导出一个返回 Promise 的函数

```javascript
module.exports = function (env = {}, argv) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        // ...
      });
    }, 5000);
  });
};
```

## Webpack 实战

### 语言

#### ES6

> 通常我们需要把采用 ES6 编写的代码转换成目前已经支持良好的 ES5 代码，这包含 2 件事：
>
> 1. 把新的 ES6 语法用 ES5 实现，例如 ES6 的 `class` 语法用 ES5 的 `prototype` 实现。
> 2. 给新的 API 注入 polyfill ，例如项目使用 `fetch` API 时，只有注入对应的 polyfill 后，才能在低版本浏览器中正常运行。

使用 Babel 可以方便的完成以上 2 件事。

在 Babel 执行编译的过程中，会从项目根目录下的 `.babelrc` 文件读取配置。

```json
{
  "plugins": [
    [
      "transform-runtime",
      {
        "polyfill": false
      }
    ]
  ],
  "presets": [
    [
      "es2015",
      {
        "modules": false
      }
    ],
    "stage-2",
    "react"
  ]
}
```

`plugins` 属性告诉 Babel 要使用哪些插件，插件可以控制如何转换代码

例如在转换 `class extent` 语法时会在转换后的 ES5 代码里注入 `_extent` 辅助函数用于实现继承：

```javascript
function _extent(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
}
```

`presets` 属性告诉 Babel 要转换的源码使用了哪些新的语法特性，一个 Presets 对一组新语法特性提供支持，多个 Presets 可以叠加。

1. 已经被写入 ECMAScript 标准里的特性 ：`env (包括 es2015 + es2016 + es2017)`
2. 被社区提出来的但还未被写入 ECMAScript 标准里特性：`stage0(stage1(stage2(stage3)))`
3. 为了支持一些特定应用场景下的语法，和 ECMAScript 标准没有关系:`babel-preset-react` 是为了支持 React 开发中的 JSX 语法。

接入 Babel

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
      },
    ],
  },
  // 输出 source-map 方便直接调试 ES6 源码
  devtool: "source-map",
};
```

#### TypeScript

使用 ts-loader

#### SCSS

1. 通过 sass-loader 把 SCSS 源码转换为 CSS 代码，再把 CSS 代码交给 css-loader 去处理。
2. css-loader 会找出 CSS 代码中的 `@import` 和 `url()` 这样的导入语句，告诉 Webpack 依赖这些资源。同时还支持 CSS Modules、压缩 CSS 等功能。处理完后再把结果交给 style-loader 去处理。
3. style-loader 会把 CSS 代码转换成字符串后，注入到 JavaScript 代码中去，通过 JavaScript 去给 DOM 增加样式。如果你想把 CSS 代码提取到一个单独的文件而不是和 JavaScript 混在一起，可以使用[1-5 使用 Plugin](http://webpack.wuhaolin.cn/1%E5%85%A5%E9%97%A8/1-5%E4%BD%BF%E7%94%A8Plugin.html) 中介绍过的 ExtractTextPlugin

```javascript
module.exports = {
  module: {
    rules: [
      {
        // 增加对 SCSS 文件的支持
        test: /\.scss$/,
        // SCSS 文件的处理顺序为先 sass-loader 再 css-loader 再 style-loader
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};
```

#### PostCss

接入 PostCSS 相关的 Webpack 配置如

```javascript
module.exports = {
  module: {
    rules: [
      {
        // 使用 PostCSS 处理 CSS 文件
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
};
```

### 框架

#### React

使用了 React 项目的代码特征有 JSX 和 Class 语法，例如：

```jsx
class Button extends Component {
  render() {
    return <h1>Hello,Webpack</h1>;
  }
}
```

通过以下命令：

```bash
# 安装 React 基础依赖
npm i -D react react-dom
# 安装 babel 完成语法转换所需依赖
npm i -D babel-preset-react
```

安装新的依赖后，再修改 `.babelrc` 配置文件加入 React Presets

```json
"presets": [
    "react"
],
```

#### Vue

```javascript
use: ['vue-loader'],
```

使用 TS 编写的 Vue：

新增 `tsconfig.json` 配置文件，内容如下：

```json
{
  "compilerOptions": {
    // 构建出 ES5 版本的 JavaScript，与 Vue 的浏览器支持保持一致
    "target": "es5",
    // 开启严格模式，这可以对 `this` 上的数据属性进行更严格的推断
    "strict": true,
    // TypeScript 编译器输出的 JavaScript 采用 es2015 模块化，使 Tree Shaking 生效
    "module": "es2015",
    "moduleResolution": "node"
  }
}
```

以上代码中的 `"module": "es2015"` 是为了 Tree Shaking 优化生效。

由于 TypeScript 不认识 `.vue` 结尾的文件，

Webpack 配置需要修改两个地方，如下：

```javascript
const path = require("path");

module.exports = {
  resolve: {
    // 增加对 TypeScript 的 .ts 和 .vue 文件的支持
    extensions: [".ts", ".js", ".vue", ".json"],
  },
  module: {
    rules: [
      // 加载 .ts 文件
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          // 让 tsc 把 vue 文件当成一个 TypeScript 模块去处理，以解决 moudle not found 的问题，tsc 本身不会处理 .vue 结尾的文件
          appendTsSuffixTo: [/\.vue$/],
        },
      },
    ],
  },
};
```

除此之外还需要安装新引入的依赖：

```bash
npm i -D ts-loader typescript
```

### svg

SVG 作为矢量图的一种标准格式，已经得到了各大浏览器的支持，它也成为了 Web 中矢量图的代名词。 在网页中采用 SVG 代替位图有如下好处：

1. SVG 相对于位图更清晰，在任意缩放的情况下后不会破坏图形的清晰度，SVG 能方便地解决高分辨率屏幕下图像显示不清楚的问题。
2. 在图形线条比较简单的情况下，SVG 文件的大小要小于位图，在扁平化 UI 流行的今天，多数情况下 SVG 会更小。
3. 图形相同的 SVG 比对应的高清图有更好的渲染性能。
4. SVG 采用和 HTML 一致的 XML 语法描述，灵活性很高

- file-loader
- raw-loader：可以把文本文件的内容读取出来，注入到 JavaScript 或 CSS 中去
- scg-inline-loader

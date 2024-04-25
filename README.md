# Drama Blog

VitePress + Tailwind CSS 实现的 个人博客

### Initial

#### Vitepress

```sh
# https://vitepress.dev/guide/getting-started
$ pnpm add -D vitepress

$ pnpm vitepress init

# Theme 选择 Default Theme + Customization
```

#### Tailwind CSS

```sh
# https://tailwindcss.com/docs/guides/vite#vue
$ pnpm install -D tailwindcss postcss autoprefixer
$ npx tailwindcss init -p
```

Configure your template paths.

`.md` files and `.vue` files

```sh
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    ".vitepress/theme/components/*.vue",
    ".vitepress/theme/pages/*.vue",
    "./posts/**/*.md",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

```

add to `style.css`

```sh
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Customize

- dotenv/con

```sh
# https://github.com/motdotla/dotenv
$ pnpm i -S dotenv
```

Read Time

```sh
#
$ pnpm i -D reading-time
```

Enhanced Markdown

```sh
$ pnpm i -D markdown-it-footnote markdown-it-image-figures markdown-it-mathjax3
```

## 图片统一优化

```sh
sips -Z 1080 *.png
```

## 部署后刷新页面 404 的问题
由于启动了 cleanUrls: true, 这个会让 /posts/a.html 变成 /posts/a ,路径更加简洁，单服务端也需要做出适配。

- ✅ **Vercel**
新增 vercel.json 
```js
{
  "cleanUrls": true
}
```
- **Ngix 配置**
```js
 location /posts/ {
  try_files  $uri $uri.html
 }
```
即找不到路径就在路径后加html试试
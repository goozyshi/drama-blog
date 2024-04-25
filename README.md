# Drama Blog

## Description

## Getting Started

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
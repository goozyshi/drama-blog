---
date: 2025-05-03
category: Frontend
tags:
  - H5
  - CSS
  - Flexbox
spot: 云海路
location: 深圳南山，软件产业基地
outline: deep
---

# CSS Trick

## 目录

- [视觉盒模型选择](#视觉盒模型选择)
- [Flexbox 防御策略](#flexbox防御策略)
- [元素间距处理](#元素间距处理)
- [Sticky 定位失效修复](#sticky定位失效修复)
- [z-index 失效修复](#z-index失效修复)
- [滚动体验优化](#滚动体验优化)
- [滚动捕捉技术](#滚动捕捉技术)
- [CSS 渐变应用](#css渐变应用)

## 视觉盒模型选择

### 基本概念

- **盒模型(Box Model)**: 计算盒子大小(width/height/border/padding/margin)
- **视觉盒模型(Visual Formatting Model)**: 计算盒子位置，用于布局

### 实践要点

- 根据 UI 需求选择合适的 display 值
- 使用 display 双值语法明确内外显示类型

```css
/* 内联式按钮 */
.button--inline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 块级按钮 */
.button--block {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 使用CSS变量灵活控制 */
.button {
  display: var(--button-display, inline-flex);
  align-items: center;
  justify-content: center;
}

.button--block {
  --button-display: flex;
}
```

## Flexbox 防御策略

### 1. 防止内容溢出

```css
/* 具有防御性的Flexbox容器 */
.flex-container {
  display: flex;
  flex-wrap: wrap; /* 防止内容溢出 */
}
```

### 2. 处理最小内容尺寸问题

```css
/* 等宽布局修复 */
.flex-item {
  flex: 1 1 0%;
  min-width: 0; /* 解决最小内容尺寸问题 */
}

/* 或使用overflow */
.flex-item {
  flex: 1 1 0%;
  overflow: hidden;
}
```

### 3. 防止 UI 拉伸和挤压

```css
/* 防止所有项目被拉伸 */
.flex-container {
  display: flex;
  align-items: flex-start; /* 或center、baseline */
}

/* 防止特定项目被拉伸 */
.flex-item {
  align-self: flex-start;
}

/* 防止项目被挤压 */
.fixed-size-item {
  flex-shrink: 0;
}
```

### 4. 处理滚动失效

```css
/* 修复垂直滚动 */
.flex-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.scrollable-content {
  flex: 1 1 0%;
  min-height: 0; /* 关键修复 */
  overflow-y: auto;
}

/* 修复justify-content: end导致的水平滚动失效 */
.flex-container {
  display: flex;
  overflow-x: auto;
}

.flex-item:first-child {
  margin-inline-start: auto; /* 替代justify-content: end */
}
```

## 元素间距处理

### 间距类型选择原则

| 间距类型 | 适用场景                  |
| -------- | ------------------------- |
| padding  | 内容与容器边缘的间距      |
| margin   | 元素与元素之间的间距      |
| gap      | Flexbox/Grid 子项目等间距 |

### 防御性间距设置

```css
/* 处理动态内容的间距 */
.button + .button {
  margin-left: 1rem;
}

/* 处理列表项间距 */
.card:not(:last-child) {
  margin-bottom: 20px;
}

/* 处理空容器 */
.card:empty {
  padding: 0;
  border: none;
}

/* 滚动容器间距优化 */
.scroll--wrapper {
  padding: 18px;
}

.cards {
  display: flex;
  gap: 10px;
  overflow-x: auto;
}
```

## Sticky 定位失效修复

### 常见失效原因及修复

1. **祖先元素设置了 overflow 属性**

```css
/* 修复方法 */
.ancestor {
  overflow-x: clip; /* 代替overflow-x: hidden */
  /* 或 */
  overflow: visible;
}
```

2. **未指定阈值**

```css
/* 正确设置 */
.sticky-element {
  position: sticky;
  top: 0; /* 必须设置至少一个方向阈值 */
}
```

3. **粘附容器高度等于粘附项目高度**

```css
/* 在Flexbox中修复 */
.sticky-element {
  position: sticky;
  top: 0;
  align-self: flex-start; /* 防止flex拉伸 */
}
```

4. **z-index 问题**

```css
.sticky-element {
  position: sticky;
  top: 0;
  z-index: 10; /* 确保正确的层叠顺序 */
}
```

### 防御式 sticky 实现

```css
.sticky-top {
  position: sticky;
  top: 0;
  align-self: flex-start;
  z-index: 10;
}

/* 浏览器兼容性处理 */
@supports not (position: sticky) {
  .sticky-element {
    position: relative;
  }
}
```

## z-index 失效修复

### 创建层叠上下文的方法

- 设置`position`为非`static`值并指定`z-index`值
- 设置`opacity`值小于 1
- 使用`transform`、`filter`、`backdrop-filter`等属性
- 设置`isolation: isolate`
- 设置`will-change`

### 常见问题修复

1. **未创建层叠上下文**

```css
/* 推荐方法 */
.element {
  isolation: isolate; /* 专门用于创建层叠上下文 */
  z-index: 1;
}
```

2. **父元素层叠上下文限制**

```css
/* 调整父元素z-index */
.parent {
  z-index: 10;
}
```

3. **负值 z-index 失效**

```css
/* 调整HTML结构或避免在父元素上创建层叠上下文 */
.parent {
  /* 避免创建层叠上下文 */
}
```

### 防御式 z-index 使用原则

- 使用`isolation: isolate`显式创建层叠上下文
- 使用合理的数值(1-5)，避免过大值(999)
- 预先规划 UI 组件的层级关系

## 滚动体验优化

### 防止布局偏移

```css
.scroll-container {
  overflow: auto;
  scrollbar-gutter: stable; /* 预留滚动条空间 */
}
```

### 防止滚动穿透

```css
.modal-content {
  overflow-y: auto;
  overscroll-behavior-y: contain;
}

/* 禁用下拉刷新 */
body {
  overscroll-behavior: none;
}
```

### 平滑滚动

```css
html {
  scroll-behavior: smooth;
}

.back-to-top {
  position: sticky;
  top: calc(100vh - 5rem);
}
```

### 防御式滚动容器

```css
.scroll-container {
  /* 基本设置 */
  overflow: auto;

  /* 增强体验 */
  scrollbar-gutter: stable;
  overscroll-behavior: contain;
  scroll-behavior: smooth;

  /* 兼容性 */
  -webkit-overflow-scrolling: touch;
}
```

## 滚动捕捉技术

### 基础配置

```css
/* 滚动容器 */
.snap-container {
  overflow-x: auto;
  scroll-snap-type: x mandatory; /* x/y: 方向, mandatory/proximity: 严格程度 */
  scroll-padding: 1rem; /* 设置捕捉点偏移 */
}

/* 滚动项目 */
.snap-item {
  scroll-snap-align: start; /* start/center/end */
  scroll-snap-stop: always; /* 防止跳过捕捉点 */
  scroll-margin: 1rem; /* 设置项目偏移量 */
}
```

### 实用场景实现

1. **水平滚动列表**

```css
.channels {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding: 0.5rem;
}

.channel {
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
```

2. **全屏滚动页面**

```css
html {
  height: 100vh;
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
}

section {
  height: 100vh;
  scroll-snap-align: center;
}
```

3. **图片轮播**

```css
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
}

.carousel img {
  scroll-snap-align: center;
  width: 100%;
  flex-shrink: 0;
}
```

4. **列表左滑操作**

```css
.snap-container {
  overflow-y: hidden;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
}

.content {
  scroll-snap-align: start;
}

.actions {
  scroll-snap-align: end;
}
```

## CSS 渐变应用

### 基础语法

```css
/* 线性渐变 */
.linear {
  background-image: linear-gradient(to right, #ff8a00, #e52e71);
}

/* 径向渐变 */
.radial {
  background-image: radial-gradient(circle, #ff8a00, #e52e71);
}

/* 锥形渐变 */
.conic {
  background-image: conic-gradient(from 0deg, #ff8a00, #e52e71);
}
```

### 实用技巧

1. **渐变文本**

```css
.gradient-text {
  background-image: linear-gradient(to right, #09f1b8, #00a2ff, #ff00d2);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

2. **渐变边框**

```css
.gradient-border {
  border: 10px solid transparent;
  background-image: linear-gradient(white, white),
    /* 内容背景 */ linear-gradient(45deg, #ff0000, #0000ff); /* 边框渐变 */
  background-origin: border-box;
  background-clip: padding-box, border-box;
}
```

3. **纹理背景**

```css
/* 棋盘纹理 */
.chess-pattern {
  background: repeating-conic-gradient(#000 0% 25%, #eee 0% 50%) 50% / 60px 60px;
}
```

4. **图片蒙层**

```css
.masked-image {
  background: url(image.jpg) no-repeat center/cover;
  mask-image: linear-gradient(to bottom, black, transparent);
}
```

### 防御式渐变实践

```css
.gradient {
  /* 使用关键词指定方向 */
  background: linear-gradient(to right, red, blue);

  /* 防止色带现象 */
  background: linear-gradient(to right, #ff0000, #ff00aa, #aa00ff, #0000ff);

  /* 高效渐变动画 */
  background: linear-gradient(to right, red, blue);
  background-size: 200% 100%;
  animation: moveGradient 2s linear infinite;
}

@keyframes moveGradient {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 0%;
  }
}

/* 渐变回退机制 */
.with-fallback {
  background-color: #5a7eda; /* 基础颜色 */
  background-image: linear-gradient(135deg, #5a7eda, #a767e5); /* 兼容回退 */
  background-image: conic-gradient(
    from 135deg,
    #5a7eda,
    #a767e5,
    #5a7eda
  ); /* 现代浏览器 */
}
```

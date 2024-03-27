---
date: 2020-05-19
category: Frontend
tags:
  - CSS
  - Sass
  - Notes
spot: 留学生创业大厦
location: 深圳，科苑
outline: deep
---

# Sass 笔记

> [Sass-在线编译器](https://www.sassmeister.com/)

> [Sass-中文文档](https://www.sass.hk/docs/)

Sass 在 CSS 语法的基础上增加了`变量`、`嵌套`、`混合` 、`导入` 等高级功能。

Sass 和 Scss ？

- sass 以`.sass`为文件后缀，scss 是以`.scss`为后缀
- sass 以`严格的缩进语法书写`，不带大括号和分号
- scss 则与 css 语法非常类似

```css
// 早期的sass
$primary-color: #000
body
  color: $primary-color
```

```css
// 现版本scss
$primary-color: #000;
body {
  color: $primary-color;
}
```

## 基础

### 变量

- 声明变量：以美元符号`$`开头
- 内嵌在字符串内：写在`#{}`之中
- 局部变量转为全局变量： `!global`
- 在变量的结尾添加 `!default` 给一个未通过 `!default` 声明赋值的变量赋值

```css
$side: left;
$side: right !default;
$number: null;
$number: 2 !default;
div {
  $width: 5px !global;
  width: $width;
}
#mian {
  border-#{$side}-width: $width * $number; // border-left-width: 10px
}
```

### 数据类型

- 数字：`1`，`2`，`13px`
- 字符串：有引号字符串与无引号字符串，`"foo", 'bar', baz`
- 顔色：`blue, #04a3f9, rgba(255,0,0,0.5)`
- 布尔型：`true,false`
- 空值： `null`
- 数组：用空格或逗号作分隔符，`1.5em 1em 0 2em, Helvetica, Arial, sans-serif`
- maps： 相当于 JavaScript 的 object，`(key1: value1, key2: value2)`

### 运算

所有数据类型均支持相等运算 `==` 或 `!=`，此外，每种数据类型也有其各自支持的运算方式。

支持数字的加减乘除、取整等运算 (`+, -, *, /, %`)，如果必要会在不同单位间转换值

`除法运算`

- 如果值，或值的一部分，是变量或者函数的返回值
- 如果值被圆括号包裹
- 如果值是算数表达式的一部分

```css
p {
  font: 10px/8px; // Plain CSS, no division
  $width: 1000px;
  width: $width/2; // Uses a variable, does division
  width: round(1.5) / 2; // Uses a function, does division
  height: (500px/2); // Uses parentheses, does division
  margin-left: 5px + 8px/2px; // Uses +, does division
}
```

### 嵌套

- 选择器嵌套：内层的样式将它`外层的选择器作为父选择器`
- 属性嵌套：比如 `font-size, font-weight` 都以 `font` 作为属性的命名空间。
- `&`父选择器：在`嵌套的代码块`内，可以使用`&`引用父选择器。比如`a:hover伪类`，可以写成`&:hover`

```css
$black: #000;
.myFont {
  color: $black;
  font: {
    size: 14px;
    weight: bold;
  }
  a: {
    &:hover {
      color: #fff;
    }
  }
}
```

### 注释

```css
/*! 带感叹号（!）表示重要注释
**	即使在压缩编译也保留，通常用于添加版权信息
*/

/* 会保留到编译后的文件 */

// 单行注释，编译后不保留
```

## 代码重用

### 继承`@extend`

`可继承的css属性`

sass 允许一个选择器继承另一个选择器。

```css
.class1 {
  color: #fff;
  font-size: 14px;
}
.class2 {
  @extend .class1;
  border-color: #000;
}
```

### Mixin`@mixin和@include`

定义重用的代码块，使用@include 引用代码

```css
@mixin left($val: 10px) {
  float: left;
  margin-left: $val;
}
div {
  @include left(20px);
}
```

### 颜色函数

```css
lighten(#cc3, 10%) // #d6d65c
darken(#cc3, 10%) // #a3a329
grayscale(#cc3) // #808080
complement(#cc3) // #33c
hsl($hue: 0, $saturation: 100%, $lightness: 50%)
```

### 引入外部文件`@import`

```css
@import "./filename.scss" @import "./filename.css";
```

## 高级用法

### 条件语句

```css
@if lightness($color) > 30% {
  background-color: #000;
} @else {
  background-color: #fff;
}
```

### 循环语句

```css
// while 循环
$i: 6;

@while $i > 0 {
  .item-#{$i} {
    width: 2em * $i;
  }
  $i: $i - 2;
}

// for 循环
@for $i from 1 to 10 {
  .border-#{$i} {
    border: #{$i}px solid blue;
  }
}

// each， 类似JS的for-each
@each $member in a, b, c, d {
  .#{$member} {
    background-image: url("/image/#{$member}.jpg");
  }
}
```

### 自定义函数

```css
@function _double($n) {
  @return $n * 2;
}
#sidebar {
  width: _double(4px);
}
```

---
en-title: layer-usage
date: 2023-04-29 20:18:49
url: 
tags:
  - css
title: css样式隔离
---

# 写在前面

在我们平时写项目的时候，不可避免的会出现一些 Css 样式冲突的问题，我们可以通过哪些方法来避免冲突，本文讲针对此问题进行探讨

## BEM命名约定

> 在项目的css选择器前添加特定前缀

BEM（Block-Element-Modifier）是一种用于命名CSS类的约定，旨在提高样式表的可维护性和可读性。它将类名分为三个部分：块（Block）、元素（Element）和修饰符（Modifier），以描述组件的结构和状态。BEM 的目标是在不增加样式的复杂性的情况下，帮助开发者创建可预测、可重用的样式。

```html
<div class="card">
  <h2 class="card__title">Card Title</h2>
  <p class="card__description">This is a description.</p>
  <button class="card__button card__button--primary">Read More</button>
</div>

```

## CSS Module

> 模块化CSS：一个css文件就是一个独立的模块

webpack中使用：css-loader



## CSS-in-JS 

> 在js文件中写css样式

CSS-in-JS 是一种前端开发中的样式管理方法，它将CSS样式直接嵌入到JavaScript代码中。这种方法在一些现代前端框架和库中得到了广泛应用，旨在解决传统CSS在模块化、隔离和组件化方面可能出现的问题。

CSS-in-JS 的主要思想是，将组件的样式作为JavaScript对象或函数的一部分来处理，从而实现样式的模块化、隔离和动态性。这种方法有助于减少全局样式冲突、提高组件的可维护性，并允许在样式中使用JavaScript的功能。

**流行的css in js库：**

- styled-components：[github.com/styled-comp…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fstyled-components%2Fstyled-components) 
  - 搭配 React 使用
  - 样式被嵌套在组件代码中，使用模板字符串的方式，同时还支持动态的样式和主题

```js
import styled from 'styled-components';

const Button = styled.button`
  background-color: blue;
  color: white;
`;

const App = () => {
  return <Button>Click me</Button>;
};

```

- emotion：[github.com/emotion-js/…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Femotion-js%2Femotion) 

```js
import { css } from '@emotion/react';

const buttonStyles = css`
  background-color: blue;
  color: white;
`;

const Button = () => {
  return <button css={buttonStyles}>Click me</button>;
};
```

## Scoped CSS

> 在Vue中，为 `<style>` 区块添加 `scoped` 属性即可开启“组件样式作用域（Scoped CSS）”

实际上，Vue会为组件内所有元素添加一个全局唯一的属性选择器，形如

`[data-v-5298c6bf]`，这样在组件内的 CSS 就只会作用于当前组件中的元素。

```html
<template>
  <header class="header">header</header>
</template>

<style scoped>
.header {
  background-color: green;
}
</style>
```

编译后结果：

```html
<header class="header" data-v-5298c6bf>header</header>

<style>
.header[data-v-5298c6bf] {
  background-color: green;
}
</style>
```


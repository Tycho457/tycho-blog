---
en-title: layer-usage
date: 2023-04-13 19:28:19
url: 
tags:
  - 工程化
  - Webpack
title: 浅析Webpack中的HMR
---
Webpack作为现代前端开发中不可或缺的构建工具，其热模块替换（Hot Module Replacement，简称HMR）功能为开发者提供了更加高效的开发体验。本文将深入探讨Webpack HMR的原理、配置和使用方法，帮助读者更好地理解和应用这一功能。

## 什么是热模块替换（HMR）？

热模块替换是Webpack提供的一种功能，它允许在应用程序运行时，无需刷新整个页面的情况下，替换、添加或删除模块。这大大提高了开发效率，因为开发者可以即时看到对代码的更改所产生的效果，而不需要重新加载整个页面。HMR不仅适用于JavaScript模块，还可以应用于样式、图片等资源。

## HMR的工作原理

HMR的核心就是客户端从服务端拉去更新后的文件，准确的说是 chunk diff (chunk 需要更新的部分)，实际上 WDS 与浏览器之间维护了一个 `Websocket`，当本地资源发生变化时，WDS 会向浏览器推送更新，并带上构建时的 hash，让客户端与上一次资源进行对比。客户端对比出差异后会向 WDS 发起 `Ajax` 请求来获取更改内容(文件列表、hash)，这样客户端就可以再借助这些信息继续向 WDS 发起 `jsonp` 请求获取该chunk的增量更新。

后续的部分(拿到增量更新之后如何处理？哪些状态该保留？哪些又需要更新？)由 `HotModulePlugin` 来完成，提供了相关 API 以供开发者针对自身场景进行处理，像`react-hot-loader` 和 `vue-loader` 都是借助这些 API 实现 HMR。

Webpack的HMR功能依赖于两个主要部分：HMR runtime和HMR server。

- 当应用程序启动时，Webpack会在打包的JavaScript中注入HMR runtime代码。
- 当代码发生变化时，Webpack Dev Server会将更新的模块代码通过WebSocket发送给HMR runtime，然后HMR runtime会在不刷新整个页面的情况下，将新的模块代码替换到运行中的应用程序中。

## 配置Webpack以支持HMR

> 从 `webpack-dev-server` v4.0.0 开始，热模块替换是默认开启的

要启用Webpack的HMR功能，需要进行一些配置。首先，在Webpack配置文件中，你需要在开发模式下启用HMR：

```js
javascriptCopy code// webpack.config.js
module.exports = {
  // ...
  mode: 'development',
  devServer: {
    hot: true, // 启用HMR
  },
  // ...
};
```

然后，在你的应用程序代码中，你需要在适当的地方添加HMR接受模块更新的代码：

```
javascriptCopy codeif (module.hot) {
  module.hot.accept();
}
```

这将告诉HMR runtime在模块发生变化时进行热替换。

## 使用HMR的注意事项

虽然HMR能够提升开发效率，但也有一些需要注意的地方：

1. **状态保持**：HMR会保持应用程序的状态，但并不是所有的状态都会得到保留。有些状态可能会在模块替换时丢失，需要开发者自行处理。
2. **不适用于所有场景**：HMR适用于大多数场景，但并不是所有情况下都能正常工作。一些复杂的场景可能需要额外的配置或处理。
3. **样式更新**：使用HMR更新样式时，样式表通常会在不刷新页面的情况下替换，但有时仍可能出现短暂的闪烁。

## 总结

Webpack的热模块替换功能为前端开发带来了极大的便利，使开发者能够实时看到代码变更的效果，而无需手动刷新页面。通过合适的配置和使用方法，开发者可以更加高效地利用Webpack的HMR功能，从而提升开发效率。

希望本文能够帮助读者深入理解Webpack的HMR原理和使用方法，使他们在日常开发中能够更加灵活地应用这一功能。

相关参考：

[Webpack HMR 原理解析 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/30669007)
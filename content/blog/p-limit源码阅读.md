---
en-title: 
date: 2023-05-20 19:18:49
url: 
tags:
  - 源码
  - promise
title: p-limit源码学习
---

p-limit是一个限制并发的库，允许在异步任务中设置并发执行的最大数量。这对于需要控制异步操作并发性的情况非常有用，例如在网络请求、文件读写等异步操作时，可以有效地控制并发请求数量，以避免资源过度消耗或性能下降。

源码地址：[sindresorhus/p-limit: Run multiple promise-returning & async functions with limited concurrency (github.com)](https://github.com/sindresorhus/p-limit)

## 用法

在阅读源码前，我们先看一下p-limit的基本使用方法，有助于我们更好的理解源码

```js
import pLimit from 'p-limit';
// 定义并发数
const limit = pLimit(1);
// limit接受一个异步任务
const input = [
	limit(() => fetchSomething('foo')),
	limit(() => fetchSomething('bar')),
	limit(() => doSomething())
];

// 使用Promise.all来接收异步任务列表
const result = await Promise.all(input);
```

## 源码阅读

![a7d94ff095f202659a0fb3f1595bfb9](http://oss.gzhutyc.top/images/a7d94ff095f202659a0fb3f1595bfb9.png)

### 检查并发限制的有效性

```js
if (!((Number.isInteger(concurrency) || concurrency === Number.POSITIVE_INFINITY) && concurrency > 0)) {
  throw new TypeError('Expected `concurrency` to be a number from 1 and up');
}
```

在这里，代码检查传入的 `concurrency` 参数是否是一个大于等于 1 的整数，或者是否是正无穷。如果不满足这些条件，将抛出一个类型错误。

### 初始化队列和活跃函数

```js
const queue = new Queue();
let activeCount = 0;
```

创建了一个新的 `Queue` 实例，该实例将用于管理待执行的任务队列。`activeCount` 用于跟踪当前活跃的任务数量。

`Queue`是另外的一个库`yocto-queue`，实现了一个队列的结构。

在`p-limit`中主要用到了`yocto-queue`的两个方法：`enqueue`(入队)，`dequeue`(c出队)。 多个 `generator` 函数会共用一个队列。

### next函数

```js
const next = () => {
  activeCount--;

  if (queue.size > 0) {
    queue.dequeue()();
  }
};
```

`next` 函数用于从队列中获取下一个任务并执行。它会递减 `activeCount`，然后如果队列中有待执行的任务，就从队列中取出一个任务并执行。

### run函数

```js
const run = async (fn, resolve, args) => {
  activeCount++;

  const result = (async () => fn(...args))();

  resolve(result);

  try {
    await result;
  } catch {}

  next();
};
```

`run` 函数用于执行实际的异步任务。它会增加 `activeCount`，然后调用传入的异步函数 `fn` 并传递参数 `args`。执行结果会通过 `resolve` 函数返回。最后，无论任务成功还是失败，都会调用 `next` 函数

### enqueue函数

```js
const enqueue = (fn, resolve, args) => {
  queue.enqueue(run.bind(undefined, fn, resolve, args));

  (async () => {
    await Promise.resolve();

    if (activeCount < concurrency && queue.size > 0) {
      queue.dequeue()();
    }
  })();
};
```

`enqueue` 函数将待执行的任务加入到队列中。

它通过 `queue.enqueue` 方法将一个函数放入队列，这个函数实际上是 `run` 函数的部分应用，其中异步函数 `fn` 和参数 `args` 已经被绑定。然后，通过一个立即调用的异步函数，它在下一个微任务阶段检查是否可以立即执行更多任务。如果当前活跃任务数量小于 `concurrency` 且队列中还有待执行任务，则取出队列中的一个任务并执行。

### generator函数

```js
const generator = (fn, ...args) => new Promise(resolve => {
  enqueue(fn, resolve, args);
});
```

`generator` 函数用于创建一个新的异步任务。

它接受一个异步函数 `fn` 和任意数量的参数 `args`，然后将任务加入队列中，等待执行。

### generator对象属性

```js
Object.defineProperties(generator, {
  activeCount: {
    get: () => activeCount,
  },
  pendingCount: {
    get: () => queue.size,
  },
  clearQueue: {
    value: () => {
      queue.clear();
    },
  },
});

```

这一部分使用 `Object.defineProperties` 定义了 `generator` 对象的一些属性：

- `activeCount`：返回当前活跃的任务数量。
- `pendingCount`：返回队列中等待执行的任务数量。
- `clearQueue`：定义一个函数，用于清空队列中的所有待执行任务。

最后，`generator` 函数作为整个 `pLimit` 函数的返回值。


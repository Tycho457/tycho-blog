---
en-title: 
date: 2023-05-19 19:18:49
url: 
tags:
  - promise
title: promise实现并发控制
---
## 问题

```js
// 设计一个函数，可以限制请求的并发，同时请求结束之后，调用callback函数
// sendRequest(requestList:,limits,callback)
sendRequest(

[()=>request('1'),

()=>request('2'),

()=>request('3'),

()=>request('4')],

3, //并发数

(res)=>{

    console.log(res)

})

// 其中request 可以是： 
function request (url,time=1){

    return new Promise((resolve,reject)=>{

        setTimeout(()=>{

            console.log('请求结束：'+url);

            if(Math.random() > 0.5){

                resolve('成功')

            }else{

                reject('错误;')

            }

        },time*1e3)

    })
}
```

## 基础版本

实现的具体步骤：

- 创建一个请求队列，用于存储待发送的请求。
- 设置一个并发数限制，即同时处理的最大请求数量。
- 使用一个计数器来记录当前正在处理的请求数量，初始值为0。
- 遍历请求队列，对每个请求执行以下步骤： a. 如果计数器小于并发数限制，将计数器加1，并发送该请求。 b. 如果计数器等于并发数限制，使用Promise.race方法等待任一请求完成。 c. 当有请求完成时，将计数器减1，并从请求队列中移除该请求。
- 重复步骤4，直到所有请求完成

```js
async function sendRequest(requestList, limits, callback) {
    const processRequest = async (request) => {
        console.log("发送请求：",request);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        callback(request);
    }

    // 计数器
    let activeCount = 0;

    // 并发控制函数
    const controlConcurrency = async () => {
        while( activeCount < limits && requestList.length > 0) {
            const request = requestList.shift();
            activeCount++;
            await processRequest(request);
            activeCount--;
        }

        if(activeCount === 0 && requestList.length === 0) {
            callback();
        }
    }

    for(let i=0;i < limits; i++) {
        controlConcurrency();
    }
}
```

## Promise.race优化

`Promise.race`方法可以在一组请求中任何一个请求完成时就触发回调函数，这可以用于实现更实时的响应。

可以在控制并发请求的循环中使用`Promise.race`来等待最快完成的请求，并处理其结果。

核心部分（sendLimitedRequests ）：

1. 使用 `splice` 方法从 `requests` 数组中截取 `limits` 个请求，形成一个新的数组 `limitedRequests`，表示当前限制的请求数量
2. 使用 `Promise.race` 方法，传入 `limitedRequests` 数组，返回最先完成的 Promise（即最快完成的请求）
3. 使用 `await` 等待最快完成的请求的结果，并将结果保存在 `result` 变量中
4. 调用回调函数 `callback`，将请求的结果传递给回调函数
5. **重复以上步骤**，直到 `requests` 数组中的所有请求都被处理完毕

```js
async function sendRequest(requestList, limits, callback) {
    // 执行单个请求的逻辑
    const processRequest = async (request) => {
        console.log("发送请求：",request);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return request;
    }

    // 将所有请求通过 map 方法映射为执行请求的 Promise
    const requests = requestList.map((request) => processRequest(request));

    // 控制并发请求的数量
    const sendLimitedRequest = async () => {
        while(request.length > 0) {
            const limitedRequests = requests.splice(0, limits);
            const fastestPromise = Promise.race(limitedRequests);
            const result = await fastestPromise;
            callback(result);  // 请求完成后调用回调函数
        }
        callback()
    }

    sendLimitedRequest().catch((error) => {
        console.error(error);
    })
}
```

## 请求队列

将请求添加到队列中，并按照一定的策略（如先进先出）进行处理。

在控制并发请求的过程中，从队列中取出请求并执行，以保持请求的顺序性。这样可以避免同时发送大量请求，减少服务器负载。

```js
async function sendRequest(requestList, limits, callback) {
    // 执行单个请求的逻辑
    const processRequest = async (request) => {
        console.log("发送请求：",request);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return request;
    }

    const requestQueue = [...requestList];

    // 用于处理下一个请求
    const sendNextRequest = async () => {
        if(requestQueue.length === 0) {
            callback();
            return;
        }

        const request = await requestQueue.shift();
        try {
            const result = await processRequest(request);
            callback(result);
        } catch (error) {
            console.error(error)
        } finally {
            sendNextRequest();
        }
    }

    // 启动请求队列的处理
    for(let i=0; i <limits; i++) {
        sendNextRequest();
    }
}
```

## 使用缓存

对于重复的请求，可以使用缓存来存储已经获取的结果，以减少不必要的请求。

在发起新请求之前，先检查缓存中是否存在相应的结果，如果存在，则直接使用缓存的结果，而不需要进行实际的网络请求。

```js
const requestCache = new Map();

function sendRequest(requestList, limits, callback) {
  const processRequest = async (request) => {
    console.log("Sending request:", request);

    // 检查缓存中是否存在请求结果
    if (requestCache.has(request)) {
      console.log("Using cached result for request:", request);
      return requestCache.get(request);
    }

    // 执行请求的逻辑
    const result = await new Promise((resolve) => setTimeout(() => {
      resolve(request);
    }, 1000));

    // 将请求结果存入缓存
    requestCache.set(request, result);

    return result;
  };

  const sendLimitedRequests = async () => {
    while (requestList.length > 0) {
      const limitedRequests = requestList.splice(0, limits);
      const promises = limitedRequests.map(processRequest);
      const results = await Promise.all(promises);
      results.forEach((result) => {
        callback(result); // 请求完成后调用回调函数
      });
    }
    callback(); // 所有请求完成后调用回调函数
  };

  sendLimitedRequests().catch((error) => {
    console.error("Error occurred:", error);
  });
}
```
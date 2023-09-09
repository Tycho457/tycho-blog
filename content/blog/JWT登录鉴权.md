---
en-title: 
date: 2023-07-20 14:18:49
url: 
tags:
  - 计算机网络
title: JSON Web Token
---
# 写在前面
> JWT是一种基于JSON（JavaScript Object Notation）的轻量级认证和授权协议，它包含了一些声明（claims）和签名（signature），用于验证发送者身份和保护传输的信息。

# JWT工作原理


![163a569e24bffb93~tplv-t2oaga2asx-zoom-in-crop-mark_3024_0_0_0.webp](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34dda0e30b01485299ed222eef01a844~tplv-k3u1fbpfcp-watermark.image?)
1.  浏览器首次登录，post携带用户名和密码请求服务器
1.  服务器将用户信息生成`jwt`，并返回给客户端
1.  浏览器拿到`jwt`之后，可以保存到`cookie`或者`localStorage`、`sessionStorage`中
1.  浏览器下次请求接口，将`jwt`放到请求头`header`中（默认格式`Authorization: Bearer jwt`）
1.  服务端检查`jwt`的签名信息，从`jwt`中获取用户信息，并执行后续操作。反之，权限校验失败

# JWT组成
- Header：定义加密方式和令牌类型
    - {  "alg": "HS256",  "typ": "JWT"}
- Payload：定义需要加密的数据
    - {  "sub": "1234567890",  "name": "John Doe",  "admin": true}
- Signature：由前两部分加密组成，主要用来验证发生请求者身份
# JWT实现
（1）后端：express-jwt、jsonwebtoken

（2）前端：axios拦截器、localstorage存储token
# 参考
[《JSON Web Token 入门教程 - 阮一峰》](https://link.juejin.cn/?target=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2018%2F07%2Fjson_web_token-tutorial.html "http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html")

[jwt.io](jwt.io)
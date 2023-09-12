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


![163a569e24bffb93~tplv-t2oaga2asx-zoom-in-crop-mark_3024_0_0_0.webp](https://oss.gzhutyc.top/images/8500a780750492e4a81dbab7111cf66.png)
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
（1）后端：express-jwt、jsonwebtoken（两个npm包）

处理用户登录时，生成token并把token放回给前端

```js
// /routes/user.js
if (user !== null) {
  let token = jwt.sign(tokenObj, secretKey, {
        expiresIn : 60 * 60 * 24 
  });
  res.json({
        success: true,
        message: 'success',
        token: token
  });
} 
```

设置拦截token的中间件，用于token的验证和错误信息的返回

```js
const expressJwt = require("express-jwt");
const { secretKey } = require('../constant/constant');
// express-jwt中间件自动完成了token的验证以及错误处理，unless中存放的不需要检验token的api。
const jwtAuth = expressJwt({secret: secretKey}).unless({path: ["/api/user/login", "/api/user/register"]}); 

module.exports = jwtAuth;
```

```js
const crypto = require('crypto');

module.exports = {
  MD5_SUFFIX: 'luffyZhou我是一个固定长度的盐值',
  md5: (pwd) => {
    let md5 = crypto.createHash('md5');
    return md5.update(pwd).digest('hex');
  },
  secretKey: 'luffy_1993711_26_jwttoken'
};
```

（2）前端：axios拦截器、token持久化存储（这里采用localstorage）

前端需要做的主要有两处：

1、拿到toekn并用localstorage进行存储

2、拦截请求，将token放在header头部的Authorization字段中

```js
// axios拦截器
// 拦截请求，给所有的请求都带上token
axios.interceptors.request.use(request => {
  const tycho_token = window.localStorage.getItem('tycho_token');
  if (tycho_token) {
    request.headers['Authorization'] =`Bearer ${tycho_token}`;
  }
  return request;
});

// 拦截响应，遇到token不合法则报错
axios.interceptors.response.use(
  response => {
    if (response.data.token) {
      console.log('token:', response.data.token);
      window.localStorage.setItem('tycho_token', response.data.token);
    }
    return response;
  },
  error => {
    const errRes = error.response;
    if (errRes.status === 401) {
      window.localStorage.removeItem('tycho_token');
      swal('Auth Error!', `${errRes.data.error.message}, please login!`, 'error')
      .then(() => {
        history.push('/login');
      });
    }
    return Promise.reject(error.message);   // 返回接口返回的错误信息
  });
```



# 参考

[《JSON Web Token 入门教程 - 阮一峰》](https://link.juejin.cn/?target=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2018%2F07%2Fjson_web_token-tutorial.html "http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html")

[jwt.io](jwt.io)
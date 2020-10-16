const config = {
    serverDomain:"", // 服务端如有做代理，指向的域名
    serverURL:"http://192.168.53.147",
    serverPort: "8088", // 应用程序启动端口号
    keys: ["app-keys"], // 用于session加密
    session: { // session配置
        key: 'koa:sid', /**  cookie的key。 (默认是 koa:sess) */
        maxAge: 24 * 3600 * 1000,   /**  session 过期时间，以毫秒ms为单位计算 。*/
        autoCommit: true, /** 自动提交到响应头。(默认是 true) */
        overwrite: true, /** 是否允许重写 。(默认是 true) */
        httpOnly: true, /** 是否设置HttpOnly，如果在Cookie中设置了"HttpOnly"属性，那么通过程序(JS脚本、Applet等)将无法读取到Cookie信息，这样能有效的防止XSS攻击。  (默认 true) */
        signed: true, /** 是否签名。(默认是 true) */
        rolling: true, /** 是否每次响应时刷新Session的有效期。(默认是 false) */
        renew: false, /** 是否在Session快过期时刷新Session的有效期。(默认是 false) */
    },
    secret: "token-keys", // token秘钥
    mysql: {
        host: "127.0.0.1",
        port: "3306",
        user: "mockapi",
        password: "mockapi_123",
        database: "mockapi"
    }
}

module.exports = config;
const koajwt = require("koa-jwt");
const config = require("../config");

module.exports = {
    nextCatch: ()=>{
        return async (ctx, next) => {
            return next().catch((err) => {
                if (401 == err.status) {
                    ctx.status = 401;
                    // ctx.body = 'Protected resource, use Authorization header to get access\n';
                    ctx.body = "need a token~";
                } else {
                    throw err;
                }
            });
        }
    },
    nuless: ()=>{
        // 在这里完成了
        // 1、获取客户端的token # ctx.headers.authorization
        // 2、过滤不需要token验证的路由
        // 如果token获取失败会抛出异常，进入上方的catch
        // 如果成功会把token的数据挂载到ctx.state.user里头，然后next()
        return koajwt({ secret: config.secret }).unless({
            path: [
                /^\/api\/v1\/captcha/,
                /^\/api\/v1\/users\/login/,
                /^\/api\/v1\/users\/login/,
                /^\/api\/v1\/users\/register/,
                /^\/api\/v1\/users\/getpwd/,
                /^\/api\/v1\/data/
            ]
        });
        // return koajwt({ secret: config.secret });
    },
    checkToken: ()=>{
        // 这里是验证token的有效性，如是否存在，是否过期等
        return async (ctx, next) => {
            console.log("aaa....",ctx.state.user);
            // ctx.body = ctx.state.user;
            await next();
        }
    }
}
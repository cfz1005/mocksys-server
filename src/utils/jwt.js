const jwt = require("jsonwebtoken");
const response = require("./response");
const config = require("../config");
const tokens = require("../controller/tokens");

module.exports = {
    verify: () => {
        return async (ctx, next) => {
            if (unless(ctx.path)) {
                await next();
            } else {
                if (ctx.header && ctx.header.token) {
                    try {
                        // 这个查询是考虑到，比如后台禁用了该用户
                        let res = await tokens.getModelByValue(ctx.header.token);
                        if (!res.length) {
                            return response.json(ctx, "", 403, "Token validation failed~");
                        }

                        let token = jwt.verify(ctx.header.token, config.secret, { complete: true });
                        ctx.state.user = token.payload; // ctx.body = token;
                        await next();
                    } catch (error) {
                        // ctx.status = 400;
                        // console.log(error,error.status,error.message);
                        // return response.json(ctx, "", 403, "Token validation failed~");
                        if(error.status){
                            return response.json(ctx, "", 500, "server error~");
                        }else{
                            return response.json(ctx, "", 403, "Token validation failed~");
                        }
                    }
                } else {
                    // ctx.throw(401, "该接口需要提供token");
                    // ctx.status = 400;
                    return response.json(ctx, "", 402, "need a token~");
                }
            }
        }
    },
    sign: (payload = {}) => {
        return jwt.sign(payload, config.secret, { expiresIn: "4h" }); // 有效期4小时
        return jwt.sign(payload, config.secret, { expiresIn: 10 }); // 有效期10秒
        // expiresIn：以秒表示或描述时间跨度zeit / ms的字符串。如：60，"2 days"，"10h"，"7d"
    }
}

// privated
let unless = (path) => {
    let urls = [
        /^\/api\/v1\/captcha/,
        /^\/api\/v1\/users\/login/,
        /^\/api\/v1\/users\/login/,
        /^\/api\/v1\/users\/register/,
        /^\/api\/v1\/users\/getpwd/,
        /^\/api\/v1\/bing/,
        /^\/api\/v1\/mock/
    ];
    let res = false;
    res = urls.some((p) => {
        return p.test(path);
    });
    return res;
}